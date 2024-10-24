const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const TrainerSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["employee", "admin"],
    default: "employee",
  },
  isVerified: {
    type: Boolean,
    default: true,
  },
  firstName: {
    type: String,
    required: [true, "Please provide first name"],
  },
  lastName: {
    type: String,
    required: [true, "Please provide last name"],
  },
  email: {
    type: String,
    validate: {
      validator: function (email) {
        return validator.isEmail(email);
      },
      message: "Please Provide Valid Email",
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please Provide Password"],
  },
  images: {
    type: [String],
  },
  bio: {
    type: String,
    default: "No additional biography",
  },
  clients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  programs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
    },
  ],
});

TrainerSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

TrainerSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Trainer", TrainerSchema);
