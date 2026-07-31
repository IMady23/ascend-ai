import { Resend } from 'resend';
import { UserProfile } from '@/types/user';

// Mock/stub if RESEND_API_KEY is missing, but will function if provided.
const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');

export class EmailEngine {
  static async sendDailyReminder(user: UserProfile) {
    if (!process.env.RESEND_API_KEY) {
      console.log(`[EmailEngine] Mock sending Daily Reminder to theatredreamers@gmail.com for user ${user.identity?.fullName}`);
      return;
    }

    try {
      await resend.emails.send({
        from: 'Ascend AI <onboarding@resend.dev>',
        to: 'theatredreamers@gmail.com', // Fixed to this email per user requirements
        subject: 'Good Morning! 🌅',
        html: `
          <h2>Good morning!</h2>
          <p>Today's Goals:</p>
          <ul>
            <li>Drink 3L of water</li>
            <li>Walk 8,000 steps</li>
            <li>Complete your workout</li>
          </ul>
          <p>Let's keep your streak alive!</p>
        `
      });
      console.log(`Successfully sent email reminder to theatredreamers@gmail.com`);
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }

  static async sendWeeklyReport(user: UserProfile, reportData: any) {
    if (!process.env.RESEND_API_KEY) {
      console.log(`[EmailEngine] Mock sending Weekly Report to theatredreamers@gmail.com`);
      return;
    }
    
    // ... similar implementation
  }
}
