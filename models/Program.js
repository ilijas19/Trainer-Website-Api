const mongoose = require("mongoose");

const ProgramSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide program name"],
  },
  price: {
    type: Number,
    required: [true, "Please provide price value"],
  },
  length: {
    type: Number,
    required: [true, "Please provide length value"],
  },
  expirienceLevel: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    required: [true, "Please provide expirience level"],
  },
  type: {
    type: String,
    enum: ["gym-workout", "home-workout", "running-workout"],
    required: [true, "Please provide workout type"],
  },
  targetAudience: {
    type: String,
    enum: ["male", "female"],
    required: [true, "Please provide target audience"],
  },
  pdfLink: {
    type: String,
    required: [true, "Please provide pdf link"],
    default: "www.pdf.com",
  },
});

module.exports = mongoose.model("Program", ProgramSchema);
