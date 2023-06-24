const express = require('express')
const dotenv = require('dotenv')
const router = require('./routes')
const sequelize = require('./config/database')
//const User = require('./models/User')

dotenv.config()

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.')
        //sequelize.sync()
    })
    .catch(error => {
        console.error(`Unable to connect to the database: ${error}`)
    })

const port = process.env.PORT
const app = express()

app.use(router);

app.listen( port,()=> {
    console.log("Server running on port ", port);
})