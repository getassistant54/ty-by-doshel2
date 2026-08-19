import fs from 'fs';

const lucideContent = fs.readFileSync('public/js/vendor-lucide.js', 'utf8');

function checkIcon(name) {
  // Lucide maps kebab-case to PascalCase
  const pascal = name.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
  const exists = lucideContent.includes(`const ${pascal} =`) || lucideContent.includes(`${pascal}: ${pascal}`) || lucideContent.includes(`data-lucide="${name}"`);
  return { name, pascal, exists };
}

// Find all data-lucide or icon: '...' in files
const files = [
  'public/js/data/goals.js',
  'public/js/data/scenes-one.js',
  'public/js/data/scenes-two.js',
  'public/js/components/hero-screen.js',
  'public/js/components/goal-screen.js',
  'public/js/components/scene-screen.js',
  'public/js/components/pause-modal.js',
  'public/js/components/result-screen.js',
  'public/js/components/alt-screen.js',
  'public/js/components/compare-screen.js',
  'public/js/components/service-screen.js',
  'public/js/components/lead-drawer.js',
  'public/js/components/layout.js',
];

const iconsToCheck = new Set();

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8');
  const lucideMatches = content.matchAll(/data-lucide="([^"]+)"/g);
  for (const m of lucideMatches) iconsToCheck.add(m[1]);

  const optMatches = content.matchAll(/option\([^,]+,[^,]+,\s*'([^']+)'/g);
  for (const m of optMatches) iconsToCheck.add(m[1]);

  const iconFieldMatches = content.matchAll(/icon:\s*'([^']+)'/g);
  for (const m of iconFieldMatches) iconsToCheck.add(m[1]);

  const arrayMatches = content.matchAll(/\['([^']+)',/g);
  for (const m of arrayMatches) iconsToCheck.add(m[1]);
});

console.log('Checking all referenced icons:');
let missing = [];
for (const icon of iconsToCheck) {
  const res = checkIcon(icon);
  if (!res.exists) {
    missing.push(icon);
    console.log(`❌ Missing icon: "${icon}" (Pascal: ${res.pascal})`);
  } else {
    console.log(`✅ OK: "${icon}"`);
  }
}

if (missing.length > 0) {
  console.log(`\nTotal missing icons: ${missing.length}`);
} else {
  console.log('\nAll icons exist in vendor-lucide.js!');
}
