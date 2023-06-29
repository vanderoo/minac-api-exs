//Libs
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";

import TokenService from "./TokenService.js";
import CustomError from "../Helpers/Errors/CustomError.js";
import Token from "../models/Token.js";
import User from "../models/User.js";

class AuthService {
    constructor(server) {
        this.server = server;
        this.UserModel = new User(this.server).table;
        this.TokenModel = new Token(this.server).table;
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

        const refreshToken = await this.generateRefreshToken(user.id, user.name);

        return {
            accessToken,
            refreshToken
        }
    }

    generateAccessToken(user_id, user_name) {
        return jwt.sign(
            {user_id, user_name},
            this.server.env.JWT_SECRET,
            {expiresIn: '10m'}
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

        console.log('USER ID: ' + user_id);
        await this.TokenModel.create({
            refreshToken: refreshTokenEnc,
            UserId: user_id
        });

        return refreshToken;
    }

    async getTokenUser(userId) {
        const tokenUser = await this.TokenModel.findAll({ where: { UserId: userId } });
        if (!tokenUser) {
            throw new CustomError('Invalid Refresh Token', 403);
        }
        return tokenUser;
    }

    validateTokenUser(tokenUser, refreshToken) {
        const tokenValid = tokenUser.find((token) => {
            const modelToken = token.dataValues.refreshToken;
            const encryptedRefreshToken = modelToken.split('.')[0];
            const iv = modelToken.split('.')[1];
            const rawRefreshToken = this.TokenService.decryptRefreshToken(
                encryptedRefreshToken,
                iv
            );

            return rawRefreshToken === refreshToken ? token : undefined;
        });

        if (!tokenValid) {
            throw new CustomError('Invalid Refresh Token', 403);
        }

        return tokenValid;

    }

    async verifyRefreshToken(refreshToken) {
        let decodedToken;
        try {
            decodedToken = jwt.verify(refreshToken, this.server.env.REFRESH_TOKEN_SECRET);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                throw new CustomError('Refresh Token Expired', 403);
            } else {
                throw new CustomError('Refresh Token Unauthorized', 403);
            }
        }

        const tokenUser = await this.getTokenUser(decodedToken.user_id);
        this.validateTokenUser(tokenUser, refreshToken);

        return {
            user_id: decodedToken.user_id,
            user_name: decodedToken.user_name,
        }

    }

    async logout(refreshToken){
        let decodedToken;
        try {
            decodedToken = jwt.verify(refreshToken, this.server.env.REFRESH_TOKEN_SECRET);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                throw new CustomError('Refresh Token Expired', 403);
            } else {
                throw new CustomError('Refresh Token Unauthorized', 403);
            }
        }

        const tokenUserArr = await this.getTokenUser(decodedToken.user_id);
        const tokenUser = await this.validateTokenUser(tokenUserArr,refreshToken);

        tokenUser.destroy({force: true});
    }

}

export default AuthService;