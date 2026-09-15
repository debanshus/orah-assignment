import { AppDataSource } from '../db';
import { Student } from '../entities/Student';
export const StudentRepository = AppDataSource.getRepository(Student);
