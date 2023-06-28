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
        this.router.post(
            this.authPrefix + '/register',
            this.AuthController.register.bind(this.AuthController)
        );

        this.router.post(
            this.authPrefix + '/login',
            this.AuthController.login.bind(this.AuthController)
        );

        this.router.post(
            this.authPrefix + '/logout',
            this.AuthController.logout.bind(this.AuthController)
        );

        this.router.post(
            this.authPrefix + '/refresh-token',
            this.AuthController.refreshToken.bind(this.AuthController)
        );

        this.router.get(
            this.authPrefix + '/protected',
            this.authenticateUser.verifyToken.bind(this.authenticateUser),
            (req,res) => {
                return res.status(200).json(`This is Protected Routes ${req.auth.user_name}`);
            }
        );
    }
}

export default AuthRoutes;