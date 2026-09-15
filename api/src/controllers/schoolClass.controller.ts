import { Request, Response } from 'express';
import { SchoolClassService } from '../services/schoolClass.service';

export class SchoolClassController {
  static async getAll(_req: Request, res: Response) {
    try {
      const classes = await SchoolClassService.getAll();
      res.json(classes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
