import { Router } from 'express'
import { authToken } from '../utils/jsonwebtoken.js'
const router = new Router()
import { passportCall } from '../utils/jsonwebtoken.js'

router.get('/login', (req,res) => {
  res.render("login")
})

router.get('/register', (req, res) => {
    res.render("register")
})

router.get('/', 
    //authToken, 
    passportCall('jwt'),
    (req,res) => {
    res.render("profile", {
        // user: req.session.user
        user: req.user
    })
})

export default router