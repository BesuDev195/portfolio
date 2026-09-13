import fs from 'fs';

const files = [
  'src/app/page.tsx',
  'src/components/Footer.tsx',
  'src/app/blog/page.tsx',
  'src/app/blog/[slug]/page.tsx'
];

function cleanFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  const replacements = {
    'bg-zinc-900 dark:bg-zinc-100 dark:bg-zinc-900': 'bg-zinc-100 dark:bg-zinc-900',
    'text-zinc-500 dark:text-zinc-600 dark:text-zinc-400': 'text-zinc-600 dark:text-zinc-400',
    'text-zinc-500 dark:text-zinc-500': 'text-zinc-500',
    'bg-zinc-900 dark:bg-zinc-100 dark:bg-zinc-950': 'bg-white dark:bg-zinc-950',
    'group-hover:text-black dark:group-hover:text-white transition-colors': 'group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors',
    'bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-950': 'bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900',
    'text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white': 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100'
  };

  for (const [key, value] of Object.entries(replacements)) {
    content = content.replaceAll(key, value);
  }

  // Generic double dark cleanup
  // E.g. dark:text-zinc-600 dark:text-zinc-400 -> dark:text-zinc-400
  content = content.replace(/(dark:[a-z0-9\-\/]+)\s+(dark:[a-z0-9\-\/]+)/g, '$2');
  
  // Generic double light cleanup
  // E.g. text-zinc-500 text-zinc-600 -> text-zinc-600
  // text-zinc-[0-9]+ dark:text-zinc-[0-9]+
  // Not going to do complex generic cleanup unless needed.

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Cleaned ${filePath}`);
}

files.forEach(cleanFile);
