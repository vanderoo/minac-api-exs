import express from 'express';
import { login, register } from '../controllers/auth/AuthController.js';

const authRoutes = express.Router();

authRoutes.post('/login', login);
authRoutes.post('/register', register);

const routes = [authRoutes];

export default routes;
