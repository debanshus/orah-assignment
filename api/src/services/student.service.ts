import { StudentRepository } from '../database/repositories/student.repository';
import { StudentDto } from '@orah/shared';

export class StudentService {
  static async getAll(): Promise<StudentDto[]> {
    const students = await StudentRepository.find({
      order: {
        roll_number: 'ASC',
      },
    });
    return students.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      parentEmail: s.parent_email,
      rollNumber: s.roll_number,
    }));
  }
}
