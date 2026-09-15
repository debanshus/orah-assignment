import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AttendanceRecord } from './AttendanceRecord';
import { Concern } from './Concern';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ type: 'int', nullable: true })
  roll_number: number;

  @Column({ nullable: true })
  parent_email: string;

  @OneToMany(() => AttendanceRecord, (record) => record.student)
  attendanceRecords: AttendanceRecord[];

  @OneToMany(() => Concern, (incident) => incident.student)
  concerns: Concern[];
}

