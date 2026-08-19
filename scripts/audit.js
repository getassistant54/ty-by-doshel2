#!/usr/bin/env node

/**
 * 🔒 Vibe Fullstack & Session Security Auditor
 * Merged & Advanced Compliance Auditor for Vibe HTML Kit / Notibot Fullstack Apps
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, 'public');
const SCAN_EXTS = ['.js', '.jsx', '.ts', '.tsx', '.html', '.json', '.prisma'];

// ANSI Terminal Colors
const COLORS = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
};

console.log(`${COLORS.bold}${COLORS.cyan}--------------------------------------------------${COLORS.reset}`);
console.log(`${COLORS.bold}${COLORS.cyan}🔍 Vibe Fullstack & Session Security Auditor${COLORS.reset}`);
console.log(`${COLORS.bold}${COLORS.cyan}--------------------------------------------------${COLORS.reset}`);

function getTargetFiles() {
  const isFullScan = process.argv.includes('--all');
  if (isFullScan) {
    console.log(`${COLORS.yellow}ℹ️ Full scan mode activated (--all). Scanning all project files...${COLORS.reset}`);
    return collectAllFiles(ROOT);
  }

  try {
    const diffFiles = execSync('git diff HEAD --name-only', { encoding: 'utf8' })
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean);

    const untrackedFiles = execSync('git ls-files --others --exclude-standard', { encoding: 'utf8' })
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean);

    const sessionFiles = Array.from(new Set([...diffFiles, ...untrackedFiles]))
      .filter(f => SCAN_EXTS.includes(path.extname(f)) || f.endsWith('schema.prisma'));

    if (sessionFiles.length > 0) {
      return sessionFiles;
    }
  } catch (error) {
    // Fallback if not a git repo or no diff
  }

  return collectAllFiles(ROOT);
}

function collectAllFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git' || name === 'dist' || name === '.gemini' || name === '.agents') continue;
    const fullPath = path.join(dir, name);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      collectAllFiles(fullPath, acc);
    } else {
      const relPath = path.relative(ROOT, fullPath);
      if (SCAN_EXTS.includes(path.extname(relPath)) || relPath.endsWith('schema.prisma')) {
        acc.push(relPath);
      }
    }
  }
  return acc;
}

const targetFiles = getTargetFiles();

if (targetFiles.length === 0) {
  console.log(`${COLORS.green}✅ No files modified or targeted. Everything is clean!${COLORS.reset}\n`);
  process.exit(0);
}

console.log(`${COLORS.bold}Targeting ${targetFiles.length} file(s) for audit:${COLORS.reset}`);
targetFiles.forEach(f => console.log(`  • ${COLORS.cyan}${f}${COLORS.reset}`));
console.log('');

const findings = {
  p0: [], // Critical (Blocks commit/push)
  p1: [], // High (Blocks commit/push)
  p2: [], // Medium (Warning)
  p3: [], // Low (Informational)
};

function addFinding(severity, file, line, ruleName, detail, codeSnippet = '') {
  findings[severity].push({ file, line, ruleName, detail, codeSnippet });
}

// Security Regex Scanners
const SECRET_REGEXES = [
  { name: 'Generic Hardcoded Secret', regex: /(?:api_key|secret|password|private_key)\s*=\s*['"]([a-zA-Z0-9_\-\.\=\+\/\:\@]{8,})['"]/i },
  { name: 'OpenAI API Key', regex: /sk-[a-zA-Z0-9_-]{20,}/ },
  { name: 'Hydra AI Key', regex: /sk-hydra-[a-zA-Z0-9_-]{10,}/ },
  { name: 'GitHub Access Token', regex: /ghp_[a-zA-Z0-9]{36}/ },
  { name: 'Database Connection String', regex: /(?:postgresql|mongodb|mysql|sqlite):\/\/[^"'\s]+/i }
];

const BACKEND_IN_PUBLIC_REGEXES = [
  { name: "Prisma Client in Public UI", regex: /PrismaClient/i },
  { name: "HYDRA_AI_API_KEY Reference in Public JS", regex: /HYDRA_AI_API_KEY/ },
  { name: "Express Server Instance in Public", regex: /express\(\)/ },
  { name: "Dotenv Config in Public", regex: /dotenv\.config/ },
  { name: "Server System Prompt in Public", regex: /SYSTEM_PROMPT/ },
];

targetFiles.forEach(filePath => {
  const absolutePath = path.resolve(ROOT, filePath);

  if (!fs.existsSync(absolutePath) || fs.statSync(absolutePath).isDirectory()) {
    return;
  }

  if (filePath.includes('node_modules') || filePath.includes('.git') || filePath.includes('package-lock.json') || filePath.includes('vendor-lucide.js')) {
    return;
  }

  const ext = path.extname(filePath);
  const isPublicFile = absolutePath.startsWith(PUBLIC_DIR);
  const content = fs.readFileSync(absolutePath, 'utf8');
  const lines = content.split('\n');

  lines.forEach((lineText, index) => {
    const lineNumber = index + 1;
    const trimmedLine = lineText.trim();

    if (trimmedLine.startsWith('//') || trimmedLine.startsWith('*') || trimmedLine.startsWith('/*')) {
      return;
    }

    SECRET_REGEXES.forEach(sec => {
      if (sec.regex.test(lineText)) {
        if (!trimmedLine.includes('your_hydra_ai_api_key_here') && !trimmedLine.includes('API_KEY_PLACEHOLDER') && !filePath.includes('.env.example') && !filePath.includes('audit.js')) {
          addFinding(
            'p0',
            filePath,
            lineNumber,
            `Hardcoded Secret Found (${sec.name})`,
            'API keys, passwords, or credentials must not be stored in source code. Load them dynamically from environment variables (.env).',
            trimmedLine.replace(sec.regex, '[REDACTED_SECRET]')
          );
        }
      }
    });

    if (isPublicFile) {
      BACKEND_IN_PUBLIC_REGEXES.forEach(b => {
        if (b.regex.test(lineText)) {
          addFinding(
            'p0',
            filePath,
            lineNumber,
            'Backend Code Leak in public/',
            `Server-side construct "${b.name}" found in public/ directory. All public files are publicly downloadable! Move server logic outside public/.`,
            trimmedLine
          );
        }
      });
    }

    const isCodeFile = (ext === '.js' || ext === '.jsx' || ext === '.ts' || ext === '.tsx') && !filePath.includes('audit');
    if (isCodeFile) {
      if (lineText.includes('$queryRawUnsafe') || lineText.includes('$executeRawUnsafe')) {
        addFinding(
          'p0',
          filePath,
          lineNumber,
          'Unsafe Raw SQL Query (SQL Injection Risk)',
          'Using unsafe raw SQL methods bypasses parameterized query protection. Use standard Prisma ORM methods or safe parameterized $queryRaw templates.',
          trimmedLine
        );
      }

      if (/\beval\s*\(|new\s+Function\s*\(/.test(lineText)) {
        addFinding(
          'p1',
          filePath,
          lineNumber,
          'Dangerous Code Execution (eval / new Function)',
          'Using eval() or dynamic new Function() is forbidden for security reason to prevent Arbitrary Code Execution (ACE) / Remote Code Execution (RCE).',
          trimmedLine
        );
      }
    }
  });

  if (filePath.endsWith('schema.prisma')) {
    const models = [];
    let currentModel = null;

    lines.forEach((lineText, index) => {
      const trimmed = lineText.trim();
      if (trimmed.startsWith('model ')) {
        const modelName = trimmed.split(' ')[1];
        currentModel = { name: modelName, fields: [], indexes: [], uniques: [], lines: [] };
        models.push(currentModel);
      } else if (currentModel) {
        if (trimmed.startsWith('}')) {
          currentModel = null;
        } else if (trimmed && !trimmed.startsWith('//')) {
          currentModel.lines.push({ text: trimmed, lineNum: index + 1 });
          if (trimmed.startsWith('@@index')) {
            currentModel.indexes.push(trimmed);
          } else if (trimmed.startsWith('@@unique')) {
            currentModel.uniques.push(trimmed);
          } else {
            currentModel.fields.push(trimmed);
          }
        }
      }
    });

    models.forEach(model => {
      model.fields.forEach(field => {
        if (field.includes('@relation') && field.includes('fields:')) {
          const fieldsMatch = field.match(/fields:\s*\[([^\]]+)\]/);
          if (fieldsMatch) {
            const fkFields = fieldsMatch[1].split(',').map(f => f.trim());
            fkFields.forEach(fk => {
              let isIndexed = false;
              const fkFieldDef = model.fields.find(f => f.startsWith(fk + ' '));
              if (fkFieldDef && (fkFieldDef.includes('@id') || fkFieldDef.includes('@unique'))) {
                isIndexed = true;
              }
              if (!isIndexed) {
                const indexPattern = new RegExp(`@@index\\(\\[[^\\)]*\\b${fk}\\b[^\\)]*\\]\\)`);
                isIndexed = model.indexes.some(idx => indexPattern.test(idx));
              }
              if (!isIndexed) {
                const uniquePattern = new RegExp(`@@unique\\(\\[[^\\)]*\\b${fk}\\b[^\\)]*\\]\\)`);
                isIndexed = model.uniques.some(uniq => uniquePattern.test(uniq));
              }
              if (!isIndexed) {
                addFinding(
                  'p2',
                  filePath,
                  model.lines.find(l => l.text.startsWith(fk + ' '))?.lineNum || 1,
                  'Missing Relational Foreign Key Index',
                  `Foreign key "${fk}" in Prisma model "${model.name}" is missing an index. Add "@@index([${fk}])" at the bottom of the model for optimal SQL join performance.`,
                  field
                );
              }
            });
          }
        }
      });
    });
  }
});

function checkGlobalGuards() {
  const envExists = fs.existsSync(path.join(ROOT, '.env'));
  const gitignoreExists = fs.existsSync(path.join(ROOT, '.gitignore'));
  const dockerignoreExists = fs.existsSync(path.join(ROOT, '.dockerignore'));

  if (envExists && gitignoreExists) {
    const gitignoreContent = fs.readFileSync(path.join(ROOT, '.gitignore'), 'utf8');
    if (!gitignoreContent.includes('.env')) {
      addFinding('p0', '.gitignore', 1, 'ENV_NOT_GITIGNORED', 'File .env is not added to .gitignore! Secrets risk leakage.');
    }
  }

  if (envExists && dockerignoreExists) {
    const dockerignoreContent = fs.readFileSync(path.join(ROOT, '.dockerignore'), 'utf8');
    if (!dockerignoreContent.includes('.env')) {
      addFinding('p0', '.dockerignore', 1, 'ENV_NOT_DOCKERIGNORED', 'File .env is not added to .dockerignore! Secrets risk leaking into Docker build layer.');
    }
  }

  const serverPath = path.join(ROOT, 'server.js');
  if (fs.existsSync(serverPath)) {
    const serverContent = fs.readFileSync(serverPath, 'utf8');
    if (!serverContent.includes('express.static')) {
      addFinding('p0', 'server.js', 1, 'NO_STATIC_SERVE', 'Server fails to restrict static assets to public/ directory!');
    }
    if (!serverContent.includes('sanitizeUserInput')) {
      addFinding('p0', 'server.js', 1, 'NO_INPUT_SANITIZATION', 'Missing sanitizeUserInput() call on server AI endpoint!');
    }
  }

  if (fs.existsSync(PUBLIC_DIR)) {
    const publicFiles = fs.readdirSync(PUBLIC_DIR);
    for (const file of publicFiles) {
      if (file.endsWith('.db') || file.endsWith('.sqlite')) {
        addFinding('p0', `public/${file}`, 1, 'DB_FILE_IN_PUBLIC', 'SQLite Database file is stored inside public/ directory! Move to prisma/.');
      }
    }
  }
}

checkGlobalGuards();

console.log(`${COLORS.bold}--------------------------------------------------${COLORS.reset}`);
console.log(`${COLORS.bold}Compliance Audit Findings Summary:${COLORS.reset}`);
console.log(`${COLORS.bold}--------------------------------------------------${COLORS.reset}`);

const totalP0 = findings.p0.length;
const totalP1 = findings.p1.length;
const totalP2 = findings.p2.length;
const totalP3 = findings.p3.length;
const totalBlocking = totalP0 + totalP1;

console.log(`${COLORS.bold}${totalP0 > 0 ? COLORS.red : COLORS.green}P0 Critical (Deploy Blocking): ${totalP0}${COLORS.reset}`);
console.log(`${COLORS.bold}${totalP1 > 0 ? COLORS.red : COLORS.green}P1 High     (Deploy Blocking): ${totalP1}${COLORS.reset}`);
console.log(`${COLORS.bold}${totalP2 > 0 ? COLORS.yellow : COLORS.green}P2 Medium   (Warnings):        ${totalP2}${COLORS.reset}`);
console.log(`${COLORS.bold}${totalP3 > 0 ? COLORS.cyan : COLORS.green}P3 Low      (Advisories):      ${totalP3}${COLORS.reset}`);
console.log(`${COLORS.bold}--------------------------------------------------${COLORS.reset}`);

function printFindings(list, severityName, color) {
  if (list.length === 0) return;
  console.log(`\n${COLORS.bold}${color}=== ${severityName} Findings ===${COLORS.reset}`);
  list.forEach(item => {
    console.log(`\n📌 ${COLORS.bold}${item.ruleName}${COLORS.reset}`);
    console.log(`   File: ${COLORS.cyan}${item.file}:${item.line}${COLORS.reset}`);
    console.log(`   Issue: ${item.detail}`);
    if (item.codeSnippet) {
      console.log(`   Code:  ${COLORS.yellow}${item.codeSnippet.trim()}${COLORS.reset}`);
    }
  });
}

printFindings(findings.p0, 'P0 Critical', COLORS.red);
printFindings(findings.p1, 'P1 High', COLORS.red);
printFindings(findings.p2, 'P2 Medium', COLORS.yellow);
printFindings(findings.p3, 'P3 Low', COLORS.cyan);

console.log(`\n${COLORS.bold}--------------------------------------------------${COLORS.reset}`);
if (totalBlocking > 0) {
  console.log(`${COLORS.bold}${COLORS.bgRed} ❌ COMPLIANCE FAIL: ${totalBlocking} blocking error(s) found. ${COLORS.reset}`);
  console.log(`${COLORS.yellow}Please fix all P0 and P1 violations before committing or pushing code.${COLORS.reset}`);
  console.log(`${COLORS.bold}--------------------------------------------------${COLORS.reset}\n`);
  process.exit(1);
} else {
  console.log(`${COLORS.bold}${COLORS.bgGreen} ✅ COMPLIANCE SUCCESS: No blocking errors found. ${COLORS.reset}`);
  if (totalP2 + totalP3 > 0) {
    console.log(`${COLORS.yellow}There are ${totalP2 + totalP3} warnings/advisories. Review at your convenience.${COLORS.reset}`);
  } else {
    console.log(`${COLORS.green}Perfect work! Your codebase is 100% compliant with all security & architecture guidelines.${COLORS.reset}`);
  }
  console.log(`${COLORS.bold}--------------------------------------------------${COLORS.reset}\n`);
  process.exit(0);
}
