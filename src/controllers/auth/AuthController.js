//Libs
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import User from '../../models/User.js';

class AuthController {

    constructor(server) {
        this.server = server;
        this.UserModel = new User(this.server).table;

         this.encryptionKey = crypto.createHash('sha256')
             .update(this.server.env.APP_KEY, 'utf8')
             .digest();
    }

    async register (req, res) {
        try {
            console.log(this.UserModel);
            const { name, email,username, password, conPass } = req.body;

            const checkUsername = await this.UserModel.findOne({
                where: { username: username },
            });
            const checkEmail = await this.UserModel.findOne({
                where: { email: email },
            });

            if (checkUsername) {
                return res.status(400).json({ message: "Username has used" });
            }
            if (checkEmail) {
                return res.status(400).json({ message: "Email has used" });
            }
            if (password !== conPass) {
                return res.status(400).json({ message: "Password not identical" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await this.UserModel.create({
                name: name,
                email: email,
                username: username,
                password: hashedPassword,
            });
            return res
                .status(201)
                .json({ message: `account ${user.username} has been created` });
        } catch (error) {
            console.error(error.message)
            res.status(500).json({ error: error.message });
        }
    };

    async login (req, res) {
        try {
            const { username, password } = req.body;

            const user = await this.UserModel.findOne({
                where: { username: username },
            });

            if (!user) {
                return res.status(404).json({ message: "username tidak ditemukan" });
            }

            const verifyPass = await bcrypt.compare(password, user.password);
            if (!verifyPass) {
                return res.status(400).json({ message: "Password salah" });
            }

            const user_id = user.id;
            const user_username = user.username

            const authToken = jwt.sign({ user_id, user_username }, this.server.env.JWT_SECRET, {
                expiresIn: '30s',
            });
            const refreshToken = jwt.sign({ user_id, user_username }, this.server.env.REFRESH_TOKEN_SECRET, {
                expiresIn: '2d',
            });

            const { encryptedRefreshToken, iv } = this.encryptRefreshToken(refreshToken);
            const refreshTokenEnc = `${encryptedRefreshToken}.${iv}`;

            await this.UserModel.update({'refreshToken': refreshTokenEnc}, {
                where: {
                    id: user.id,
                }
            })

            res.cookie("refreshToken", refreshTokenEnc, {
                httpOnly: true,
                maxAge: 3 * 24 * 60 * 60 * 1000,
            });

            res.cookie("authToken", authToken, {
                httpOnly: true,
                maxAge: 3 * 24 * 60 * 60 * 1000,
            });

            return res.status(200).json({ message: "Login sukses"});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    async refreshToken(req, res){
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken){
            return res.status(401).json({message: 'Request Unauthorized'})
        }

        const user = await this.UserModel.findOne({
            where: {
                'refreshToken': refreshToken,
            },
        })

        if(!user){
            return res.status(403).json({message: 'Invalid Refresh Token'});
        }

        const encryptedRefreshToken = refreshToken && refreshToken.split('.')[0];
        const iv = refreshToken && refreshToken.split('.')[1];

        const rawRefreshToken = this.decryptRefreshToken(encryptedRefreshToken, iv);

        jwt.verify(rawRefreshToken, this.server.env.REFRESH_TOKEN_SECRET, (err, data) => {
            if(err && err.name === 'TokenExpiredError'){
                return res.status(403).json({message: 'Refresh Token Expired'});
            }
            if(err){
                return res.status(403).json({message: 'Refresh Token Unauthorized'});
            }

            const user_id = data.user_id;
            const user_username = data.user_username;
            const authToken = jwt.sign({user_id, user_username}, this.server.env.JWT_SECRET,{
                expiresIn: '30s',
            })

            res.cookie("authToken", authToken, {
                httpOnly: true,
                maxAge: 3 * 24 * 60 * 60 * 1000,
            });
            return res.status(200).json({message: 'Refresh Token Success', authToken: authToken});

        })


    }

    async logout(req, res){
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken) return res.status(204).json({message: 'You are not logged in'});

        try {

            const user = await this.UserModel.findOne(
                {
                    where: {'refreshToken': refreshToken}
                }
            )
            if(!user) return res.status(403).json({message: 'Invalid Refresh Token'});

            await this.UserModel.update(
                {
                    'refreshToken': null
                }, {
                    where: {
                        'id': user.id,
                    },
                });

        }catch (err){
            return res.status(500).json({message: 'Server Error'});
        }

        res.clearCookie('authToken');
        res.clearCookie('refreshToken');


        return res.status(200).json({message: 'Logout Success'});

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

export default AuthController;



