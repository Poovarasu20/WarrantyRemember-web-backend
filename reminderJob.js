const Warranty = require("./models/Warranty")
const sendEmail = require("./emailService")

async function checkExpiry(){

const today = new Date()

const future = new Date()

future.setDate(today.getDate()+14)

const warranties = await Warranty.find({

expiryDate:{
$lte:future,
$gte:today
}

})

warranties.forEach(w=>{

sendEmail(

w.email,

"Warranty Expiring Soon",

`Your ${w.product} warranty will expire on ${w.expiryDate}`

)

})

}

module.exports = checkExpiry