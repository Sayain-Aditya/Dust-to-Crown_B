const express = require("express");
const Rfid = require("../models/Rfid");
const User = require("../models/userModel"); 
const teacherAttendence = require("../models/teacherAttendence"); 

// scanRFIDandMarkAttendance removed: logic now handled in checkRFID
exports.checkRFID = async (req, res) => {
  const { rfid } = req.body;
  if (!rfid) {
    return res.status(400).json({ message: "RFID is required" });
  }
  try {
    // Get current time in Indian Standard Time (IST) using toLocaleString with timeZone
    const checkTime = new Date();
    const istTimeString = checkTime.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });
    const user = await User.findOne({ rfid });
    if (!user) {
      return res.status(404).json({ message: "RFID not found" });
    }
    // If user is a teacher, mark attendance
    let attendanceData = null;
    if (user.role === "Teacher") {
      let attendance = await teacherAttendence.findOne({
        teacher: user._id,
      });
      if (!attendance) {
        attendance = new teacherAttendence({
          teacher: user._id,
          name: user.name,
          email: user.email,
          status: "Present",
        });
        await attendance.save();
      }
      attendanceData = attendance;
    }
    return res.status(200).json({
      message: `Welcome, ${user.name}!`,
      user: {
        name: user.name,
        email: user.email,
        rfid: user.rfid,
        role: user.role,
        checkTime: istTimeString,
      },
      attendance: attendanceData,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
