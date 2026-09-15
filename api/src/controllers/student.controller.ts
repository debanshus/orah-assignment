import { Request, Response } from 'express';
import { StudentService } from '../services/student.service';

export class StudentController {
  static async getAll(_req: Request, res: Response) {
    try {
      const students = await StudentService.getAll();
      res.json(students);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
