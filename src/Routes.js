import AuthRoutes from "./routes/AuthRoutes.js";

class Routes {
    constructor(server) {
        new AuthRoutes(server);
    }
}

export default Routes

/*
const routes = express.Router();

authRoutes.forEach((route) => {
    routes.use('/auth', route);
});

export default routes;
 */
