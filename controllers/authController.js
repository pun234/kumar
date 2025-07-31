import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";
import orderModel from "../models/orderModel.js";

export const Register = async (req, res) => {
  try {
    const {name, email, password, phone, address,answer} = req.body;
    //validations: 

    if (!name) {
      return res.send({ error: "Enter your name" });
    }
    if (!email) {
      return res.send({ message: "Enter your valid email" });
    }
    if (!password) {
      return res.send({ message: "Enter your Password" });
    }
    if (!phone) {
      return res.send({ message: "Enter your mobile number" });
    }
    if (!address) {
      return res.send({ message: "Enter your Address" });
    }
    if (!answer) {
      return res.send({ message: "Enter your Address" });
    }
    //check user 
    const existUser = await userModel.findOne({ email });
    //exisiting user
    if (existUser) {
      return res.status(200).send({
        success: false,
        message: "Already Registered Sign in",
      });
    }

    //register user
    const hashedPassword = await hashPassword(password);
    //save
    // same as auth controller name ,name,email,phone,address,password: hashedPassword if 
    // thing diff then it not work
    const user = await new userModel({name,email,phone,address,password: hashedPassword,answer}).save();

    res.status(201).send({
      success: true,
      message: "Sign in Suceesfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "!!Error!!",
      error,
    });
  }
};









// POST Login
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    //check user from helper file 
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        adddress: user.address,
        role:user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};
// forget password 

export const forgetPasswordcontrol=async (req,res) =>{
  try{
    const{email,answer,newPassword}=req.body
    if(!email){
      res.status(400).send({message:'email is required'})
    }
    if(!answer){
      res.status(400).send({message:'answer  is required'})
    }
    if(!newPassword){
      res.status(400).send({message:'New Password is required'})
    }

    // to check email and addres
    const user=await userModel.findOne({email,answer})

    // validation
    if(!user){
      return res.status(404).send({
        success:false,
        message:"wrong Email or answer"
      })
    }
    const hashed =await hashPassword(newPassword)
    await userModel.findByIdAndUpdate(user._id,{password:hashed});
    res.status(200).send({
      success: true, 
      message: "Password Reset Successfully" 
    })
  }
  catch(error){
    console.log(error)
    res.status(500).send({
      success:false,
      message:"wrong"
    })
  }

};
//test controller
export const testControl = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
};
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};
export const  getAllOrdersController  = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};



// import userModel from "../models/userModel.js";
// import { comparePassword, hashPassword } from "../helpers/authHelper.js";
// import { generateOTP, verifyOTP } from '../helpers/authHelper.js';
// import JWT from "jsonwebtoken";
// import orderModel from "../models/orderModel.js";

// // OTP logic


// // Email OTP sender
// import nodemailer from "nodemailer";
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "your_email@gmail.com",
//     pass: "your_app_password",
//   },
// });

// // ✅ Send OTP
// export const sendOtpController = async (req, res) => {
//   const { email } = req.body;
//   try {
//     const otp = generateOTP(email);

//     // Email config
//     await transporter.sendMail({
//       from: '"Your App Name" <your_email@gmail.com>', // sender
//       to: email,
//       subject: "Your OTP Code",
//       text: `Your OTP is ${otp}`,
//     });

//     res.status(200).json({ success: true, message: "OTP sent to your email" });
//   } catch (error) {
//     console.error("OTP email send error:", error);
//     res.status(500).json({ success: false, message: "Failed to send OTP" });
//   }
// };



// // ✅ Register (via OTP)
// export const registerWithOtp = async (req, res) => {
//   try {
//     const { name, email, password, phone, address, otp } = req.body;

//     if (!verifyOTP(email, otp)) {
//       return res.status(400).send({ success: false, message: "Invalid or expired OTP" });
//     }

//     const existUser = await userModel.findOne({ email });
//     if (existUser) {
//       return res.status(200).send({ success: false, message: "Already Registered Sign in" });
//     }

//     const hashedPassword = await hashPassword(password);
//     const user = await new userModel({
//       name,
//       email,
//       phone,
//       address,
//       password: hashedPassword,
//     }).save();

//     res.status(201).send({
//       success: true,
//       message: "Registered Successfully via OTP",
//       user,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ success: false, message: "Error in registration", error });
//   }
// };

// // ✅ Existing Registration with Security Question (unchanged)
// export const Register = async (req, res) => {
//   try {
//     const { name, email, password, phone, address, answer } = req.body;
//     if (!name || !email || !password || !phone || !address || !answer) {
//       return res.status(400).send({ message: "All fields are required" });
//     }

//     const existUser = await userModel.findOne({ email });
//     if (existUser) {
//       return res.status(200).send({
//         success: false,
//         message: "Already Registered Sign in",
//       });
//     }

