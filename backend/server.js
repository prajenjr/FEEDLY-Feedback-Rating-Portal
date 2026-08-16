const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const feedbackRoutes = require("./routes/feedback");

const app = express();

// =========================
// MIDDLEWARE
// =========================

app.use(cors());
app.use(express.json());

// =========================
// ROUTES
// =========================

app.use("/api/auth", authRoutes);
app.use("/api/feedback", feedbackRoutes);

// =========================
// TEST ROUTE
// =========================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "FEEDLY Feedback Rating Portal Backend Running 🚀"
    });
});

// =========================
// MONGODB CONNECTION
// =========================

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("❌ MONGO_URI is missing in .env file");
    process.exit(1);
}

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("❌ MongoDB connection failed");
        console.error("Error:", error.message);
        process.exit(1);
    });

// =========================
// SERVER
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});