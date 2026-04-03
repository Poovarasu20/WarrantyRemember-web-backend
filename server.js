const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cron = require("node-cron")
require("dotenv").config()

const app = express()

/* ================= MIDDLEWARE ================= */
app.use(cors({
  origin: "https://warrantyremember.netlify.app",
  credentials: true
}))
app.use(express.json())

/* ================= DATABASE ================= */
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ DB Error:", err.message))

/* ================= ROUTES ================= */
const warrantyRoutes = require("./routes/warranties")
const authRoutes = require("./routes/auth")
const ocrRoutes = require("./ocrService")

app.use("/api/warranties", warrantyRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/ocr", ocrRoutes)

/* ================= CRON JOB ================= */
const checkExpiry = require("./reminderJob")

cron.schedule("0 9 * * *", () => {
    console.log("⏰ Running expiry check...")
    checkExpiry()
})

/* ================= TEST ROUTE ================= */
app.get("/", (req, res) => {
    res.send("🚀 Warranty API running")
})

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
})