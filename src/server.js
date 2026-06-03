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