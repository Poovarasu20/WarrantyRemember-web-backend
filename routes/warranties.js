const express = require("express")
const router = express.Router()

const Warranty = require("../models/Warranty")

const multer = require("multer")

const storage = multer.diskStorage({

destination:"uploads/",

filename:(req,file,cb)=>{
cb(null,Date.now()+"-"+file.originalname)
}

})

const upload = multer({storage})


/* ADD WARRANTY */

router.post("/add", upload.single("bill"), async(req,res)=>{

    let text=""
    
    if(req.file){
    text = await scanBill("uploads/"+req.file.filename)
    }
    
    const data = new Warranty({
    
    product:req.body.product,
    brand:req.body.brand,
    purchaseDate:req.body.purchaseDate,
    expiryDate:req.body.expiryDate,
    email:req.body.email,
    bill:req.file ? req.file.filename : null,
    ocrText:text
    
    })
    
    await data.save()
    
    res.json({message:"Saved",ocr:text})
    
    })


/* GET USER WARRANTIES */

router.get("/all/:email", async (req,res)=>{

    const data = await Warranty.find({email:req.params.email})
    
    res.json(data)
    
    })

/* DELETE WARRANTY */

router.delete("/:id", async (req,res)=>{

await Warranty.findByIdAndDelete(req.params.id)

res.json({message:"deleted"})

})

/*update*/
async function deleteWarranty(id){

    if(!confirm("Delete this warranty?")) return
    
    await fetch(API + "/" + id, {
    method:"DELETE"
    })
    
    loadData()
    
    }
    router.put("/update/:id", async(req,res)=>{

        const {product,brand,purchaseDate,expiryDate} = req.body
        
        await Warranty.findByIdAndUpdate(req.params.id,{
        product,
        brand,
        purchaseDate,
        expiryDate
        })
        
        res.json({message:"updated"})
        
        })


module.exports = router