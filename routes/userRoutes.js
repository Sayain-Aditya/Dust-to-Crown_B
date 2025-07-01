const express = require("express");
const router = express.Router();
const {
  loginUser,
  getMe,
  registeruser,
  listAllusers,
  updateUser,
  deleteUser,
  getAllTeachers,
  updateTeacher,
  searchUsers,
  getTeachersByClassSubjectSection,
  listByRole,
} = require("../controllers/userController");

router.post("/login", loginUser);
router.post("/register", registeruser);
router.get("/all", listAllusers);
router.get("/search", searchUsers);
router.get("/teacher", getAllTeachers);
router.get("/list-role", listByRole);
router.get("/list-teacher", getTeachersByClassSubjectSection);
router.put("/teacher/:id", updateTeacher);
router.get("/me/:id", getMe);
router.route("/:id").put(updateUser).delete(deleteUser);

module.exports = router;
