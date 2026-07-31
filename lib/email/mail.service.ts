import nodemailer from 'nodemailer';
import { getTemplate } from './templates';

interface EmailPayload {
  to: string;
  subject: string;
  templateName: 'welcome' | 'reminder' | 'weekly' | 'achievement' | 'reset-password';
  templateData?: Record<string, any>;
}

class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('SMTP connection verified successfully.');
      return true;
    } catch (error: any) {
      console.error('SMTP connection verification failed:', error.message || 'Unknown error');
      return false;
    }
  }

  async sendMail(payload: EmailPayload, retryCount = 0): Promise<boolean> {
    const { to, subject, templateName, templateData } = payload;
    const html = getTemplate(templateName, templateData);

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"Ascend AI" <theatredreamers@gmail.com>',
        to,
        subject,
        html,
      });
      return true;
    } catch (error: any) {
      if (retryCount < 3) {
        console.warn(`Email sending failed, retrying (${retryCount + 1}/3)...`);
        return this.sendMail(payload, retryCount + 1);
      }
      console.error('Email sending failed after 3 retries:', error.message || 'Unknown error');
      return false;
    }
  }
}

export const mailService = new MailService();
