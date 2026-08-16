const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true
    },

    studentEmail: {
      type: String,
      required: true
    },

    subject: {
      type: String,
      required: true
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },

    comment: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Feedback", FeedbackSchema);