import BankTransfer from "../services/BankTransfer.js";
import MidtransService from "../services/MidtransService.js";
import User from "../models/User.js";
import ErrorHandler from "../Helpers/Errors/ErrorHandler.js";
import Ewallet from "../services/EWallet.js";


class MidtransController {
    constructor(server) {
        this.server = server;
        this.MidtransService = new MidtransService(this.server);
        this.UserModel = new User(this.server).table;
    }

    async bankTransfer(req, res){
        try{
            const auth = req.auth;
            const {channel, items} = req.body;

            const user = await this.UserModel.findByPk(auth.user_id);

            let data;
            const customer = {
                first_name: user.name,
                last_name: '',
                email: user.email,
            }
            let bankTransfer = new BankTransfer(items, customer);

            switch (channel) {
                case "BCA":
                    data = bankTransfer.bca();
                    break;
                case "BNI":
                    data = bankTransfer.bni();
                    break;
                case "PERMATA":
                    data = bankTransfer.permata();
                    break;
            }

            const result = await this.MidtransService.charge(data);
            console.log(result);

            return res.status(200).json(result);
        }catch (err){
            ErrorHandler.handle(err,req,res);
        }

    }

    async gopay(req,res){
        try {
            let data;
            let {payment_type, items} = req.body;
            let customer = {
                email:"vadero@gmail.com",
                first_name:"dero",
                last_name:"",
                phone:"0852840653",
            }
        
            let eWallet = new Ewallet(items, customer)
            data = eWallet.goPay()

            const result = await this.MidtransService.charge(data);

            return res.status(200).json(result)
    
        } catch (err) {
            ErrorHandler.handle(err,req,res);
        }
    }

}

export default MidtransController;