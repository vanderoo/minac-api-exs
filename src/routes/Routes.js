import AuthenticateUser from "../middlewares/AuthenticateUser.js";

class Routes {
    constructor(server) {
        this.server = server;
        this.router = this.server.router;
        this.prefix = `/${this.server.env.API_Version}`;
        this.authenticateUser = new AuthenticateUser(this.server);
    }
}

export default Routes;