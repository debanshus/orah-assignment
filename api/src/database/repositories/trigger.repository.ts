import { AppDataSource } from '../db';
import { AttendanceTrigger } from '../entities/AttendanceTrigger';

export const TriggerRepository = AppDataSource.getRepository(AttendanceTrigger);
