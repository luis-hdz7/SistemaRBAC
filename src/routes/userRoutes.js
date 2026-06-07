//! Este archivo es de prueba, se utilizo para demostrar que en el backend funcionaba el sistema de roles
//en el programa nunca se usa
import { Router } from "express"
import {verifyToken} from "../middleware/authMiddleware.js"
import authorizeRoles from "../middleware/roleMiddleware.js"
const router = Router()
//*Solo ADMIN puede acceder a esta ruta
router.get("/admin", verifyToken, authorizeRoles("ADMIN"), (req, res) => {
    res.json({
        message: "Ruta accesible solo para ADMIN"
    })
})

//*Solo EMPLOYEE y ADMIN pueden acceder a esta ruta
router.get("/employee", verifyToken, authorizeRoles("EMPLOYEE", "ADMIN"), (req, res) => {
    res.json({
        message: "Ruta accesible solo para EMPLOYEE y ADMIN"
    })
})

//*Cualquier usuario puede acceder a esta ruta
router.get("/public", verifyToken, authorizeRoles("USER", "EMPLOYEE", "ADMIN"), (req, res) => {
    res.json({
        message: "Ruta accesible para cualquier usuario"
    })
})

export default router