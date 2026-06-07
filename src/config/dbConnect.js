import { PrismaClient } from "@prisma/client";
//*Mostrar las query que hagamos, errores y advertencias si estamos creando el proyecto, de otra manera solo mostrara el error
const prisma = new PrismaClient({
    log: process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"]
});
//*Funcion para conectar la base de datos
const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("Base de datos conectada a prisma");
    } catch (error) {
        console.error(`Conexion a la BD ocurrio un error ${error.message}`);
        process.exit(1);
    }
};
//*Funcion para desconectarla
const disconnectDB = async () => {
    await prisma.$disconnect();
};
export { prisma, connectDB, disconnectDB };