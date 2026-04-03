const Tesseract = require("tesseract.js")

async function scanBill(imagePath){

const result = await Tesseract.recognize(
imagePath,
"eng"
)

const text = result.data.text

return text

}

module.exports = scanBill