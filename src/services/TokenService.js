import crypto from "crypto";

class TokenService {
    constructor(server) {
        this.server = server;
        this.encryptionKey = crypto.createHash('sha256').update(this.server.env.APP_KEY, 'utf8').digest();
    }

    encryptRefreshToken(refreshToken){
        try {
            const algorithm = 'aes-256-cbc';
            const iv = crypto.randomBytes(16);

            const cipher = crypto.createCipheriv(algorithm, this.encryptionKey, iv);

            let encryptedRefreshToken = cipher.update(refreshToken, 'utf8', 'hex');
            encryptedRefreshToken += cipher.final('hex');
            return {
                encryptedRefreshToken,
                iv: iv.toString('hex'),
            };
        }catch(err){
            console.log(err);
        }

    }

    decryptRefreshToken(encryptedRefreshToken, iv){
        const algorithm = 'aes-256-cbc';
        const decipher = crypto.createDecipheriv(algorithm, this.encryptionKey, Buffer.from(iv, 'hex'));

        let decryptedRefreshToken = decipher.update(encryptedRefreshToken, 'hex', 'utf8');
        decryptedRefreshToken += decipher.final('utf8');
        return decryptedRefreshToken;
    }

}

export default TokenService;