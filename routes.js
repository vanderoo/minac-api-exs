const express = require('express')
const authRoutes = require('./routes/authRoutes')

const routes = express.Router()

authRoutes.forEach(route =>  {
    routes.use('/auth', route)
})

module.exports = routes