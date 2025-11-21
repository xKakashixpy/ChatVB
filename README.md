# Virtuosa Biblias – Chatbot Instagram (Meta IG Messaging API + OpenAI)

Backend listo para recibir y responder mensajes de Instagram usando la API oficial de Meta, con flujo inicial de ventas y opción de respuestas inteligentes vía OpenAI.

## Tech stack
- Node.js + TypeScript
- Express
- Meta Instagram Messaging API (Webhooks)
- OpenAI (opcional, para respuestas inteligentes)

## Estructura
```
.
├── package.json
├── tsconfig.json
├── .env.example
└── src
    ├── config/env.ts          # Carga de variables de entorno
    ├── flows/script.ts        # Guiones y quick replies del flujo inicial
    ├── index.ts               # Arranque de servidor Express
    ├── routes/webhook.ts      # Endpoints del Webhook (GET verify, POST incoming)
    ├── services/instagram.ts  # Firma, envío de mensajes (texto/quick replies/botones)
    ├── services/openai.ts     # Conexión con ChatGPT
    └── utils/logger.ts        # Logger sencillo
```

## Variables de entorno
Duplica `.env.example` a `.env`:
```
PORT=3000
VERIFY_TOKEN=tu_token_de_verificacion          # Igual al configurado en Meta Webhooks
ACCESS_TOKEN=tu_page_access_token_instagram    # Token de página/app con permisos instagram_manage_messages
APP_SECRET=tu_app_secret_de_meta               # Para validar firmas X-Hub-Signature-256
OPENAI_API_KEY=sk-xxx                          # Opcional; si no está, se usan mensajes básicos
APP_URL=https://tu-dominio-publico.com         # URL pública (Render/Railway/NGROK)
```

## Scripts
- `npm run dev`   – Hot reload con ts-node/nodemon.
- `npm run build` – Compila a `dist/`.
- `npm start`     – Ejecuta `dist/index.js`.

## Endpoints
- `GET /webhook`  – Verificación de token (`hub.mode`, `hub.verify_token`, `hub.challenge`).
- `POST /webhook` – Recepción de eventos IG. Valida firma `X-Hub-Signature-256`, procesa mensajes, envía quick replies y respuesta IA.
- `GET /health`   – Healthcheck simple.

## Flujo inicial de atención (Virtuosa Biblias)
1) Bienvenida + quick replies: Catálogo, Precios, Personalizaciones, Envíos, Disponibilidad, Cómo comprar, Hablar con persona.  
2) Cada quick reply devuelve mensaje guía y ofrece opciones nuevamente.  
3) Texto libre: se responde con IA (si hay `OPENAI_API_KEY`) y se re-ofrecen opciones rápidas.  

Los mensajes preconfigurados están en `src/flows/script.ts`.

## Despliegue rápido (Render)
1. Crear nuevo servicio Web (Node).  
2. Repo o Deploy desde carpeta con estos archivos.  
3. Runtime: Node 20+ (en `render.yaml` se fija a 22.16.0).  
4. Build command **obligatorio**: `npm install && npm run build` (si no se ejecuta, no existirá `dist/` y verás “Cannot find module dist/index.js”).  
5. Start command: `npm start`.  
6. Variables de entorno: copiar las de `.env`.  
7. URL pública resultante: configurarla como `CALLBACK URL` en Meta Developers para tu app IG.

## Despliegue en Railway
1. Crear proyecto → Nuevo servicio → Deploy repo/carpeta.  
2. Variables de entorno: mismas que `.env`.  
3. Start: `npm start` (Railway instala deps y corre `npm run build` si hay `build`).  
4. Habilitar dominio público y usarlo como webhook URL en Meta.

## Webhook en Meta (Instagram Messaging)
- En tu App de Meta, sección Webhooks: suscribirse a **instagram** con campos `messages`, `messaging_postbacks`, `messaging_optins`.  
- `Callback URL`: `https://tu-dominio/webhook`  
- `Verify Token`: mismo valor que `VERIFY_TOKEN`.  
- Asegura permisos: `instagram_manage_messages`, `pages_manage_metadata`, `pages_read_engagement`.  
- Vincula la cuenta de Instagram Business a tu app.

## Probar local con ngrok
```
ngrok http 3000
ngrok url -> https://<subdominio>.ngrok.io/webhook
```
Configura ese URL en Meta mientras desarrollas.

## Notas de seguridad
- Se valida firma `X-Hub-Signature-256` con `APP_SECRET`.  
- No mezclar `ACCESS_TOKEN` de producción y sandbox.  
- Limita scopes del token y rota periódicamente.

## Primeros 10 mensajes automáticos sugeridos
1. "¡Hola! Soy el asistente de Virtuosa Biblias. ¿Quieres ver nuestro catálogo o saber precios?"  
2. "Te personalizamos la Biblia con tu nombre en foil dorado o plata. ¿Cuál prefieres?"  
3. "Tenemos ediciones Reina Valera, NTV y NVI. ¿Buscas tamaño compacto, mediano o de estudio?"  
4. "Nuestras restauraciones conservan costuras y refuerzan lomo. ¿Tu Biblia necesita restauración completa o parcial?"  
5. "Envíos a todo el país con guía rastreable. ¿A qué ciudad la enviamos?"  
6. "Los precios van de $45 a $120 USD según edición y acabado. ¿Cuál es tu presupuesto?"  
7. "Tiempo de producción personalizado: 3 a 5 días hábiles. ¿Tienes alguna fecha especial?"  
8. "Podemos grabar dedicatorias interiores. ¿Quieres incluir un mensaje especial?"  
9. "Aceptamos pago con tarjeta o transferencia. ¿Cuál prefieres?"  
10. "Si prefieres hablar con una persona, dime 'humano' y te atendemos en breve."
