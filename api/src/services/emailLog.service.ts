import { EmailLogRepository } from '../database/repositories/emailLog.repository';
import { Concern } from '../database/entities/Concern';

export class EmailLogService {
  static async logEmail(to_address: string, subject: string, body: string, concern?: Concern): Promise<void> {
    const log = EmailLogRepository.create({
      to_address,
      subject,
      body,
      concern,
    });
    await EmailLogRepository.save(log);
  }
}