//     const hashedPassword = await hashPassword(password);
//     const user = await new userModel({
//       name,
//       email,
//       phone,
//       address,
//       password: hashedPassword,
//       answer,
//     }).save();

//     res.status(201).send({
//       success: true,
//       message: "Sign in Successfully",
//       user,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ success: false, message: "!!Error!!", error });
//   }
// };

// // ✅ Login (unchanged)
// export const Login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(404).send({ success: false, message: "Invalid email or password" });
//     }

//     const user = await userModel.findOne({ email });
//     if (!user) {
//       return res.status(404).send({ success: false, message: "Email is not registered" });
//     }

//     const match = await comparePassword(password, user.password);
//     if (!match) {
//       return res.status(200).send({ success: false, message: "Invalid Password" });
//     }

//     const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

//     res.status(200).send({
//       success: true,
//       message: "Login successfully",
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         address: user.address,
//         role: user.role,
//       },
//       token,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ success: false, message: "Error in Login", error });
//   }
// };

// // ✅ Forget Password via OTP
// export const forgetPasswordOtp = async (req, res) => {
//   try {
//     const { email, newPassword, otp } = req.body;

//     if (!verifyOTP(email, otp)) {
//       return res.status(400).send({ success: false, message: "Invalid or expired OTP" });
//     }

//     const user = await userModel.findOne({ email });
//     if (!user) {
//       return res.status(404).send({ success: false, message: "User not found" });
//     }

//     const hashed = await hashPassword(newPassword);
//     await userModel.findByIdAndUpdate(user._id, { password: hashed });

//     res.status(200).send({ success: true, message: "Password Reset Successfully with OTP" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ success: false, message: "Error resetting password", error });
//   }
// };

// // ✅ Existing Forget Password via security question (unchanged)
// export const forgetPasswordcontrol = async (req, res) => {
//   try {
//     const { email, answer, newPassword } = req.body;
//     if (!email || !answer || !newPassword) {
//       return res.status(400).send({ message: "All fields are required" });
//     }

//     const user = await userModel.findOne({ email, answer });
//     if (!user) {
//       return res.status(404).send({ success: false, message: "Wrong Email or Answer" });
//     }

//     const hashed = await hashPassword(newPassword);
//     await userModel.findByIdAndUpdate(user._id, { password: hashed });

//     res.status(200).send({ success: true, message: "Password Reset Successfully" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ success: false, message: "Something went wrong", error });
//   }
// };

// // ✅ Remaining Controllers (unchanged)
// export const testControl = (req, res) => {
//   try {
//     res.send("Protected Routes");
//   } catch (error) {
//     console.log(error);
//     res.send({ error });
//   }
// };

// export const updateProfileController = async (req, res) => {
//   try {
//     const { name, email, password, address, phone } = req.body;
//     const user = await userModel.findById(req.user._id);

//     if (password && password.length < 6) {
//       return res.json({ error: "Password must be at least 6 characters" });
//     }

//     const hashedPassword = password ? await hashPassword(password) : undefined;
//     const updatedUser = await userModel.findByIdAndUpdate(
//       req.user._id,
//       {
//         name: name || user.name,
//         password: hashedPassword || user.password,
//         phone: phone || user.phone,
//         address: address || user.address,
//       },
//       { new: true }
//     );

//     res.status(200).send({
//       success: true,
//       message: "Profile Updated Successfully",
//       updatedUser,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(400).send({ success: false, message: "Error updating profile", error });
//   }
// };

// export const getOrdersController = async (req, res) => {
//   try {
//     const orders = await orderModel
//       .find({ buyer: req.user._id })
//       .populate("products", "-photo")
//       .populate("buyer", "name");
//     res.json(orders);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ success: false, message: "Error getting orders", error });
//   }
// };

// export const getAllOrdersController = async (req, res) => {
//   try {
//     const orders = await orderModel
//       .find({})
//       .populate("products", "-photo")
//       .populate("buyer", "name")
//       .sort({ createdAt: "-1" });
//     res.json(orders);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ success: false, message: "Error getting orders", error });
//   }
// };

// export const orderStatusController = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status } = req.body;

//     const orders = await orderModel.findByIdAndUpdate(
//       orderId,
//       { status },
//       { new: true }
//     );
//     res.json(orders);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ success: false, message: "Error updating order", error });
//   }
// };

// // Add the OTP verification endpoint
// export const verifyOtpController = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     if (!verifyOTP(email, otp)) {
//       return res.status(400).send({ success: false, message: "Invalid or expired OTP" });
//     }

//     res.status(200).send({ success: true, message: "OTP verified" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ success: false, message: "OTP verification failed", error });
//   }
// };
