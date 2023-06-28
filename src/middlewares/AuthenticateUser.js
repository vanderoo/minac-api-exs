//Libs
import jwt from "jsonwebtoken";

class AuthenticateUser {
    constructor(server) {
        this.server = server;
    }

    verifyToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Request Unauthorized' });
        }

        jwt.verify(token, this.server.env.JWT_SECRET, (err, data) => {

            if (err && err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token Expired' });
            }

            if (err) {
                return res.status(401).json({ message: 'Token Unauthorized' });
            }

            req.auth = data;

            next();
        });

    }
}

export default AuthenticateUser;