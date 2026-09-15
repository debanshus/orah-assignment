import { Request, Response } from 'express';
import { AttendanceService } from '../services/attendance.service';

export class AttendanceController {
  static async postAttendance(req: Request, res: Response) {
    try {
      await AttendanceService.postAttendance(req.body);
      res.status(201).json({ message: 'Attendance records saved' });
    } catch (error: any) {
      if (error.message === 'No attendance records provided') {
        res.status(400).json({ message: error.message });
      } else if (error.message === 'Class not found') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  }

  static async getAttendance(req: Request, res: Response) {
    try {
      const { classId, date } = req.query;
      if (!classId || !date) {
        res.status(400).json({ message: 'classId and date are required' });
        return;
      }
      const data = await AttendanceService.getAttendance(classId as string, date as string);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
