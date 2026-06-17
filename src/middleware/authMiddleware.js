import jwt from "jsonwebtoken"
//*Verificar jwt
export const verifyToken=(req, res, next)=>{
    let token;
    let authHeader=req.headers["authorization"] || req.headers["Authorization"]
    if(authHeader && authHeader.startsWith("Bearer ")){
        token=authHeader.split(" ")[1]
    }
    if(!token){
        return res.status(401).json({
            error: "No se paso un token"
        })
    }
    try{
        const decoded=jwt.verify(token, process.env.JWT_SECRET)
        req.user=decoded
        next()
    } catch (err) {
        return res.status(403).json({
            error: "Token no válido"
        })
    }
}
export default {
    verifyToken
}