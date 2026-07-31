const fs = require('fs');
const path = require('path');

const DIRECTORIES = ['app', 'components', 'services', 'lib', 'hooks'];
const TARGET_DIR = path.resolve(__dirname, '..');

const replacements = [
  // Backgrounds
  { pattern: /bg-zinc-950/g, replacement: 'bg-base' },
  { pattern: /bg-zinc-900/g, replacement: 'bg-surface' },
  { pattern: /bg-zinc-800\/50/g, replacement: 'bg-surface-elevated/50' },
  { pattern: /bg-zinc-800/g, replacement: 'bg-surface-elevated' },
  { pattern: /bg-black/g, replacement: 'bg-base' },
  
  // Text
  { pattern: /text-zinc-400/g, replacement: 'text-secondary' },
  { pattern: /text-zinc-500/g, replacement: 'text-disabled' },
  // CAUTION: text-white might be on solid buttons (bg-accent-blue text-white), we have to be careful. Let's just replace it and manually fix buttons.
  { pattern: /text-white/g, replacement: 'text-primary' },
  { pattern: /text-zinc-300/g, replacement: 'text-secondary' },
  { pattern: /text-zinc-100/g, replacement: 'text-primary' },
  { pattern: /text-black/g, replacement: 'text-primary' },
  
  // Borders
  { pattern: /border-zinc-800/g, replacement: 'border-border-subtle' },
  { pattern: /border-zinc-700/g, replacement: 'border-border-subtle' },
  { pattern: /divide-zinc-800/g, replacement: 'divide-border-subtle' },
  { pattern: /divide-zinc-700/g, replacement: 'divide-border-subtle' },
  { pattern: /ring-zinc-800/g, replacement: 'ring-border-subtle' },
  
  // SVGs
  { pattern: /stroke-zinc-500/g, replacement: 'stroke-secondary' },
  { pattern: /stroke-zinc-400/g, replacement: 'stroke-secondary' },
  { pattern: /stroke-white/g, replacement: 'stroke-primary' },
  { pattern: /fill-zinc-500/g, replacement: 'fill-secondary' },
  { pattern: /fill-white/g, replacement: 'fill-primary' }
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  replacements.forEach(({ pattern, replacement }) => {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function traverseDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      traverseDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

// Make sure scripts dir exists
if (!fs.existsSync(path.join(TARGET_DIR, 'scripts'))) {
    fs.mkdirSync(path.join(TARGET_DIR, 'scripts'));
}

DIRECTORIES.forEach(dir => {
  const fullPath = path.join(TARGET_DIR, dir);
  if (fs.existsSync(fullPath)) {
    traverseDir(fullPath);
  }
});

console.log("Audit replacements complete.");
