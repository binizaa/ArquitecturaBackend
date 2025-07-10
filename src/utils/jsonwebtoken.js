import jwt from 'jsonwebtoken'
import { Strategy } from 'passport-jwt'
import passport from 'passport'

//JWT: Nativo

export const PRIVATE_KEY = "BiniKeyQueFuncionaUnSecret"

export const generateJWTToken = (user) => {
    return jwt.sign({user}, PRIVATE_KEY, {expiresIn:'24h'})
}

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        console.log("Entrando a llamar startegy: ", strategy)

        passport.authenticate(strategy, function(err, user, info){
            if(err) return next(err)
            
            if(!user){
                return res.status(401).send({error: info.message ? info.message : info.toString()})
            }

            console.log("Usuario obtenido del strategy")
            console.log(user)

            req.user = user
            next()
        })(req,res,next)
    }
}

export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    console.log("Token present in header auth: ", authHeader)

    if(!authHeader) return res.status(401).send({error: "User not authenticated or missing token"})

    const token = authHeader.split(' ')[1] //Se hace para retirar la palabra Bearer

    //Validamos
    jwt.verify(token, PRIVATE_KEY, (error, credential) => {
        if(error) return res.status(403).send({error: "Token invalid, Unauthorized"})

        //Todo ok
        req.user = credential.user
        console.log(req.user)
        next()
    })
} 

export const authorization = (role) => {
    return async (req, res, next) => {
        if(!req.user) return res.status(401).send("Unauthorized: User not found in JWT")

        if(req.user.role !== role) {
            return res.status(403).send("Forbidden: El usuario no tiene permisos con este rol.")
        }
        next()
    }
}