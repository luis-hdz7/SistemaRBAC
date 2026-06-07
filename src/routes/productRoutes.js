import express from 'express';
import { getAllProducts, createProduct,getProduct, updateProduct, deleteProduct } from "../controllers/productControllers.js"

const router = express.Router();

//* Todos pueden acceder a esta ruta (users, employee, admin)
router.get("/",getAllProducts)
router.get("/:id",getProduct)
router.post("/",createProduct)
router.put("/:id",updateProduct)
//*Solo ADMIN puede acceder a esta ruta
router.delete("/:id",deleteProduct)

export default router;