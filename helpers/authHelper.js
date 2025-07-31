import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};



// authHelper.js
// authHelper.js

// let otpStore = {}; // For demo, use DB/Redis in production

// export const generateOTP = (email) => {
//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
//   otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };
//   return otp;
// };

// // export const verifyOTP = (email, inputOtp) => {
// //   const record = otpStore[email];
// //   if (!record) return false;
// //   const isValid = record.otp === inputOtp && Date.now() < record.expires;
// //   if (isValid) delete otpStore[email];
// //   return isValid;
// // };
// exports.verifyOTP = (email, inputOtp) => {
//   const record = otpStore[email];
//   if (!record) return false; // If no OTP exists for this email
//   const isValid = record.otp === inputOtp && Date.now() < record.expires; // Check if OTP matches and is not expired
//   if (isValid) delete otpStore[email]; // Remove OTP after verification
//   return isValid;
// };


// let otpStore = {};

// function generateOTP(email) {
//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
//   otpStore[email] = {
//     otp,
//     expires: Date.now() + 10 * 60 * 1000, // OTP valid for 10 minutes
//   };
//   return otp;
// }

// function verifyOTP(email, inputOtp) {
//   const record = otpStore[email];
//   if (!record || Date.now() > record.expires) return false;
//   if (record.otp !== inputOtp) return false;
//   delete otpStore[email];
//   return true;
// }

// export { generateOTP, verifyOTP };