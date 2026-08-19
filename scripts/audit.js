/**
 * scripts/audit.js — Скрипт проверки качества и соблюдения правил проекта
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const MAX_LINES = 150;
const errors = [];
const warnings = [];

function checkDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git') {
        checkDirectory(fullPath);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (['.js', '.html', '.css'].includes(ext)) {
        checkFile(fullPath);
      }
    }
  }
}

function checkFile(filePath) {
  const relPath = path.relative(rootDir, filePath);
  // Исключаем внешние сторонние SDK и бандлы
  if (relPath.includes('notibot-bridge.js') || relPath.includes('vendor-lucide.js') || relPath.includes('tailwind.min.css')) return;

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  if (lines.length > MAX_LINES) {
    errors.push(`[FILE_SIZE] ${relPath} (${lines.length} строк > лимита ${MAX_LINES})`);
  }

  // Проверка на секреты
  if (/api[_-]?key\s*=\s*['"][a-zA-Z0-9_\-]{16,}['"]/i.test(content)) {
    errors.push(`[SECRET_IN_CODE] ${relPath} содержит возможный API-ключ`);
  }

  // Проверка прямого вызова notibot вне bridge.js
  if (!relPath.includes('bridge.js') && !relPath.includes('index.html')) {
    if (/window\.notibot\./.test(content)) {
      warnings.push(`[NOTIBOT_OUTSIDE_BRIDGE] ${relPath} обращается к window.notibot напрямую вместо bridge.js`);
    }
  }
}

console.log('🔍 Запуск аудита проекта «Ты бы дошёл?»...\n');
checkDirectory(rootDir);

if (warnings.length > 0) {
  console.log('⚠️ Предупреждения:');
  warnings.forEach(w => console.log('  • ' + w));
  console.log('');
}

if (errors.length > 0) {
  console.log('❌ Критичные ошибки (лимиты и правила):');
  errors.forEach(e => console.log('  • ' + e));
  console.log('\nИсправьте ошибки перед публикацией.');
  process.exit(1);
} else {
  console.log('✅ Всё отлично! Все файлы соблюдают лимит 150 строк и правила архитектуры.');
  process.exit(0);
}
