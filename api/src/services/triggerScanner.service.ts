import { AppDataSource } from '../database/db';
import { AttendanceTrigger } from '../database/entities/AttendanceTrigger';
import { AttendanceRecord } from '../database/entities/AttendanceRecord';
import { Concern } from '../database/entities/Concern';
import { Student } from '../database/entities/Student';
import { AbsentCriteria, CriteriaMetFrequency, AttendanceStatus, ConcernStatus } from '@orah/shared';
import { LessThanOrEqual } from 'typeorm';

export class TriggerScannerService {

  static async scan(triggeringClassId: string, triggeringDate: string, studentIds: string[]) {
    const triggerRepo = AppDataSource.getRepository(AttendanceTrigger);
    const triggers = await triggerRepo.find({ relations: ['class'] });

    for (const studentId of studentIds) {
      for (const trigger of triggers) {
        if (trigger.class && trigger.class.id !== triggeringClassId) {
          continue;
        }
        await this.evaluateStudentTrigger(studentId, trigger, triggeringDate);
      }
    }
  }

  private static async evaluateStudentTrigger(studentId: string, trigger: AttendanceTrigger, triggeringDate: string) {
    const attendanceRecordRepo = AppDataSource.getRepository(AttendanceRecord);
    const concernRepo = AppDataSource.getRepository(Concern);

    const whereClause: any = {
      student: { id: studentId },
      date: LessThanOrEqual(triggeringDate),
    };
    
    if (trigger.class) {  
      whereClause.class = { id: trigger.class.id };
    }

    const attendanceRecords = await attendanceRecordRepo.find({
      where: whereClause,
      order: { date: 'DESC' },
    });

    if (attendanceRecords.length === 0) return;

    const recordsOnTriggeringDate = attendanceRecords.filter(r => r.date === triggeringDate);
    if (!recordsOnTriggeringDate.some(r => r.status === AttendanceStatus.ABSENT)) {
      return;
    }

    // =================================================================================
    // STEP 1: CALCULATE THE EVALUATION TIMEFRAME
    // We look backward from the date the attendance was taken (triggeringDate).
    // Based on the trigger's time_unit (days, weeks, months) and time_period,
    // we establish a 'startDate' to bound our query.
    // =================================================================================
    const targetDate = new Date(triggeringDate);
    const startDate = new Date(targetDate);
    if (trigger.time_unit === 'days') startDate.setDate(startDate.getDate() - trigger.time_period);
    else if (trigger.time_unit === 'weeks') startDate.setDate(startDate.getDate() - (trigger.time_period * 7));
    else if (trigger.time_unit === 'months') startDate.setMonth(startDate.getMonth() - trigger.time_period);

    // Filter the student's history to only include records within this time window.
    const timeframeRecords = attendanceRecords.filter(r => {
      const rDate = new Date(r.date);
      return rDate >= startDate && rDate <= targetDate;
    });

    let conditionMet = false;

    // =================================================================================
    // STEP 2: EVALUATE "IN A ROW" (CONSECUTIVE) vs "IN TOTAL" (PERIOD)
    // =================================================================================
    if (trigger.absent_criteria === AbsentCriteria.CONSECUTIVE) {
      let consecutiveAbsences = 0;
      for (const r of timeframeRecords) {
        if (r.status === AttendanceStatus.ABSENT) consecutiveAbsences++;
        else break; // Streak broken by a present mark
      }
      
      if (trigger.criteria_met_frequency === CriteriaMetFrequency.ONCE) {
        conditionMet = consecutiveAbsences === trigger.target_absent_days;
      } else {
        conditionMet = consecutiveAbsences >= trigger.target_absent_days;
      }

    } else if (trigger.absent_criteria === AbsentCriteria.PERIOD) {
      const totalAbsences = timeframeRecords.filter(r => r.status === AttendanceStatus.ABSENT).length;
      
      if (trigger.criteria_met_frequency === CriteriaMetFrequency.ONCE) {
        conditionMet = totalAbsences === trigger.target_absent_days;
      } else {
        conditionMet = totalAbsences >= trigger.target_absent_days;
      }
    }

    // =================================================================================
    // STEP 3: PREVENT DUPLICATES AND RECORD THE INCIDENT
    // =================================================================================
    if (conditionMet) {
      if (trigger.criteria_met_frequency === CriteriaMetFrequency.ONCE) {
        const existingConcern = await concernRepo.findOne({
          where: {
            trigger: { id: trigger.id },
            student: { id: studentId }
          }
        });
        if (existingConcern) return; // Already triggered, skip alerting
      }

      // Log the concern in the database so staff can follow up and track status.
      const concern = concernRepo.create({
        trigger: { id: trigger.id },
        student: { id: studentId },
        status: ConcernStatus.OPEN,
      });
      await concernRepo.save(concern);
    }
  }
}
