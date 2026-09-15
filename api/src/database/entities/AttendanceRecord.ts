import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Student } from './Student';
import { SchoolClass } from './SchoolClass';
import { AttendanceStatus } from '@orah/shared';

@Entity('attendance_records')
export class AttendanceRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'enum', enum: AttendanceStatus })
  status: AttendanceStatus;

  @ManyToOne(() => Student, (student) => student.attendanceRecords)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => SchoolClass, (schoolClass) => schoolClass.attendanceRecords)
  @JoinColumn({ name: 'class_id' })
  class: SchoolClass;
}

