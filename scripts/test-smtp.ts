import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars BEFORE importing the service
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function run() {
  const { mailService } = require('../lib/email/mail.service');

  console.log('Testing SMTP connection...');
  console.log('USER loaded:', process.env.SMTP_USER ? 'YES' : 'NO', process.env.SMTP_USER);
  console.log('PASS loaded:', process.env.SMTP_PASS ? 'YES' : 'NO');
  
  const connected = await mailService.verifyConnection();
  if (!connected) {
    console.error('❌ SMTP Connection Failed');
    process.exit(1);
  }
  
  console.log('✅ SMTP Connection OK');
  
  const testEmail = process.argv[2] || 'test@example.com';
  console.log(`Sending test email to ${testEmail}...`);
  
  const success = await mailService.sendMail({
    to: testEmail,
    subject: 'Ascend AI - SMTP Production Verification',
    templateName: 'welcome',
    templateData: {
      name: 'Test User'
    }
  });
  
  if (success) {
    console.log('✅ Test email sent successfully!');
    process.exit(0);
  } else {
    console.error('❌ Failed to send test email.');
    process.exit(1);
  }
}

run();
