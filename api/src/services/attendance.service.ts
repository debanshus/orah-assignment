import { AttendanceRepository } from '../database/repositories/attendance.repository';
import { SchoolClassRepository } from '../database/repositories/schoolClass.repository';
import { PostAttendanceDto, GetAttendanceResponseDto, AttendanceRecordDto } from '@orah/shared';
import { AttendanceStatus } from '@orah/shared';
import { AttendanceRecord } from '../database/entities/AttendanceRecord';
import { Student } from '../database/entities/Student';
import { TriggerScannerService } from './triggerScanner.service';

export class AttendanceService {
  static async postAttendance(dto: PostAttendanceDto): Promise<void> {
    if (!dto.records || dto.records.length === 0) {
      throw new Error('No attendance records provided');
    }

    const schoolClass = await SchoolClassRepository.findOneBy({ id: dto.classId });
    if (!schoolClass) {
      throw new Error('Class not found');
    }

    const recordsToSave = dto.records.map((r) => {
      const record = new AttendanceRecord();
      record.date = dto.date;
      record.status = r.status as AttendanceStatus;
      
      const student = new Student();
      student.id = r.studentId;
      record.student = student;
      
      record.class = schoolClass;
      return record;
    });

    await AttendanceRepository.save(recordsToSave);

    const studentIds = dto.records.map((r) => r.studentId);
    await TriggerScannerService.scan(dto.classId, dto.date, studentIds);
  }

  static async getAttendance(classId: string, date: string): Promise<GetAttendanceResponseDto> {
    const records = await AttendanceRepository.find({
      where: {
        class: { id: classId },
        date: date,
      },
      relations: ['student'],
      order: {
        student: {
          roll_number: 'ASC',
        },
      },
    });

    return {
      classId,
      date,
      records: records.map((r) => ({
        studentId: r.student.id,
        studentName: r.student.name,
        rollNumber: r.student.roll_number,
        status: r.status as 'present' | 'absent',
      })),
    };
  }
}
