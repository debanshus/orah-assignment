import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import 'dotenv/config';
import { AppDataSource } from '../database/db';
import { Concern } from '../database/entities/Concern';
import { ConcernStatus, TriggerRecipient } from '@orah/shared';
import { EmailLogService } from './emailLog.service';

const connection = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
});

const queueName = process.env.QUEUE_NAME || 'email-job';
const emailQueue = new Queue(queueName, { connection });

export class EmailProducerService {
  static async processConcerns() {
    const concernRepo = AppDataSource.getRepository(Concern);
    
    // Find all OPEN concerns with their related triggers, students, and classes
    const concerns = await concernRepo.find({
      where: { status: ConcernStatus.OPEN },
      relations: ['trigger', 'student', 'trigger.class']
    });

    for (const concern of concerns) {
      const { trigger, student } = concern;
      if (!trigger || !student) continue;

      const className = trigger.class ? trigger.class.name : 'Any Class';
      const triggerDetails = `${trigger.target_absent_days} absences ${trigger.absent_criteria} within ${trigger.time_period} ${trigger.time_unit}`;

      // Queue email for student if required
      if (trigger.mail_recipients.includes(TriggerRecipient.STUDENTS) && student.email) {
        await emailQueue.add('send-email', {
          toemail: student.email,
          studentName: student.name,
          className,
          triggerDetails,
          recipientType: 'student'
        });
        
        // Log locally (simulating that an email is enqueued to be sent)
        await EmailLogService.logEmail(student.email, `Attendance Alert: ${className}`, `[Enqueued] Trigger: ${triggerDetails}`, concern);
      }

      // Queue email for parents if required
      if (trigger.mail_recipients.includes(TriggerRecipient.PARENTS) && student.parent_email) {
        await emailQueue.add('send-email', {
          toemail: student.parent_email,
          studentName: student.name,
          className,
          triggerDetails,
          recipientType: 'parent'
        });
        
        await EmailLogService.logEmail(student.parent_email, `Attendance Alert for ${student.name}: ${className}`, `[Enqueued] Trigger: ${triggerDetails}`, concern);
      }

      // Update concern status so we don't process it again next tick
      concern.status = ConcernStatus.IN_PROGRESS;
      await concernRepo.save(concern);
    }
  }
}
