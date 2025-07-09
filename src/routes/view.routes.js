import { Router } from "express";
import cookieParser from 'cookie-parser'

const router = Router();

// Cookie sin Firma
//Significa que puedo modificar la cookie
router.use(cookieParser('CoderCookieFirmda'))


// Cookie con Firma

//Set cookie
// req -> me envian (recibo)
// res -> envio al cliente
router.get('/setcookie', (req, res) => {
    let data = "Esto es una cookie de test"

    //sin firma
    res.cookie('cookieCoder', data, {maxAge: 500000, signed: true}).
    send({status: "Success", msg: " Cookie asignada con exito!!!"})
})

router.get('/getcookie', (req, res) => {
    // res.send(req.cookies) //<- Sin firma

    res.send(req.signedCookies)
})

router.get('/deletecookie', (req, res) => {
    res.clearCookie('cookieCoder').send({status: "Success", msg: "Cookie borrada con exito!!!"})
})

export default router;