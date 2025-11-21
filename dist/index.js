"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const morgan = require("morgan");
const { env } = require("./config/env");
const webhook_1 = require("./routes/webhook");
const { logger } = require("./utils/logger");

const app = express();

app.use(express.json({
    verify: (req, _res, buf) => {
        // Se guarda el body crudo para validar la firma del webhook de Meta
        req.rawBody = buf.toString("utf8");
    }
}));
app.use(morgan("dev"));
app.use(webhook_1.default);
app.get("/health", (_req, res) => {
    res.json({ status: "ok", app: "Virtuosa Biblias IG Bot" });
});
app.use((err, _req, res, _next) => {
    logger.error("Error inesperado", err);
    res.status(500).json({ error: "Internal Server Error" });
});
app.listen(env.port, () => {
    logger.info(`Servidor iniciado en puerto ${env.port}`);
});

