import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AttendanceRecord } from './AttendanceRecord';

@Entity('school_classes')
export class SchoolClass {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => AttendanceRecord, (record) => record.class)
  attendanceRecords: AttendanceRecord[];
}
