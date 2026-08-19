import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import { sanitizeUserInput, parseAiJson } from './lib/security.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 8080;

const DEFAULT_USER_CREDITS = parseInt(process.env.DEFAULT_USER_CREDITS || '10', 10);
const HYDRA_AI_MAX_TOKENS = parseInt(process.env.HYDRA_AI_MAX_TOKENS || '1000', 10);
const MAX_INPUT_LENGTH = parseInt(process.env.MAX_INPUT_LENGTH || '500', 10);

// Enable CORS specifically for Notibot WebApp (list.notibot.ru) and localhost testing
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const isNotibotDomain = origin && (origin.includes('notibot.ru') || origin.endsWith('.notibot.ru'));
  const isLocalhost = origin && (origin.includes('localhost') || origin.includes('127.0.0.1'));
  
  if (!origin || isNotibotDomain || isLocalhost) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-notibot-user-id');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Serve frontend assets strictly from public/ directory
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
} else {
  app.use(express.static(__dirname));
}

// Helper to safely load server-side system prompt from prompts/systemPrompt.js
async function getSystemPrompt() {
  const promptPath = path.join(__dirname, 'prompts', 'systemPrompt.js');
  if (fs.existsSync(promptPath)) {
    try {
      const module = await import(`file://${promptPath}`);
      return module.SYSTEM_PROMPT || 'Ты — полезный ИИ-помощник.';
    } catch (e) {
      console.error('Error loading system prompt from server:', e);
    }
  }
  return 'Ты — полезный ИИ-помощник.';
}

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Protected AI Endpoint
app.post('/api/ai/generate', async (req, res) => {
  try {
    const apiKey = process.env.HYDRA_AI_API_KEY;
    if (!apiKey || apiKey.trim() === '' || apiKey === 'your_hydra_ai_api_key_here') {
      return res.status(401).json({ 
        error: 'HYDRA_AI_API_KEY не указан в файле .env! Получите ключ в Telegram: https://t.me/HydraAI_Store_bot?start=r_3781184' 
      });
    }

    const { userPayload, notibotUserId, model, customSystemPrompt } = req.body;
    const host = req.headers.host || '';
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
    const isProduction = process.env.NODE_ENV === 'production' || process.env.AMVERA === 'true' || (!isLocalhost && process.env.NODE_ENV !== 'development');
    const providedUserId = notibotUserId || req.headers['x-notibot-user-id'];

    if (!providedUserId || String(providedUserId).trim() === '') {
      if (isProduction) {
        return res.status(401).json({ 
          error: 'Доступ запрещен! В продакшне ИИ-функции доступны только авторизованным пользователям Notibot / Telegram.' 
        });
      }
    }

    const userId = providedUserId ? String(providedUserId) : 'guest_user';
    
    // Check and deduct credits in SQLite database
    let dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: userId,
          username: req.body.username || 'guest',
          credits: DEFAULT_USER_CREDITS
        }
      });
    }

    if (dbUser.credits <= 0) {
      return res.status(402).json({ 
        error: `Лимит бесплатных генераций (${DEFAULT_USER_CREDITS}) исчерпан! Обратитесь к администратору для пополнения.` 
      });
    }

    const safePayload = sanitizeUserInput(userPayload, MAX_INPUT_LENGTH);
    const systemPrompt = customSystemPrompt || await getSystemPrompt();
    const selectedModel = model || process.env.HYDRA_AI_MODEL || 'deepseek-v4-flash';
    const baseUrl = (process.env.HYDRA_AI_BASE_URL || 'https://api.hydraai.ru/v1').replace(/\/$/, '');

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: typeof safePayload === 'string' ? safePayload : JSON.stringify(safePayload) }
        ],
        temperature: 0.7,
        max_tokens: HYDRA_AI_MAX_TOKENS
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: `Ошибка Hydra AI API (${response.status}): ${errText}` });
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || '{}';
    const jsonResult = parseAiJson(rawContent);

    const updatedCredits = Math.max(0, dbUser.credits - 1);
    await prisma.user.update({ where: { id: userId }, data: { credits: updatedCredits } });
    await prisma.generation.create({
      data: {
        userId: userId,
        prompt: typeof safePayload === 'string' ? safePayload : JSON.stringify(safePayload),
        result: JSON.stringify(jsonResult)
      }
    });

    return res.json({ 
      success: true, 
      data: jsonResult, 
      raw: rawContent,
      creditsLeft: updatedCredits, 
      modelUsed: selectedModel,
      usage: data.usage
    });
  } catch (error) {
    const detail = error.cause ? (error.cause.message || String(error.cause)) : error.message;
    console.error('AI Generation Error:', error);
    return res.status(500).json({ error: `Ошибка подключения к Hydra API (${process.env.HYDRA_AI_BASE_URL || 'https://api.hydraai.ru/v1'}): ${detail}` });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер Vibe Fullstack запущен: http://localhost:${PORT}`);
});
