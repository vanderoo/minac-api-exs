import Routes from "./Routes.js";
import MidtransController from "../controllers/MidtransController.js";


class PaymentRoutes extends Routes{
    constructor(server) {
        super(server);
        this.paymentPrefix = this.prefix + '/payment';
        this.MidtransController = new MidtransController(this.server);

        this.routes();
    }

    routes(){
        this.router.post(
            this.paymentPrefix + '/charge/bt',
            this.authenticateUser.verifyToken.bind(this.authenticateUser),
            this.MidtransController.bankTransfer.bind(this.MidtransController)
        );
        this.router.post(
            this.paymentPrefix + '/charge/gopay',
            this.MidtransController.gopay.bind(this.MidtransController)
        );
        this.router.get('/', (req,res) => {
            res.status(200).json({status: "Connected"})
        }
        );
    }
}

export default PaymentRoutes;