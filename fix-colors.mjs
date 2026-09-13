import fs from 'fs';

const files = [
  'src/app/page.tsx',
  'src/components/Footer.tsx',
  'src/app/blog/page.tsx',
  'src/app/blog/[slug]/page.tsx'
];

const colorMap = {
  'bg-zinc-950': 'bg-white dark:bg-zinc-950',
  'bg-zinc-950/40': 'bg-zinc-50 dark:bg-zinc-950/40',
  'bg-zinc-950/80': 'bg-white/80 dark:bg-zinc-950/80',
  'bg-zinc-900': 'bg-zinc-100 dark:bg-zinc-900',
  'bg-zinc-900/10': 'bg-zinc-100/50 dark:bg-zinc-900/10',
  'bg-zinc-900/20': 'bg-zinc-100/50 dark:bg-zinc-900/20',
  'bg-zinc-900/30': 'bg-zinc-100/50 dark:bg-zinc-900/30',
  'bg-zinc-900/50': 'bg-zinc-200/50 dark:bg-zinc-900/50',
  'border-zinc-900': 'border-zinc-200 dark:border-zinc-900',
  'border-zinc-800': 'border-zinc-300 dark:border-zinc-800',
  'border-zinc-800/80': 'border-zinc-300 dark:border-zinc-800/80',
  'border-zinc-800/60': 'border-zinc-200 dark:border-zinc-800/60',
  'text-zinc-100': 'text-zinc-900 dark:text-zinc-100',
  'text-zinc-200': 'text-zinc-800 dark:text-zinc-200',
  'text-zinc-300': 'text-zinc-700 dark:text-zinc-300',
  'text-zinc-400': 'text-zinc-600 dark:text-zinc-400',
  'text-zinc-500': 'text-zinc-500 dark:text-zinc-500', // keeping as is but mapping just in case
  'text-zinc-600': 'text-zinc-500 dark:text-zinc-600',
  'hover:text-white': 'hover:text-black dark:hover:text-white',
  'hover:text-zinc-100': 'hover:text-zinc-900 dark:hover:text-zinc-100',
  'hover:border-zinc-700': 'hover:border-zinc-400 dark:hover:border-zinc-700',
  'hover:border-zinc-600': 'hover:border-zinc-500 dark:hover:border-zinc-600',
  'group-hover:text-white': 'group-hover:text-black dark:group-hover:text-white',
  'group-hover:text-zinc-200': 'group-hover:text-zinc-800 dark:group-hover:text-zinc-200',
  'bg-zinc-100': 'bg-zinc-900 dark:bg-zinc-100', // invert for primary buttons
  'text-zinc-950': 'text-zinc-50 dark:text-zinc-950',
};

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  // To avoid replacing things twice, we process token by token or use word boundaries
  // Because 'bg-zinc-950' could be partially matched by 'bg-zinc-950/40', we sort the keys by length descending
  const sortedKeys = Object.keys(colorMap).sort((a, b) => b.length - a.length);

  // We only want to replace tailwind classes inside className="..." or similar
  // Actually a simpler way is to split by spaces, quotes, etc., but regex with negative lookbehind/lookahead is easier.
  // Example regex: /(?<=['"\s])bg-zinc-950(?=['"\s])/g
  // We need to be careful with / because it's not a word boundary.
  
  for (const key of sortedKeys) {
    const replacement = colorMap[key];
    // Escaping slashes and dashes for regex
    const escapedKey = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(?<=['"\\s\`\\[])${escapedKey}(?=['"\\s\`\\]])`, 'g');
    
    content = content.replace(regex, (match) => {
      return replacement;
    });
  }

  // Handle special case for buttons in page.tsx that might have gotten messed up
  // 'bg-zinc-900 dark:bg-zinc-100' was originally 'bg-zinc-100'
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}

files.forEach(processFile);
