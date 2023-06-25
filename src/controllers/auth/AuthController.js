import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';

class AuthController {

    constructor(server) {
        this.server = server;
        this.UserModel = new User(this.server).table;
        this.test = "HALO DUNIA";
    }

    testing(){
        console.log(this.test)
        console.log('test')
    }

    async register (req, res) {
        try {
            console.log(this.UserModel);
            const { username, password, conPass } = req.body;

            const checkUsername = await this.UserModel.findOne({
                where: { username: username },
            });

            if (checkUsername) {
                return res.status(400).json({ message: "Username has used" });
            }
            if (password !== conPass) {
                return res.status(400).json({ message: "Password not identical" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await this.UserModel.create({
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

// Masuk ke akun pengguna
    async login (req, res) {
        try {
            const { username, password } = req.body;

            const user = await this.UserModel.findOne({
                where: { username: username },
            });

            if (user === null) {
                return res.status(404).json({ message: "username tidak ditemukan" });
            }

            const verifyPass = await bcrypt.compare(password, user.password);
            if (!verifyPass) {
                return res.status(400).json({ message: "Password salah" });
            }

            const user_id = user.id;
            const user_username = user.username

            const authToken = jwt.sign({ user_id, user_username }, this.server.env.JWT_SECRET, {
                expiresIn: '1h',
            });

            res.cookie("authToken", authToken, {
                httpOnly: true,
            });
            return res.status(200).json({ message: "Login sukses" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
}

export default AuthController;



