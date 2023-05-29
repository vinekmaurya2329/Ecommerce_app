import express from 'express';
import {registerController ,loginController,testController, forgotPasswordController, updateProfileController} from '../controllers/authController.js';
import { requireSignIn,isAdmin } from '../middlewares/authMiddlewares.js';
//  router object ----
const router = express.Router();

// register method post request
router.post('/register',registerController)

// LOGIN || Post 
router.post('/login',loginController);
//  forget password || Post
router.post('/forgot-password',forgotPasswordController)

// test route 
router.get('/test',requireSignIn,isAdmin, testController); 

// proctected  user route
router.get('/user-auth',requireSignIn,(req,res)=>{
    res.status(200).send({
        ok:true
    });
});
//  procted admin route
router.get('/admin-auth',requireSignIn,(req,res)=>{
    res.status(200).send({
        ok:true
    });
});

// update profile

router.put('/profile',requireSignIn,updateProfileController);


export default router ; 