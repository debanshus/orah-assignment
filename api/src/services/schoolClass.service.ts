import { SchoolClassRepository } from '../database/repositories/schoolClass.repository';
import { SchoolClassDto } from '@orah/shared';

export class SchoolClassService {
  static async getAll(): Promise<SchoolClassDto[]> {
    const classes = await SchoolClassRepository.find();
    return classes.map(c => ({
      id: c.id,
      name: c.name
    }));
  }
}
