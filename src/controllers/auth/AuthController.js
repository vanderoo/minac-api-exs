import AuthService from "../../services/AuthService.js";
import ErrorHandler from "../../Helpers/Errors/ErrorHandler.js";

class AuthController {

    constructor(server) {
        this.server = server;
        this.AuthService = new AuthService(this.server);
    }

    async register (req, res) {
        try {
            const { name, email, username, password, conPass } = req.body;

            const user = await this.AuthService.register(name,email,username,password,conPass);

            return res.status(201).json({status:201, message: `account ${user.username} has been created` });
        } catch (error) {
            ErrorHandler.handle(error, req, res);
        }
    };

    async login (req, res) {
        try {
            const { username, password } = req.body;

            const {accessToken, refreshToken} = await this.AuthService.login(username,password);

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 3 * 24 * 60 * 60 * 1000,
            });

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                maxAge: 3 * 24 * 60 * 60 * 1000,
            });

            return res.status(200).json({status:200, message: "Login Success"});
        } catch (error) {
            ErrorHandler.handle(error, req, res);
        }
    };

    async refreshToken(req, res){
        try {
            const refreshToken = req.cookies.refreshToken;

            if(!refreshToken){
                return res.status(401).json({message: 'Request Unauthorized'})
            }

            const payload = await this.AuthService.verifyRefreshToken(refreshToken);

            const accessToken = this.AuthService.generateAccessToken(payload.user_id, payload.user_name);

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                maxAge: 3 * 24 * 60 * 60 * 1000,
            });

            return res.status(200).json({status:200, message: 'Refresh Token Success', accessToken: accessToken});
        }catch (error){
            ErrorHandler.handle(error, req, res);
        }
    }

    async logout(req, res){
        try{
            const refreshToken = req.cookies.refreshToken;

            if(!refreshToken) return res.status(403).json({status:403, message: 'You are not logged in'});

            await this.AuthService.logout(refreshToken);

            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');

            return res.status(200).json({status:200, message: 'Logout Success'});

        }catch (error){
            ErrorHandler.handle(error,req,res);
        }
    }
}

export default AuthController;