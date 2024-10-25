const express = require("express");
const router = express.Router();

const {
  authenticateUser,
  authorizePermission,
} = require("../middlewares/authentication");

const {
  addProgram,
  giveAccessToProgram,
  getAllPrograms,
  getSingleProgram,
  editProgram,
  deleteProgram,
  getMyPrograms,
} = require("../controllers/programController");

router
  .route("/")
  .post(authenticateUser, authorizePermission("admin"), addProgram)
  .get(authenticateUser, getAllPrograms);

router.route("/myPrograms").get(authenticateUser, getMyPrograms);

router
  .route("/giveAccess")
  .post(authenticateUser, authorizePermission("trainer"), giveAccessToProgram);

router
  .route("/:id")
  .get(authenticateUser, getSingleProgram)
  .patch(authenticateUser, authorizePermission("admin"), editProgram)
  .delete(authenticateUser, authorizePermission("admin"), deleteProgram);

module.exports = router;
