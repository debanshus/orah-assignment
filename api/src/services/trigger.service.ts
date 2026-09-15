import { TriggerRepository } from '../database/repositories/trigger.repository';
import { SchoolClassRepository } from '../database/repositories/schoolClass.repository';
import { CreateTriggerDto } from '@orah/shared';
import { AttendanceTrigger } from '../database/entities/AttendanceTrigger';

export class TriggerService {
  static async createTrigger(dto: CreateTriggerDto): Promise<AttendanceTrigger> {
    const trigger = new AttendanceTrigger();
    
    if (dto.classId && dto.classId !== 'any') {
      const schoolClass = await SchoolClassRepository.findOneBy({ id: dto.classId });
      if (schoolClass) {
        trigger.class = schoolClass;
      }
    }
    
    trigger.target_absent_days = dto.targetAbsentDays;
    trigger.absent_criteria = dto.absentCriteria;
    trigger.time_period = dto.timePeriod;
    trigger.time_unit = dto.timeUnit;
    trigger.criteria_met_frequency = dto.criteriaMetFrequency;
    trigger.mail_schedule = dto.mail_schedule;
    trigger.mail_recipients = dto.mail_recipients;
    
    if (dto.mail_delay_in_hours !== undefined) {
      trigger.mail_delay_in_hours = dto.mail_delay_in_hours;
    }
    
    if (dto.mail_schedule_time !== undefined) {
      trigger.mail_schedule_time = dto.mail_schedule_time;
    }

    return await TriggerRepository.save(trigger);
  }

  static async getTriggers(): Promise<any[]> {
    const triggers = await TriggerRepository.find({
      relations: ['class'],
    });

    return triggers.map((t) => ({
      id: t.id,
      className: t.class ? t.class.name : 'any class',
      targetAbsentDays: t.target_absent_days,
      absentCriteria: t.absent_criteria,
      timePeriod: t.time_period,
      timeUnit: t.time_unit,
      criteriaMetFrequency: t.criteria_met_frequency,
      mail_recipients: t.mail_recipients,
      mail_schedule: t.mail_schedule,
      mail_delay_in_hours: t.mail_delay_in_hours,
      mail_schedule_time: t.mail_schedule_time,
    }));
  }
}
