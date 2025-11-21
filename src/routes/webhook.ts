import { Router, Request, Response } from 'express';
import { env } from '../config/env';
import { introQuickReplies, cannedReplies } from '../flows/script';
import { sendQuickReplies, sendTextMessage, validateSignature } from '../services/instagram';
import { generateAiReply } from '../services/openai';
import { logger } from '../utils/logger';

interface VerifiedRequest extends Request {
  rawBody?: string;
}

const router = Router();

router.get('/webhook', (req: Request, res: Response) => {
  const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge } = req.query;
  if (mode === 'subscribe' && token === env.verifyToken) {
    logger.info('Webhook verificado');
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

router.post('/webhook', async (req: VerifiedRequest, res: Response) => {
  const signature = req.get('x-hub-signature-256') ?? undefined;
  const rawBody = req.rawBody ?? '';

  if (!validateSignature(rawBody, signature)) {
    return res.sendStatus(403);
  }

  const body = req.body;
  if (body.object !== 'instagram') {
    return res.sendStatus(404);
  }

  for (const entry of body.entry ?? []) {
    const messagingEvents = entry.messaging ?? [];
    for (const event of messagingEvents) {
      const senderId: string | undefined = event.sender?.id;
      if (!senderId) continue;

      const quickReplyPayload: string | undefined = event.message?.quick_reply?.payload;
      const userText: string | undefined = event.message?.text;

      if (quickReplyPayload) {
        const reply = cannedReplies[quickReplyPayload] ?? '¡Recibido! ¿En qué más te ayudo?';
        await sendTextMessage({ id: senderId }, reply);
        await sendQuickReplies({ id: senderId }, '¿Quieres ver algo más?', introQuickReplies);
        continue;
      }

      if (userText) {
        await sendTextMessage(
          { id: senderId },
          '¡Hola! Soy el asistente de Virtuosa Biblias. Te comparto opciones rápidas:'
        );
        await sendQuickReplies({ id: senderId }, 'Elige una opción o escribe tu duda:', introQuickReplies);

        try {
          const aiReply = await generateAiReply(userText);
          await sendTextMessage({ id: senderId }, aiReply);
        } catch (error) {
          logger.error('Error generando respuesta IA', error);
        }
      }
    }
  }

  return res.sendStatus(200);
});

export default router;
