import express from 'express';
import { login, logout, signup } from '../controllers/auth.controller.js';

const router = express.Router();
// post -> send data
// import signup , login , logout functions from auth.controller.js
router.post("/signup" , signup)
router.post("/login" , login )
router.post("/logout" , logout )


export default router;