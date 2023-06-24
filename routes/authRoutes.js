const express = require('express')

const authRoutes = express.Router()

const routes = [
    authRoutes.get('/login', (req,res) => {
        res.json({msg: "Hello Niggas This is Login"})
    }),
    authRoutes.get('/register', (req,res) => {
        res.json({msg: "Hello Niggas This is Register"})
    })
]


module.exports = routes