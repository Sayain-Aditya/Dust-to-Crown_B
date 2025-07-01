const express = require("express");
const router = express.Router();
const {
  registerStudent,
  getSingleStudent,
  listAllStudents,
  updateStudent,
  deleteStudent,
  filterStudents,
  lastRollNumber,
  lastAdmissionNumber,
  searchStudents,
  fetchStudentsData,
  upgradeStudentClass,filterStudentsByClass,updateStudentStatus
} = require("../controllers/studentController");

router.post("/register", registerStudent);
router.put("/status/:id", updateStudentStatus);
router.get("/all", listAllStudents);
router.get("/search", searchStudents);
router.get("/upgrade", upgradeStudentClass);
router.get("/fetch", fetchStudentsData);
router.get("/last-roll", lastRollNumber);
router.get("/last-admission", lastAdmissionNumber);
router.get("/filter", filterStudents);
router.get("/filter-by-class", filterStudentsByClass);
router
  .route("/:id")
  .get(getSingleStudent)

  .put(updateStudent)
  .delete(deleteStudent);

module.exports = router;
