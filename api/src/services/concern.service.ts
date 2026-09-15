import { AppDataSource } from '../database/db';
import { Concern } from '../database/entities/Concern';
import { ConcernResponseDto, AbsentCriteria, UpdateConcernDto } from '@orah/shared';

export class ConcernService {
  static async getAll(): Promise<ConcernResponseDto[]> {
    const repo = AppDataSource.getRepository(Concern);
    const concerns = await repo.find({
      relations: ['student', 'trigger', 'trigger.class', 'emailLogs'],
      order: {
        created_at: 'DESC'
      }
    });

    return concerns.map(i => {
      let triggerDetails = 'Unknown trigger';
      if (i.trigger) {
        const t = i.trigger;
        const condition = t.absent_criteria === AbsentCriteria.CONSECUTIVE ? 'in a row' : 'in total';
        triggerDetails = `${t.target_absent_days} absences ${condition} within ${t.time_period} ${t.time_unit}`;
      }

      return {
        id: i.id,
        createdAt: i.created_at.toISOString(),
        status: i.status,
        notes: i.notes,
        studentName: i.student ? i.student.name : 'Unknown',
        className: i.trigger && i.trigger.class ? i.trigger.class.name : 'Any Class',
        triggerDetails,
        emailLogs: i.emailLogs?.map(log => ({
          to_address: log.to_address,
          subject: log.subject,
          body: log.body,
          sent_at: log.sent_at.toISOString()
        })) || []
      };
    });
  }

  static async update(id: string, dto: UpdateConcernDto): Promise<void> {
    const repo = AppDataSource.getRepository(Concern);
    const concern = await repo.findOneBy({ id });
    if (!concern) throw new Error('Concern not found');
    
    if (dto.status !== undefined) {
      concern.status = dto.status;
    }
    if (dto.notes !== undefined) {
      concern.notes = dto.notes;
    }
    
    await repo.save(concern);
  }
}
