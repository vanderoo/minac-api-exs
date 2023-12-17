//Libs
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser"

import Database from "./config/Database.js";
import Routes from "./Routes.js";

class Server{
    constructor() {
        //Set Environment
        dotenv.config();
        this.env = process.env;

        //Set Model Database
        this.model = new Database(this);

        //Create Router
        this.router = express.Router();
        this.initModel()
            .catch(err => {
                console.log(err.message);
            });
    }

    async initModel(){
        //Model Connection Test
        const isModelConnected =  await this.model.connect();
        if(isModelConnected === -1) return;
        this.run();
    }

    run(){
        //init server
        this.APP = express();

        //Middlewares
        this.APP.use(
            cors({
                origin: true,
            })
        ); // - CORS 
        this.APP.use(cookieParser()) // - Cookie Parser
        this.APP.use(express.json());   // - JSON Parser

        //init and use routes
        new Routes(this);
        this.APP.use(this.router);

        //run server on port
        this.APP.listen(this.env.PORT, ()=>{
            console.log(`Server running on port ${this.env.PORT}`);
        });

    }
}

new Server()
