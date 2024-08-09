const Assignment=require("../Models/AssignmentModel");
const AssignAssignments=require("../Models/AssignAssignments");
const User=require("../Models/UserModel");
const multer = require('multer');
const jwt = require('jsonwebtoken');
const moment = require('moment');

module.exports=async(req,res)=>{
    
    try{

        // const del=await User.findOne({email:"aproject7799@gmail.com"})
        // if (del) {
        //     await del.deleteOne();
        //     console.log('Document deleted successfully');
        // } else {
        //     console.log('Document not found');
        // }
        
       
            const solver= await User.find({role:"solver"});
            const studnet= await User.find({role:"student"});
            const assignment= await Assignment.find();
            const user= await User.find();
            const numOfSolver=solver.length;
            const numOfStudent=studnet.length;
            const numOfAssignments=assignment.length;
            const sum = await AssignAssignments.aggregate([
                {
                  $group: {
                    _id: null, // Grouping by null to sum all documents
                    totalCompanyPrice: { $sum: "$companyPrice" }, // Summing up the companyPrice field
                  },
                },
              ]);
              const income = await AssignAssignments.aggregate([
                {
                  $group: {
                    _id: null, // Grouping by null to sum all documents
                    totalCompanyPrice: { $sum: "$price" }, // Summing up the companyPrice field
                  },
                },
              ]);
              
            const numOfUser= user.length;
            res.status(200).json({"solver":numOfSolver,"student":numOfStudent,"tasks":numOfAssignments,"user":numOfUser,"profit":sum[0]?.totalCompanyPrice || 0,"income":income[0]?.totalCompanyPrice || 0,"status":200})
       
           
           
        
    
    }catch(error){
        console.log(error);
        res.status(500).json({"message":error,"status":500});
    }
}



// async function updateQueue(userId) {
//     try {
//         // Find and update the user's 'queue' field
//         await AssignAssignments.findOneAndUpdate({ queue: userId });
//     } catch (error) {
//         console.log("Error updating queue:", error);
//     }
// }