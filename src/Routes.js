import AuthRoutes from "./routes/AuthRoutes.js";
import PaymentRoutes from "./routes/PaymentRoutes.js";

class Routes {
    constructor(server) {
        new AuthRoutes(server);
        new PaymentRoutes(server);
    }
}

export default Routes