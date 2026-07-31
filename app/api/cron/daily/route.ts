import { NextResponse } from 'next/server';
import { Scheduler } from '@/lib/automation/Scheduler';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Call the Scheduler to execute daily reset for all users.
    // Vercel cron triggers this without waiting for a long response, but Next.js API routes have timeouts.
    // Ideally this queues jobs or runs them in Edge.
    await Scheduler.executeDailyTasks();

    return NextResponse.json({ success: true, message: 'Daily tasks initiated' });
  } catch (error) {
    console.error('Daily Cron Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
