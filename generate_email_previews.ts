import { getTemplate } from './lib/email/templates/index';
import fs from 'fs';
import path from 'path';

const categories = ['welcome', 'reminder', 'weekly', 'achievement', 'reset-password'];

const outputDir = path.join(process.cwd(), 'docs', 'email-previews');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

categories.forEach(c => {
  const html = getTemplate(c, {
    name: 'Nani',
    title: 'Good Morning 🌅',
    description: 'Every champion starts with a single decision—to get up. Today is another opportunity to become stronger than yesterday.',
    stats: '5 workouts, 61,000 steps',
    achievement: 'Level 10 Commander',
    link: 'http://ascend.ai/reset'
  });
  fs.writeFileSync(path.join(outputDir, c + '.html'), html);
});
console.log('Successfully generated HTML email previews in docs/email-previews/');
