const Program = require("../models/Program");
const User = require("../models/User");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");

const addProgram = async (req, res) => {
  const program = await Program.create(req.body);

  res.status(StatusCodes.CREATED).json({ msg: "program created", program });
};

const getAllPrograms = async (req, res) => {
  const queryObject = {};
  const programs = await Program.find(queryObject).select({ pdfLink: 0 });
  res.status(StatusCodes.OK).json({ nbHits: programs.length, programs });
};

const getSingleProgram = async (req, res) => {
  const { id: programId } = req.params;
  if (!programId) {
    throw new CustomError.BadRequestError("Program id needs to be specified");
  }
  const program = await Program.findOne({ _id: programId }).select({
    pdfLink: 0,
  });
  if (!program) {
    throw new CustomError.NotFoundError(`No program wiht id: ${programId}`);
  }
  res.status(StatusCodes.OK).json({ program });
};

const editProgram = async (req, res) => {
  const { id: programId } = req.params;
  if (!programId) {
    throw new CustomError.BadRequestError("Program id needs to be specified");
  }
  const program = await Program.findOneAndUpdate({ _id: programId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!program) {
    throw new CustomError.NotFoundError(`No program wiht id: ${programId}`);
  }
  res.status(StatusCodes.OK).json({ program });
};

const deleteProgram = async (req, res) => {
  const { id: programId } = req.params;
  if (!programId) {
    throw new CustomError.BadRequestError("Program id needs to be specified");
  }
  const program = await Program.findOneAndDelete({ _id: programId });
  if (!program) {
    throw new CustomError.NotFoundError(`No program wiht id: ${programId}`);
  }
  res.status(StatusCodes.OK).json({ msg: "Program deleted" });
};

const giveAccessToProgram = async (req, res) => {
  const { programId, userId } = req.body;
  if (!programId || !userId) {
    throw new CustomError.BadRequestError("all credientials must be provided");
  }
  const program = await Program.findOne({ _id: programId });
  if (!program) {
    throw new CustomError.NotFoundError(`No program with id:${programId}`);
  }
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id: ${userId}`);
  }
  if (user.PurchasedPrograms.includes(programId)) {
    throw new CustomError.BadRequestError(
      "User has access over this program already"
    );
  }
  user.PurchasedPrograms.push(programId);
  await user.save({ validateModifiedOnly: true });
  res.status(StatusCodes.OK).json({ msg: "access given" });
};

const getMyPrograms = async (req, res) => {
  const currentUser = await User.findOne({ _id: req.user.userId }).populate(
    "PurchasedPrograms"
  );
  res
    .status(StatusCodes.OK)
    .json({ myPrograms: currentUser.PurchasedPrograms });
};

module.exports = {
  addProgram,
  giveAccessToProgram,
  getAllPrograms,
  getSingleProgram,
  editProgram,
  deleteProgram,
  getMyPrograms,
};
