import { Router } from 'express'
import { authToken } from '../utils/jsonwebtoken.js'
const router = new Router()
import { passportCall } from '../utils/jsonwebtoken.js'
import { authorization } from '../utils/jsonwebtoken.js'

router.get('/login', (req,res) => {
  res.render("login")
})

router.get('/register', (req, res) => {
    res.render("register")
})

router.get('/', 
    //authToken, 
    passportCall('jwt'),
    authorization('user'),
    (req,res) => {
    //Revisar
    const user = req.user.user;
    console.log("router para Profile", user)
    res.render('profile', { user });
})

export default router