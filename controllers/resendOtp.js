const User=require("../Models/UserModel");
const bcrypt=require("bcrypt");
const jwt = require('jsonwebtoken');

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
require('dotenv').config;
module.exports=async(req,res)=>{
    try{
       const{email}=req.body;
        const user=await User.findOne( {  email  } );
        const oldotp="";
        const attempt=user.loginAttempt;
        const today = new Date();
    const loginDate = user.loginTime;
        const min = 100000; 
                    const max = 999999; 
                    const otp= Math.floor(Math.random() * (max - min + 1)) + min;
        // console.log(user);
        const isSameDay = loginDate &&
        loginDate.getUTCFullYear() === today.getUTCFullYear() &&
        loginDate.getUTCMonth() === today.getUTCMonth() &&
        loginDate.getUTCDate() === today.getUTCDate();
        if (isSameDay && user.loginAttempt >= 3) {
            return res.status(429).json({ "message": "Maximum OTP resend attempts reached for today", "status": 429 });
          }  
        if(isSameDay){
            
            user.loginOtp=oldotp;
            user.loginOtp=otp;
            user.loginAttempt=attempt+1;
                user.save();
                const msg = {
                    to:user['email'],
                    from: "Otp@my7wish.com", 
                    subject: 'Sending with SendGrid is Fun',
                    text: 'Assignment Added in your portal',
                    html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                    <div style="margin:50px auto;width:70%;padding:20px 0">
                      <div style="border-bottom:1px solid #eee">
                        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Task System</a>
                      </div>
                      <p style="font-size:1.1em">Hi, ${user['firstname']}</p>
                      <p>Thank you for choosing Task System. Use the following OTP to complete your Sign Login procedures. OTP is valid for 5 minutes</p>
                      <h2 style="background: #2196F3;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
                      <p style="font-size:0.9em;">Regards,<br />Task System</p>
                      <hr style="border:none;border-top:1px solid #eee" />
                      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                        <p>Task System Inc</p>
                      
                      </div>
                    </div>
                  </div>`,
                  }
                  sgMail
                    .send(msg)
                    .then(() => {
                      console.log('Email sent')
                    })
                    .catch((error) => {
                      console.error(error)
                    })
                  
                            res.status(200).json({ "message":"Otp sent Successfully","status":200,"otp":otp,"user":user });
                          
            }
            else{
                user.loginAttempt = 0; // Reset attempts for a new day
                user.loginTime = today;
                user.save();
               
            
        }
    }catch(error){
        res.status(500).json({"message":error,"status":500});
    }
}
