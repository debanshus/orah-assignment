import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export class EmailService {
  static async sendEmail(
    to: string,
    studentName: string,
    className: string,
    triggerDetails: string,
    recipientType: 'student' | 'parent'
  ): Promise<void> {
    const isStudent = recipientType === 'student';
    const htmlBody = isStudent ? `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #1e3a8a; padding: 20px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0;">Attendance Alert</h2>
        </div>
        <div style="padding: 30px;">
          <p>Hi <strong>${studentName}</strong>,</p>
          <p>We are reaching out regarding your attendance in <strong>${className}</strong>.</p>
          <p>This is an automated alert generated because your attendance has met the following criteria:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-left: 4px solid #ef4444; margin: 20px 0; border-radius: 4px;">
            <strong>Trigger Details:</strong><br/>
            ${triggerDetails}
          </div>
          <p>Consistent attendance is critical to your academic success. Please connect with your instructor or academic advisor as soon as possible to discuss your absences and catch up on any missed work.</p>
          <p>Best regards,<br/>The Orah Administration Team</p>
        </div>
      </div>
    ` : `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #1e3a8a; padding: 20px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0;">Student Attendance Alert</h2>
        </div>
        <div style="padding: 30px;">
          <p>Dear Parent/Guardian,</p>
          <p>We are writing to inform you about an attendance concern regarding your child, <strong>${studentName}</strong>, in their <strong>${className}</strong> class.</p>
          <p>An automated alert has been triggered because their attendance has met the following criteria:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-left: 4px solid #ef4444; margin: 20px 0; border-radius: 4px;">
            <strong>Trigger Details:</strong><br/>
            ${triggerDetails}
          </div>
          <p>We kindly ask that you discuss this with ${studentName}. If you have any questions or if there are extenuating circumstances we should be aware of, please contact the school administration.</p>
          <p>Sincerely,<br/>The Orah Administration Team</p>
        </div>
      </div>
    `;

    const subject = isStudent 
      ? `Attendance Alert: ${className}` 
      : `Attendance Alert for ${studentName}: ${className}`;

    await transporter.sendMail({
      from: `"Orah Alerts" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html: htmlBody,
    });
  }
}
