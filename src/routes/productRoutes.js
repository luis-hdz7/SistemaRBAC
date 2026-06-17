import express from 'express';
import {verifyToken} from "../middleware/authMiddleware.js"
import authorizeRoles from "../middleware/roleMiddleware.js"
import { getAllProducts, createProduct,getProduct, updateProduct, deleteProduct } from "../controllers/productControllers.js"

const router = express.Router();

//* Todos pueden acceder a esta ruta (users, employee, admin)
router.get("/",getAllProducts)

//* EMPLOYEE & ADMIN pueden acceder a esta ruta
router.get("/:id",verifyToken, authorizeRoles("EMPLOYEE", "ADMIN"),getProduct)

//* EMPLOYEE & ADMIN pueden acceder a esta ruta
router.post("/",verifyToken, authorizeRoles("EMPLOYEE", "ADMIN"),createProduct)

//* EMPLOYEE & ADMIN pueden acceder a esta ruta
router.put("/:id",verifyToken, authorizeRoles("EMPLOYEE", "ADMIN"),updateProduct)

//*Solo ADMIN puede acceder a esta ruta
router.delete("/:id",verifyToken, authorizeRoles("ADMIN"),deleteProduct)

export default router;