"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendButtons = exports.sendQuickReplies = exports.sendTextMessage = exports.validateSignature = void 0;
const axios_1 = require("axios");
const crypto = require("crypto");
const env_1 = require("../config/env");
const { logger } = require("../utils/logger");
const graphClient = axios_1.default.create({
    baseURL: "https://graph.facebook.com/v19.0",
    params: { access_token: env_1.env.accessToken }
});
const validateSignature = (rawBody, signatureHeader) => {
    if (!signatureHeader)
        return false;
    const [, signatureHash] = signatureHeader.split("=");
    const expectedHash = crypto
        .createHmac("sha256", env_1.env.appSecret)
        .update(rawBody)
        .digest("hex");
    const isValid = crypto.timingSafeEqual(Buffer.from(expectedHash), Buffer.from(signatureHash));
    if (!isValid) {
        logger.error("Firma invǭlida en webhook");
    }
    return isValid;
};
exports.validateSignature = validateSignature;
const sendTextMessage = async (to, text) => {
    await graphClient.post("/me/messages", {
        recipient: to,
        messaging_type: "RESPONSE",
        message: { text }
    });
};
exports.sendTextMessage = sendTextMessage;
const sendQuickReplies = async (to, text, quickReplies) => {
    await graphClient.post("/me/messages", {
        recipient: to,
        messaging_type: "RESPONSE",
        message: {
            text,
            quick_replies: quickReplies.map((qr) => ({
                content_type: "text",
                title: qr.title,
                payload: qr.payload
            }))
        }
    });
};
exports.sendQuickReplies = sendQuickReplies;
const sendButtons = async (to, text, buttons) => {
    await graphClient.post("/me/messages", {
        recipient: to,
        messaging_type: "RESPONSE",
        message: {
            text,
            buttons: buttons.map((btn) => ({
                type: "web_url",
                url: btn.url,
                title: btn.title
            }))
        }
    });
};
exports.sendButtons = sendButtons;

