"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const env_1 = require("../config/env");
const script_1 = require("../flows/script");
const instagram_1 = require("../services/instagram");
const openai_1 = require("../services/openai");
const { logger } = require("../utils/logger");
const router = (0, express_1.Router)();
router.get("/webhook", (req, res) => {
    const { "hub.mode": mode, "hub.verify_token": token, "hub.challenge": challenge } = req.query;
    if (mode === "subscribe" && token === env_1.env.verifyToken) {
        logger.info("Webhook verificado");
        return res.status(200).send(challenge);
    }
    return res.sendStatus(403);
});
router.post("/webhook", async (req, res) => {
    const signature = req.get("x-hub-signature-256") ?? undefined;
    const rawBody = req.rawBody ?? "";
    if (!(0, instagram_1.validateSignature)(rawBody, signature)) {
        return res.sendStatus(403);
    }
    const body = req.body;
    if (body.object !== "instagram") {
        return res.sendStatus(404);
    }
    for (const entry of body.entry ?? []) {
        const messagingEvents = entry.messaging ?? [];
        for (const event of messagingEvents) {
            const senderId = event.sender?.id;
            if (!senderId)
                continue;
            const quickReplyPayload = event.message?.quick_reply?.payload;
            const userText = event.message?.text;
            if (quickReplyPayload) {
                const reply = script_1.cannedReplies[quickReplyPayload] ?? "��Recibido! ��En quǸ mǭs te ayudo?";
                await (0, instagram_1.sendTextMessage)({ id: senderId }, reply);
                await (0, instagram_1.sendQuickReplies)({ id: senderId }, "��Quieres ver algo mǭs?", script_1.introQuickReplies);
                continue;
            }
            if (userText) {
                await (0, instagram_1.sendTextMessage)({ id: senderId }, "��Hola! Soy el asistente de Virtuosa Biblias. Te comparto opciones rǭpidas:");
                await (0, instagram_1.sendQuickReplies)({ id: senderId }, "Elige una opci��n o escribe tu duda:", script_1.introQuickReplies);
                try {
                    const aiReply = await (0, openai_1.generateAiReply)(userText);
                    await (0, instagram_1.sendTextMessage)({ id: senderId }, aiReply);
                }
                catch (error) {
                    logger.error("Error generando respuesta IA", error);
                }
            }
        }
    }
    return res.sendStatus(200);
});
exports.default = router;

