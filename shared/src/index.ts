export interface StudentDto {
  id: string;
  name: string;
  email: string;
  parentEmail?: string;
  rollNumber?: number;
}

export interface SchoolClassDto {
  id: string;
  name: string;
}

export interface AttendanceRecordDto {
  studentId: string;
  studentName?: string;
  rollNumber?: number;
  status: 'present' | 'absent';
}

export interface PostAttendanceDto {
  classId: string;
  date: string;
  records: AttendanceRecordDto[];
}

export interface GetAttendanceResponseDto {
  classId: string;
  date: string;
  records: AttendanceRecordDto[];
}

export * from './enums.js';
import { AbsentCriteria, CriteriaMetFrequency, EmailSchedule, TriggerRecipient, ConcernStatus } from './enums.js';

export interface CreateTriggerDto {
  classId: string; // 'any' or actual classId
  targetAbsentDays: number;
  absentCriteria: AbsentCriteria;
  timePeriod: number;
  timeUnit: string;
  criteriaMetFrequency: CriteriaMetFrequency;
  mail_recipients: TriggerRecipient[];
  mail_schedule: EmailSchedule;
  mail_delay_in_hours?: number;
  mail_schedule_time?: string;
}

export interface TriggerResponseDto {
  id: string;
  className: string;
  targetAbsentDays: number;
  absentCriteria: AbsentCriteria;
  timePeriod: number;
  timeUnit: string;
  criteriaMetFrequency: CriteriaMetFrequency;
  mail_recipients: TriggerRecipient[];
  mail_schedule: EmailSchedule;
  mail_delay_in_hours?: number;
  mail_schedule_time?: string;
}

export interface ConcernResponseDto {
  id: string;
  createdAt: string;
  status: ConcernStatus;
  notes?: string;
  studentName: string;
  className: string;
  triggerDetails: string;
  emailLogs?: { to_address: string; subject: string; body: string; sent_at: string; }[];
}

export interface UpdateConcernDto {
  notes?: string;
  status?: ConcernStatus;
}
