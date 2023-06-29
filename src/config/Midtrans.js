'use strict';

class Midtrans {

    constructor(server) {
        this.server = server;
        this.serverKey = this.server.env.MIDTRANS_SERVER_KEY;
        this.isProduction = false;
        this.is3ds = false;
        this.isSanitized = false;
    }

    getBaseUrl(){
        return this.isProduction ? this.server.env.PRODUCTION_BASE_URL : this.server.env.SANDBOX_BASE_URL;
    }

}

export default Midtrans;