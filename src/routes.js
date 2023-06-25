import express from 'express';
import authRoutes from './routes/authRoutes.js';

const routes = express.Router();

authRoutes.forEach((route) => {
    routes.use('/auth', route);
});

export default routes;
