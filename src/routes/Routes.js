class Routes {
    constructor(server) {
        this.server = server;
        this.router = this.server.router
        this.prefix = '/v1';
    }
}

export default Routes