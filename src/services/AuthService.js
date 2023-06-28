//Libs
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";

import TokenService from "./TokenService.js";
import User from "../models/User.js";
import CustomError from "../Helpers/Errors/CustomError.js";

class AuthService {
    constructor(server) {
        this.server = server;
        this.UserModel = new User(this.server).table;
        this.TokenService = new TokenService(this.server);
    }

    async register(name, email, username, password, conPass){
        const checkUsername = await this.UserModel.findOne({
            where: { username: username },
        });

        const checkEmail = await this.UserModel.findOne({
            where: { email: email },
        });

        let message;
        if (checkUsername) {
            message = 'Username has been used';
        }else if (checkEmail) {
            message = 'Email has been used';
        }else if (password !== conPass) {
            message = 'Password not identical';
        }

        if (message) throw new CustomError(message, 400);

        const hashedPassword = await bcrypt.hash(password, 10);

        return await this.UserModel.create({
            name: name,
            email: email,
            username: username,
            password: hashedPassword,
        });
    }

    async login(username, password){
        const user = await this.UserModel.findOne({
            where: { username: username },
        });

        if (!user) {
            throw new CustomError('Invalid Username or Password', 401);
        }

        const verifyPass = await bcrypt.compare(password, user.password);

        if (!verifyPass) {
            throw new CustomError('Invalid Username or Password', 401);
        }

        const accessToken = this.generateAccessToken(user.id, user.name)

        const encryptedRefreshToken = await this.generateRefreshToken(user.id, user.name);

        return {
            accessToken,
            encryptedRefreshToken
        }
    }

    generateAccessToken(user_id, user_name) {
        return jwt.sign(
            {user_id, user_name},
            this.server.env.JWT_SECRET,
            {expiresIn: '30s'}
        );
    }

    async generateRefreshToken(user_id, user_name) {
        const refreshToken = jwt.sign(
            { user_id, user_name },
            this.server.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '2d' }
        );

        const { encryptedRefreshToken, iv } = this.TokenService.encryptRefreshToken(refreshToken);
        const refreshTokenEnc = `${encryptedRefreshToken}.${iv}`;

        await this.UserModel.update(
            { refreshToken: refreshTokenEnc },
            {
                where: {
                    id: user_id,
                },
            }
        );

        return refreshTokenEnc;
    }

    async verifyRefreshToken(refreshToken) {
        const user = await this.UserModel.findOne({
            where: {refreshToken: refreshToken},
        });

        if (!user) {
            throw new CustomError('Invalid Refresh Token', 403);
        }

        const encryptedRefreshToken = refreshToken && refreshToken.split('.')[0];
        const iv = refreshToken && refreshToken.split('.')[1];

        const rawRefreshToken = this.TokenService.decryptRefreshToken(encryptedRefreshToken, iv);

        try {
            const decodedToken = jwt.verify(rawRefreshToken, this.server.env.REFRESH_TOKEN_SECRET);
            return {
                user_id: decodedToken.user_id,
                user_name: decodedToken.user_name,
            };
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                throw new CustomError('Refresh Token Expired', 403);
            } else {
                throw new CustomError('Refresh Token Unauthorized', 403);
            }
        }
    }

    async logout(refreshToken){
        const user = await this.UserModel.findOne(
            {
                where: {refreshToken: refreshToken}
            }
        );

        if (!user) throw new CustomError('Invalid Refresh Token', 403);

        await this.UserModel.update(
            {
                refreshToken: null
            }, {
                where: {
                    id: user.id,
                },
            });
    }

}

export default AuthService;