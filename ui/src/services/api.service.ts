import { StudentDto, SchoolClassDto, PostAttendanceDto, GetAttendanceResponseDto, CreateTriggerDto, TriggerResponseDto, ConcernResponseDto, UpdateConcernDto } from '@orah/shared';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export class ApiService {
  static async checkHealth(): Promise<boolean> {
    const response = await fetch(`${BASE_URL}/health`);
    if (!response.ok) return false;
    const data = await response.json();
    return data?.message === 'I am healthy!';
  }

  static async getStudents(): Promise<StudentDto[]> {
    const response = await fetch(`${BASE_URL}/students`);
    if (!response.ok) throw new Error('Failed to fetch students');
    return response.json();
  }

  static async getClasses(): Promise<SchoolClassDto[]> {
    const response = await fetch(`${BASE_URL}/classes`);
    if (!response.ok) throw new Error('Failed to fetch classes');
    return response.json();
  }

  static async postAttendance(dto: PostAttendanceDto): Promise<void> {
    const response = await fetch(`${BASE_URL}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto)
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Failed to post attendance');
    }
  }

  static async getAttendance(classId: string, date: string): Promise<GetAttendanceResponseDto> {
    const response = await fetch(`${BASE_URL}/attendance?classId=${classId}&date=${date}`);
    if (!response.ok) throw new Error('Failed to fetch attendance');
    return response.json();
  }

  static async postTrigger(dto: CreateTriggerDto): Promise<void> {
    const response = await fetch(`${BASE_URL}/triggers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto)
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || 'Failed to create trigger');
    }
  }

  static async getTriggers(): Promise<TriggerResponseDto[]> {
    const response = await fetch(`${BASE_URL}/triggers`);
    if (!response.ok) throw new Error('Failed to fetch triggers');
    return response.json();
  }

  static async getConcerns(): Promise<ConcernResponseDto[]> {
    const response = await fetch(`${BASE_URL}/concerns`);
    if (!response.ok) throw new Error('Failed to fetch incidents');
    return response.json();
  }

  static async updateConcern(id: string, dto: UpdateConcernDto): Promise<void> {
    const response = await fetch(`${BASE_URL}/concerns/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto)
    });
    if (!response.ok) {
      throw new Error('Failed to update incident');
    }
  }
}
