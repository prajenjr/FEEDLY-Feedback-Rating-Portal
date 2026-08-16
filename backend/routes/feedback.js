const express = require("express");
const Feedback = require("../models/Feedback");

const router = express.Router();

// POST feedback
router.post("/", async (req, res) => {
  try {
    const { studentName, studentEmail, subject, rating, comment } = req.body;

    const feedback = await Feedback.create({
      studentName,
      studentEmail,
      subject,
      rating,
      comment
    });

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback
    });
  } catch (error) {
    res.status(500).json({
      message: "Error submitting feedback",
      error: error.message
    });
  }
});

// GET all feedback
router.get("/", async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });

    res.json(feedback);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching feedback",
      error: error.message
    });
  }
});

module.exports = router;