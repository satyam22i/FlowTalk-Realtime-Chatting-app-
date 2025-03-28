import express from 'express';
const router = express.Router();
import { signin, signup, logout } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { cheakAuth } from '../controllers/auth.controller.js';
import { updateProfile } from '../controllers/auth.controller.js';

router.post('/signin', signin);
router.post('/signup', signup);
router.post('/logout', logout);

router.put('/update-profile', protectRoute, updateProfile);

router.get("/cheak", protectRoute, cheakAuth)

export default router;