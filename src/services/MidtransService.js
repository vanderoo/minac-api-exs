import axios from "axios";
import Midtrans from "../config/Midtrans.js";

class MidtransService{

    constructor(server) {
        this.server = server;
        this.config = new Midtrans(this.server);
    }

    post(url, secretKey, payloads){
        const headers =  {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization:
                "Basic " + Buffer.from(secretKey + ":").toString("base64"),
        }

        let body = JSON.stringify(payloads);

        return axios.post(url, body, {
            headers: headers
        }).then((res) => {
            return res.data;
        }).catch(e => console.log(e));
    }

    charge(payloads) {
         return this.post(
            this.config.getBaseUrl() + "/charge",
            this.config.serverKey,
            payloads
        );
    }
}

export default MidtransService;