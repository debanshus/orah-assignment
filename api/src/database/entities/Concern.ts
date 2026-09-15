import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { AttendanceTrigger } from './AttendanceTrigger';
import { Student } from './Student';
import { EmailLog } from './EmailLog';
import { ConcernStatus } from '@orah/shared';

@Entity('concerns')
export class Concern {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'enum', enum: ConcernStatus, default: ConcernStatus.OPEN })
  status: ConcernStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => AttendanceTrigger, (trigger) => trigger.concerns)
  @JoinColumn({ name: 'trigger_id' })
  trigger: AttendanceTrigger;

  @ManyToOne(() => Student, (student) => student.concerns)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @OneToMany(() => EmailLog, (emailLog) => emailLog.concern)
  emailLogs: EmailLog[];
}
