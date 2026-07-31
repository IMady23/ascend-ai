import { NextResponse } from 'next/server';
import { mailService } from '@/lib/email/mail.service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to, subject, templateName, templateData } = body;

    if (!to || !subject || !templateName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const isConnected = await mailService.verifyConnection();
    if (!isConnected) {
      return NextResponse.json({ error: 'SMTP connection failed' }, { status: 500 });
    }

    const success = await mailService.sendMail({
      to,
      subject,
      templateName,
      templateData,
    });

    if (success) {
      return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
