import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import 'dotenv/config';
import { EmailService } from './email.service';

const connection = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
});

const queueName = process.env.QUEUE_NAME || 'email-job';

console.log(`🚀 Starting Email Worker for queue: ${queueName}`);

const worker = new Worker(queueName, async (job: Job) => {
  const { toemail, studentName, className, triggerDetails, recipientType } = job.data;
  console.log(`Processing job ${job.id}: Sending email to ${toemail}`);
  
  await EmailService.sendEmail(
    toemail,
    studentName,
    className,
    triggerDetails,
    recipientType || 'student'
  );
  
  console.log(`✅ Successfully sent email to ${toemail}`);
}, { connection });

worker.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err);
});
