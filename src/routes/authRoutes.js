import express from "express";

import {
    register,
    login,
    getProfile,
    updateProfile
} 
from "../controllers/authController.js";


import protect from "../middleware/authMiddleware.js";
import { registerValidator, loginValidator, updateProfileValidator } from "../validators/authValidator.js";
import handleValidation from "../validators/handleValidation.js";


const router = express.Router();





router.post(
    "/register",
    registerValidator, 
    handleValidation,
    register
    
);


router.post(
    "/login",
    loginValidator,
     handleValidation,
    login
);





router.get(
    "/profile",
    protect,
    getProfile
);



router.put(
    "/profile",
    protect,
    updateProfileValidator,
    handleValidation, 
    updateProfile
);



export default router;