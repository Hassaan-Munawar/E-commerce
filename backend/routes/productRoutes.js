import express from 'express';
import getProducts from '../controllers/productController.js';
import { authenticateUser } from '../middleware/authentication.js';

const router = express.Router();

router.get('/', authenticateUser, getProducts);


export default router;