const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
  role: {
    type: String,
    default: "user",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
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
  bio: {
    type: String,
    default: "No additional biography",
  },
  trainer: {
    type: mongoose.Types.ObjectId,
    ref: "Trainer",
  },
  PurchasedPrograms: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Program",
    },
  ],
  PersonalProgram: {
    type: mongoose.Types.ObjectId,
    ref: "Program",
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
