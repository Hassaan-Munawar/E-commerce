import express from 'express';
import getUser from '../controllers/userController.js';
import { authenticateUser } from '../middleware/authentication.js';

const router = express.Router();

router.get('/', authenticateUser, getUser);


export default router;