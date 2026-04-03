const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({

service:"gmail",

auth:{
user:"yourgmail@gmail.com",
pass:"your_app_password"
}

})

function sendOTP(email,otp){

transporter.sendMail({

from:"Warranty App",
to:email,
subject:"Password Reset OTP",

html:`
<h2>Password Reset</h2>
<p>Your OTP is:</p>
<h1>${otp}</h1>
<p>This OTP expires in 5 minutes</p>
`

})

}

module.exports = sendOTP