const User=require("../../Models/UserModel");
const bcrypt=require("bcrypt");
const jwt = require('jsonwebtoken');


module.exports=async(req,res)=>{
    try{
      
        const user=await User.find();
        
        // console.log(user);
        if(user){
            if(user){
                res.status(200).json({ "message":"success","status":200,"Data":user});
            }else{
                res.status(401).json({"message":"something wrong","status":401});
            }
                
            }
            else{
                res.status(401).json({"message":"User not found","status":401});
               
            
        }
    }catch(error){
        res.status(500).json({"message":error,"status":500});
    }
}
