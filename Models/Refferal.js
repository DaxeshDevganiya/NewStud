const mongoose =require("mongoose") ;

const userSchema = new mongoose.Schema({
    refferalBy: {
        type: String,
        required: true,
      },
      acceptedBy:{
        type: String,
        required: true,
      }
});

module.exports = mongoose.model("Refferal", userSchema)
