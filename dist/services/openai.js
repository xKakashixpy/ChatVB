"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAiReply = void 0;
const openai_1 = require("openai");
const env_1 = require("../config/env");
const { logger } = require("../utils/logger");
const hasKey = Boolean(env_1.env.openAiApiKey);
const client = hasKey
    ? new openai_1.default({ apiKey: env_1.env.openAiApiKey })
    : null;
const generateAiReply = async (prompt) => {
    if (!client) {
        logger.info("OPENAI_API_KEY no configurado, se devuelve respuesta predeterminada");
        return "Gracias por tu mensaje. En segundos te atiende una persona de Virtuosa Biblias.";
    }
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "Eres el asistente de Virtuosa Biblias. Responde de forma cǭlida, clara y breve (mǭx 4 oraciones)."
            },
            { role: "user", content: prompt }
        ],
        temperature: 0.4,
        max_tokens: 200
    });
    const text = response.choices[0]?.message?.content ?? "";
    return text.trim().length > 0
        ? text.trim()
        : "��Hola! Soy Virtuosa Biblias. Ahora mismo te atendemos.";
};
exports.generateAiReply = generateAiReply;

