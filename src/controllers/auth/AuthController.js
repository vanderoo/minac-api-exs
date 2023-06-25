import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';

const register = async (req, res) => {
    try {
        const { username, password, conPass } = req.body;

        const checkUsername = await User.findOne({
            where: { username: username },
        });

        if (checkUsername) {
            return res.status(400).json({ message: "Username has used" });
        }
        if (password !== conPass) {
            return res.status(400).json({ message: "Password not identical" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username: username,
            password: hashedPassword,
        });
        return res
            .status(201)
            .json({ message: `account ${user.username} has been created` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Masuk ke akun pengguna
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({
            where: { username: username },
        });

        if (user === null) {
            return res.status(404).json({ message: "username tidak ditemukan" });
        }

        const verifyPass = await bcrypt.compare(password, user.password);
        if (!verifyPass) {
            return res.status(400).json({ message: "Password salah" });
        }

        const authToken = jwt.sign({ user }, process.env.JWT_SECRET, {
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

export {
    register,
    login,
};
