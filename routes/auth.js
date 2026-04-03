const express = require("express")
const router = express.Router()

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")

const User = require("../models/User")

const SECRET = "warranty_secret_key"

/* EMAIL TRANSPORT */

const transporter = nodemailer.createTransport({

    service: "gmail",
    
auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS
}
    
    })



/* ===================== */
/* SIGNUP */
/* ===================== */

router.post("/signup", async (req,res)=>{

try{

const {name,email,password} = req.body

const exist = await User.findOne({email})

if(exist){
return res.json({message:"User already exists"})
}

const hashed = await bcrypt.hash(password,10)

const user = new User({
name,
email,
password:hashed
})

await user.save()

res.json({message:"Account created successfully"})

}catch(err){

res.status(500).json({message:"Server error"})

}

})



/* ===================== */
/* LOGIN */
/* ===================== */

router.post("/login", async (req,res)=>{

try{

const {email,password} = req.body

const user = await User.findOne({email})

if(!user){
return res.json({message:"User not found"})
}

const valid = await bcrypt.compare(password,user.password)

if(!valid){
return res.json({message:"Invalid password"})
}

const token = jwt.sign(
{email:user.email},
SECRET,
{expiresIn:"1d"}
)

res.json({
message:"Login successful",
token,
email:user.email
})

}catch(err){

res.status(500).json({message:"Server error"})

}

})



/* ===================== */
/* SEND OTP */
/* ===================== */

router.post("/send-otp", async (req,res)=>{

    try{
    
    const {email} = req.body
    
    const user = await User.findOne({email})
    
    if(!user){
    return res.json({message:"Account not found"})
    }
    
    const otp = Math.floor(100000 + Math.random()*900000)
    
    user.otp = otp
    user.otpExpiry = Date.now() + 300000
    
    await user.save()
    
    await transporter.sendMail({
    
    from: '"Warranty App" <poovarasu1100465@gmail.com>',
    to: email,
    subject: "Password Reset OTP",
    
    html: `
    <h2>Password Reset Request</h2>
    <p>Your OTP is:</p>
    <h1 style="color:#7c3aed">${otp}</h1>
    <p>This OTP expires in 5 minutes.</p>
    `
    
    })
    
    res.json({message:"OTP sent successfully"})
    
    }catch(err){
    
    console.log(err)
    
    res.json({message:"Failed to send OTP"})
    
    }
    
    })



/* ===================== */
/* VERIFY OTP */
/* ===================== */

router.post("/verify-otp", async (req,res)=>{

const {email,otp} = req.body

const user = await User.findOne({email})

if(!user){
return res.json({message:"User not found"})
}

if(user.otp != otp){
return res.json({message:"Invalid OTP"})
}

if(Date.now() > user.otpExpiry){
return res.json({message:"OTP expired"})
}

res.json({message:"OTP verified"})

})



/* ===================== */
/* RESET PASSWORD */
/* ===================== */

router.post("/reset-password", async (req,res)=>{

const {email,password} = req.body

const user = await User.findOne({email})

if(!user){
return res.json({message:"User not found"})
}

const hashed = await bcrypt.hash(password,10)

user.password = hashed
user.otp = null
user.otpExpiry = null

await user.save()

res.json({message:"Password updated successfully"})

})



module.exports = router