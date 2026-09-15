export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
}

export enum AbsentCriteria {
  CONSECUTIVE = 'consecutive',
  PERIOD = 'period',
}

export enum CriteriaMetFrequency {
  ONCE = 'once',
  EACH = 'each',
}

export enum EmailSchedule {
  IMMEDIATELY = 'immediately',
  DELAYED = 'delayed',
  AT_THIS_TIME = 'at_this_time',
}

export enum TriggerRecipient {
  STUDENTS = 'students',
  PARENTS = 'parents',
}

export enum ConcernStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
}
