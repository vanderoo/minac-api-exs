import Routes from "./Routes.js";
import AuthController from "../controllers/auth/AuthController.js";

class AuthRoutes extends Routes{
    constructor(server) {
        super(server);
        this.authPrefix = this.prefix + '/auth';
        this.AuthController = new AuthController(this.server);

        this.routes();
    }

    routes(){
        this.router.post(this.authPrefix + '/register', this.AuthController.register.bind(this.AuthController));
        this.router.post(this.authPrefix + '/login', this.AuthController.login.bind(this.AuthController));
    }

}

export default AuthRoutes

/*
const authRoutes = express.Router();

authRoutes.post('/login', login);
authRoutes.post('/register', register);

const routes = [authRoutes];

export default routes;
 */

