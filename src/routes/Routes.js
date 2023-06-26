import AuthenticateUser from "../middleware/AuthenticateUser.js";

class Routes {
    constructor(server) {
        this.server = server;
        this.router = this.server.router
        this.prefix = '/v1';
        this.authenticateUser = new AuthenticateUser(this.server);
    }
}

export default Routes