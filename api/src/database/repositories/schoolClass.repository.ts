import { AppDataSource } from '../db';
import { SchoolClass } from '../entities/SchoolClass';
export const SchoolClassRepository = AppDataSource.getRepository(SchoolClass);
