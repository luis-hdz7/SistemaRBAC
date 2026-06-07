//*Importaciones
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import arcjet, { tokenBucket, shield } from "@arcjet/node";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import { connectDB, disconnectDB } from "./config/dbConnect.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
//*aplicar el arcjet rate-limit a todas las rutas
const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({}),
    tokenBucket({
      mode: "LIVE",
      refillRate: 10,
      interval: 60,
      capacity: 20,
    }),
  ],
});
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(async (req, res, next) => {
  try {
    const decision = await aj.protect(req);
    if (decision.isDenied()) {
      return res.status(403).json({
        error: "Access denied",
      });
    }
    next();
  } catch (err) {
    next(err);
  }
});


//*Rutas
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);

let server;

//*Hacer correr el servidor
async function startServer() {
  try {
    await connectDB();

    server = app.listen(PORT, () => {
      console.log(`Servidor escuchando en puerto ${PORT}`);
    });

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
startServer();
process.on("SIGTERM", async () => {
  await disconnectDB();

  if (server) {
    server.close(() => process.exit(0));
  }
});