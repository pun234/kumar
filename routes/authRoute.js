import express from "express";
// import { testControl,Login, Register, updateProfileController, getOrdersController, getAllOrdersController, orderStatusController,forgetPasswordController } from '../controllers/authController.js';
import { CompulsorySign,Adminsign } from "../middlewares/authMiddleware.js";
import{ forgetPasswordcontrol, getAllOrdersController, getOrdersController, Login, orderStatusController, Register, testControl, updateProfileController} from "../controllers/authController.js"
const router=express.Router();


// router.post(`./register`, registerController); wrong syntax
// register path to send in postman/
router.post("/register", Register);


// login path to send in postman
router.post("/login", Login);


// Forget password ke liyw
router.post("/forget-password",forgetPasswordcontrol);
//test int mid b/w as many midlle ware store to tokken value
router.get("/test",CompulsorySign,testControl);

// router.get("/test",Adminsign,testControl);
router.get("/user-auth",CompulsorySign,(req,res)=>{
    res.status(200).send({ok:true});
});

// admin route
    router.get("/admin-auth",CompulsorySign,Adminsign,(req,res)=>{
        res.status(200).send({ok:true});
}) ;
router.put("/profile", CompulsorySign,updateProfileController);

router.get("/orders", CompulsorySign, getOrdersController);


router.get("/all-orders", CompulsorySign, getAllOrdersController);
router.put("/order-Status/:orderId", CompulsorySign,orderStatusController);

// router.post("/send-otp", sendOtpController);
// router.post("/register-otp", registerWithOtp);
// router.post("/forgot-password-otp", forgetPasswordOtp);

// router.post("/verify-otp", verifyOtpController);  

export default router;