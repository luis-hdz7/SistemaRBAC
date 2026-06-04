//*Importaciones
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from "./routes/authRoutes.js"
import userRouter from "./routes/userRoutes.js"
import productRouter from "./routes/productRoutes.js"
import { config } from "dotenv"
//Importar las variables de db.js
import { connectDB,disconnectDB} from "./config/dbConnect.js";
config();//*"Carga la configuración del archivo .env" eso hace config()
connectDB();
//*Inicializar la app
const app = express();
dotenv.config()
const PORT= process.env.PORT || 3000
app.use(helmet())//secure middleware
app.use(morgan("dev"))//log the request
app.use(express.json())
app.use(cors())

//aplicar el arcjet rate-limit a todas las rutas
app.use(async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1,
    });

    if (decision.isDenied()) {

      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          error: "Too Many Requests",
        });
      }

      if (decision.reason.isBot()) {
        return res.status(403).json({
          error: "Forbidden: Bot detected",
        });
      }

      return res.status(403).json({
        error: "Forbidden: Access denied",
      });
    }

    next();

  } catch (error) {
    console.error("Error applying Arcjet middleware:", error);

    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

//*Routes
//auth routes
app.use("/api/auth",authRouter)
app.use("/api/users", userRouter)

//app routes
app.use("/api/products", productRouter)


//*Hacer correr el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

// Handle unhandled promise rejections (e.g., database connection errors)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

//*Casos que queremos manejar errores con nuestra db
// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await disconnectDB();
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});