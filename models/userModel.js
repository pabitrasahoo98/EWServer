const mongoose =require("mongoose");
const validator=require("validator");
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const crypto=require("crypto")

const userSchema= new mongoose.Schema(
    {name:{
        type:String,
        required:[true,"please enter your name"],
        maxLength:[30,"name can not exceed 30 characters"],
        minLength:[4,"name should have more than 4 characters"]
    },
    email:{
        type:String,
        required:[true,"please enter your email"],
        unique:true,
        validate:[validator.isEmail,"please enter a valid email"]

    },
    password:{
        type:String,
        required:[true,"please enter valid password"],
        minLength:[8,"password should be greater than 8 characters"],
        select:false
    },
    mobileNo:{
        type:String,
        required:[true,"please enter valid mobile no"],
        minLength:[10,"Enter correct Phone number"],
        validate:[validator.isMobilePhone,"please enter a valid Phone Number"],
        
    },
   role:{
        type:String,
        default:"user"
    },
    
  resetPasswordOtp: Number,
  resetPasswordOtpExpiry: Date,

  verified: {
    type: Boolean,
    default: false,
  },

  otp: Number,
  otp_expiry: Date,
  


});
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
  
    this.password = await bcrypt.hash(this.password, 10);
  });

  //register token
  userSchema.methods.getJWTToken1=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn:'5m',})
}

//jwt 
userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE,})
}
//compare password
userSchema.methods.comparePassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

//generating password reset token
userSchema.methods.getResetPasswordToken=function(){
    //generating token
    const resetToken=crypto.randomBytes(20).toString("hex");
    //hashing and add to user schema
    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpiry=Date.now()+15*60*1000;
    return resetToken;
}

userSchema.index({ otp_expiry: 1 }, { expireAfterSeconds: 0 });

module.exports=mongoose.model("User",userSchema)