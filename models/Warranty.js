const mongoose = require("mongoose")
const scanBill = require("../ocrService")

const schema = new mongoose.Schema({

product:String,
brand:String,
purchaseDate:Date,
expiryDate:Date,
email:String,
bill:String,
ocrText:String

})

module.exports = mongoose.model("Warranty",schema)