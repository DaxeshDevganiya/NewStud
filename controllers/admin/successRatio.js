const User=require("../../Models/UserModel");
const bcrypt=require("bcrypt");
const jwt = require('jsonwebtoken');
const AssignAssignments = require("../../Models/AssignAssignments");


module.exports=async(req,res)=>{
    try{
        var UserId=req.params.id;
        const UserRole= await User.findOne({_id:UserId});
        const user=await AssignAssignments.countDocuments({solveid:UserId});
        const success= await AssignAssignments.countDocuments({solveid:UserId,uploadedFiles:{ $ne: "-" }})
        
        // if(UserRole.role=="solver"){
        //      const latestWork= await AssignAssignments.findOne({solveid:UserId}).sort({ UploadDate: -1 });
        //      console.log(latestWork);
        //       return res.status(200).json({ "message":"success","status":200,"lastActivity":latestWork.UploadDate});
        // }else{
        //     const latestWork= await AssignAssignments.findOne({solveid:UserId}).sort({ StartDate: -1 });
        //     return res.status(200).json({ "message":"success","status":200,"lastActivity":latestWork.StartDate});
        // }
        
        // console.log(user);
        if(user){
            if(user){
                const average = user / success;
                
                res.status(200).json({ "message":"success","status":200,"Data":average});
            }else{
                res.status(401).json({"message":"failed to load","status":401});
            }
                
            }
            else{
                res.status(401).json({"message":"User not found","status":401});
               
            
        }
    }catch(error){
        res.status(500).json({"message":error,"status":500});
    }
}
