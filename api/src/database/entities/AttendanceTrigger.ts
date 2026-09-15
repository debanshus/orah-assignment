import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Concern } from './Concern';
import { SchoolClass } from './SchoolClass';
import { AbsentCriteria, CriteriaMetFrequency, EmailSchedule } from '@orah/shared';

@Entity('attendance_triggers')
export class AttendanceTrigger {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => SchoolClass, { nullable: true })
  @JoinColumn({ name: 'class_id' })
  class: SchoolClass;

  @Column({ type: 'enum', enum: AbsentCriteria })
  absent_criteria: AbsentCriteria;

  @Column({ type: 'int' })
  target_absent_days: number;

  @Column({ type: 'int', nullable: true })
  time_period: number;

  @Column({ type: 'varchar', nullable: true })
  time_unit: string;

  @Column({ type: 'enum', enum: CriteriaMetFrequency })
  criteria_met_frequency: CriteriaMetFrequency;

  @Column({ type: 'enum', enum: EmailSchedule })
  mail_schedule: EmailSchedule;

  @Column({ type: 'int', nullable: true })
  mail_delay_in_hours: number;

  @Column({ type: 'varchar', nullable: true })
  mail_schedule_time: string;

  @Column({ type: 'simple-array' })
  mail_recipients: string[];

  @OneToMany(() => Concern, (incident) => incident.trigger)
  concerns: Concern[];
}
