import express from 'express';
import { editUser, getUser } from '../controllers/userController.js';

const router = express.Router();

router.post("/", getUser);
router.put("/", editUser);


export default router;