const Token = require("../models/Token");
const Trainer = require("../models/Trainer");
const User = require("../models/User");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const {
  attachCookiesToResponse,
  verifyToken,
  createTokenUser,
  sendVerificationEmail,
} = require("../utils");
const crypto = require("crypto");

//trainer
const registerTrainer = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    throw new CustomError.BadRequestError("All credientials must be provided");
  }
  const trainer = await Trainer.create({
    firstName,
    lastName,
    email,
    password,
  });

  res.status(StatusCodes.OK).json({ msg: "Trainer created", trainer });
};

const loginTrainer = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("All credientials must be provided");
  }
  const existingTrainer = await Trainer.findOne({ email });
  if (!existingTrainer) {
    throw new CustomError.NotFoundError(`No trainer with specified email`);
  }
  const isPasswordCorrect = await existingTrainer.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Wrong password");
  }
  const tokenUser = createTokenUser(existingTrainer);
  const exitingToken = await Token.findOne({ user: tokenUser.userId });

  if (exitingToken) {
    const refreshToken = exitingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    return res
      .status(StatusCodes.OK)
      .json({ msg: "Login Successfull", tokenUser });
  }

  const refreshToken = crypto.randomBytes(40).toString("hex");
  const ip = req.ip;
  const userAgent = req.headers["user-agent"];
  await Token.create({
    refreshToken,
    ip,
    userAgent,
    user: tokenUser.userId,
  });
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({ msg: "Login Successfull", tokenUser });
};

const trainerPasswordReset = async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    throw new CustomError.BadRequestError("Both credientials must be provided");
  }
  const existingTrainer = await Trainer.findOne({ email });
  if (!existingTrainer) {
    throw new CustomError.NotFoundError("No trainer with specified email");
  }
  existingTrainer.password = newPassword;
  await existingTrainer.save();
  res.status(StatusCodes.OK).json({ msg: "Password Updated" });
};
//user
const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    throw new CustomError.BadRequestError("All credientials must be specified");
  }
  const verificationToken = crypto.randomBytes(40).toString("hex");
  const origin = "http://localhost:5000";
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    verificationToken,
  });

  await sendVerificationEmail({
    name: firstName,
    email: email,
    verificationToken,
    origin,
  });
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Account created check your email for verification token" });
};
const verifyEmail = async (req, res) => {
  const { email, verificationToken } = req.body;
  if (!email || !verificationToken) {
    throw new CustomError.BadRequestError("All Credientials must be provided");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.NotFoundError("No user with specified email");
  }
  if (user.verificationToken !== verificationToken) {
    throw new CustomError.UnauthenticatedError("Verification Failed");
  }
  user.verificationToken = "";
  user.isVerified = true;
  await user.save({ validateModifiedOnly: true });
  res.status(StatusCodes.OK).json({ msg: "Account Verified" });
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("All credientials must be provided");
  }
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new CustomError.NotFoundError(`No user with specified email`);
  }

  const isPasswordCorrect = await existingUser.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Wrong password");
  }

  if (!existingUser.isVerified) {
    throw new CustomError.UnauthenticatedError(
      "Please verify your email address"
    );
  }

  const tokenUser = createTokenUser(existingUser);
  const exitingToken = await Token.findOne({ user: tokenUser.userId });

  if (exitingToken) {
    const refreshToken = exitingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    return res
      .status(StatusCodes.OK)
      .json({ msg: "Login Successfull", tokenUser });
  }

  const refreshToken = crypto.randomBytes(40).toString("hex");
  const ip = req.ip;
  const userAgent = req.headers["user-agent"];
  await Token.create({
    refreshToken,
    ip,
    userAgent,
    user: tokenUser.userId,
  });
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({ msg: "Login Successfull", tokenUser });
};

const forgotPassword = async (req, res) => {
  res.send("forgotPassword");
};
const resetPassword = async (req, res) => {
  res.send("reset password");
};

const logout = async (req, res) => {
  await Token.findOneAndDelete({ user: req.user.userId });
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  res.status(StatusCodes.OK).json({ msg: "Logout" });
};

module.exports = {
  registerTrainer,
  loginTrainer,
  trainerPasswordReset,
  registerUser,
  verifyEmail,
  loginUser,
  forgotPassword,
  resetPassword,
  logout,
};
