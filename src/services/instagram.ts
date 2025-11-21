import axios from 'axios';
import crypto from 'crypto';
import { env } from '../config/env';
import { logger } from '../utils/logger';

const graphClient = axios.create({
  baseURL: 'https://graph.facebook.com/v19.0',
  params: { access_token: env.accessToken }
});

export const validateSignature = (rawBody: string, signatureHeader: string | undefined): boolean => {
  if (!signatureHeader) return false;
  const [, signatureHash] = signatureHeader.split('=');
  const expectedHash = crypto
    .createHmac('sha256', env.appSecret)
    .update(rawBody)
    .digest('hex');
  const isValid = crypto.timingSafeEqual(
    Buffer.from(expectedHash),
    Buffer.from(signatureHash)
  );
  if (!isValid) {
    logger.error('Firma inválida en webhook');
  }
  return isValid;
};

type Recipient = { id: string };

export const sendTextMessage = async (to: Recipient, text: string): Promise<void> => {
  await graphClient.post('/me/messages', {
    recipient: to,
    messaging_type: 'RESPONSE',
    message: { text }
  });
};

export const sendQuickReplies = async (
  to: Recipient,
  text: string,
  quickReplies: Array<{ title: string; payload: string }>
): Promise<void> => {
  await graphClient.post('/me/messages', {
    recipient: to,
    messaging_type: 'RESPONSE',
    message: {
      text,
      quick_replies: quickReplies.map((qr) => ({
        content_type: 'text',
        title: qr.title,
        payload: qr.payload
      }))
    }
  });
};

export const sendButtons = async (
  to: Recipient,
  text: string,
  buttons: Array<{ title: string; url: string }>
): Promise<void> => {
  await graphClient.post('/me/messages', {
    recipient: to,
    messaging_type: 'RESPONSE',
    message: {
      text,
      buttons: buttons.map((btn) => ({
        type: 'web_url',
        url: btn.url,
        title: btn.title
      }))
    }
  });
};
