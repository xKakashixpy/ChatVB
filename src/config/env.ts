import dotenv from 'dotenv';

dotenv.config();

const required = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Falta la variable de entorno: ${key}`);
  }
  return value;
};

export const env = {
  port: parseInt(process.env.PORT ?? '3000', 10),
  verifyToken: required('VERIFY_TOKEN'),
  accessToken: required('ACCESS_TOKEN'),
  appSecret: required('APP_SECRET'),
  openAiApiKey: process.env.OPENAI_API_KEY ?? '',
  appUrl: process.env.APP_URL ?? 'https://example.com'
};
