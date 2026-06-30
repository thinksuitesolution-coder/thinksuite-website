require("dotenv").config();
const express = require("express");
const cors = require("cors");
const winston = require("winston");

/* â”€â”€ Logger   must be first so all modules can use global.logger â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
      return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`;
    })
  ),
  transports: [new winston.transports.Console()],
});
global.logger = logger;

/* â”€â”€ Crash handlers   make errors visible in Railway logs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
process.on("uncaughtException", (err) => {
  logger.error(`UNCAUGHT EXCEPTION: ${err.message}`, { stack: err.stack });
  process.exit(1);
});
process.on("unhandledRejection", (reason) => {
  logger.error(`UNHANDLED REJECTION: ${reason}`);
  process.exit(1);
});

/* â”€â”€ Firebase Admin â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const admin = require("firebase-admin");
if (!admin.apps.length) {
  try {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON || process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON (or _KEY) is not set");
    const serviceAccount = JSON.parse(raw);
    const bucket = process.env.FIREBASE_STORAGE_BUCKET || `${serviceAccount.project_id}.appspot.com`;
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: bucket,
    });
    logger.info(`Firebase Storage bucket: ${bucket}`);
    logger.info("Firebase Admin initialized");
  } catch (err) {
    logger.warn(`Firebase Admin NOT initialized: ${err.message}`);
  }
}
global.firebaseAdmin = admin;

/* â”€â”€ Routes   loaded after logger and firebase are ready â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const videoRoutes        = require("./src/routes/video");
const videoEditRoutes    = require("./src/routes/videoEdit");
const avatarRoutes       = require("./src/routes/avatar");
const animatedVideoRoutes = require("./src/routes/animatedVideo");
const webhookWhatsapp    = require("./src/routes/webhookWhatsapp");

/* â”€â”€ Express setup â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const app = express();

app.use(cors({
  origin: [
    "https://Thinksuite.in",
    "https://tools.Thinksuite.in",
    /\.Thinksuite\.in$/,
    "http://localhost:3000",
  ],
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));

/* â”€â”€ Auth middleware: verify backend secret â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function requireSecret(req, res, next) {
  const secret = req.headers["x-backend-secret"];
  if (!secret || secret !== process.env.BACKEND_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

/* â”€â”€ Routes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
app.get("/health", (req, res) => res.json({ ok: true, ts: Date.now() }));
app.use("/video", requireSecret, videoRoutes);
app.use("/avatar", requireSecret, avatarRoutes);
app.use("/animated", requireSecret, animatedVideoRoutes);

/* Video Edit routes   no backend secret needed (called from browser) */
app.use("/api", videoEditRoutes);

/* WhatsApp Webhook   public endpoint (Meta calls this) */
app.use("/webhook/whatsapp", webhookWhatsapp);

/* â”€â”€ Start â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`Video backend running on port ${PORT}`);
});
