import OpenAI from 'openai';
import { env } from '../config/env';
import { logger } from '../utils/logger';

const hasKey = Boolean(env.openAiApiKey);
const client = hasKey
  ? new OpenAI({ apiKey: env.openAiApiKey })
  : null;

export const generateAiReply = async (prompt: string): Promise<string> => {
  if (!client) {
    logger.info('OPENAI_API_KEY no configurado, se devuelve respuesta predeterminada');
    return 'Gracias por tu mensaje. En segundos te atiende una persona de Virtuosa Biblias.';
  }

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'Eres el asistente de Virtuosa Biblias. Responde de forma cálida, clara y breve (máx 4 oraciones).'
      },
      { role: 'user', content: prompt }
    ],
    temperature: 0.4,
    max_tokens: 200
  });

  const text = response.choices[0]?.message?.content ?? '';
  return text.trim().length > 0
    ? text.trim()
    : '¡Hola! Soy Virtuosa Biblias. Ahora mismo te atendemos.';
};
