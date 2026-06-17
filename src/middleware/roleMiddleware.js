//*Funcion que nos permite validar el rol del usuario
//! Una de las funciones principales que nos permiten traducir de la matematica a codigo
const authorizeRoles=(...allowedRoles)=> {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Acceso denegado: rol no autorizado" })
        }
        next()
    }
}

export default authorizeRoles;