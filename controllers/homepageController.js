const asyncHandler = require("express-async-handler");
const cloudinary = require("cloudinary").v2;

const Student = require("../models/studentModel");
const User = require("../models/userModel");

const dataCount = asyncHandler(async (req, res) => {
  const role = req.query.role;

  if (!role) {
    return res.status(400).json({ message: "Provide the role field!", success: false });
  }

  const studentClass = req.query.studentClass;
  const studentDivision = req.query.studentDivision;

  let allStudents = 0;
  let allTeachers = 0;
  let allAdmins = 0;
  let allCoordinators = 0;

  if (role === "Admin") {
    allStudents = await Student.countDocuments();
    allTeachers = await User.countDocuments({ role: "Teacher" });
    allAdmins = await User.countDocuments({ role: "Admin" });

    const seniorCoordinators = await User.countDocuments({ role: "Senior Coordinator" });
    const juniorCoordinators = await User.countDocuments({ role: "Junior Coordinator" });

    allCoordinators = seniorCoordinators + juniorCoordinators;
  } else if (role === "Teacher") {
    allStudents = await Student.countDocuments({
      studentClass,
      studentDivision,
    });
  }

  if (allStudents === 0) {
    return res.json({ message: "No Student Found!", success: false });
  }

  res.json({
    students: allStudents,
    teachers: allTeachers,
    admins: allAdmins,
    coordinators: allCoordinators,
    success: true,
  });
});


module.exports = { dataCount };
