import { AppDataSource } from '../db';
import { AttendanceRecord } from '../entities/AttendanceRecord';
export const AttendanceRepository = AppDataSource.getRepository(AttendanceRecord);
