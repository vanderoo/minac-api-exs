import express from "express";
import dotenv from "dotenv";
import router from "./routes";
import sequelize from "../config/database";
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

app.use(express.json())

app.use(router);

app.listen( port,()=> {
    console.log("Server running on port ", port);
})