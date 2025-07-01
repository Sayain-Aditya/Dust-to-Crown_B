const express = require("express");
const Rfid = require("../models/Rfid");
const User = require("../models/userModel"); 
const teacherAttendence = require("../models/teacherAttendence"); 

exports.scanRFIDandMarkAttendance = async (req, res) => {
  try {
    const { rfid } = req.body;

    if (!rfid) return res.status(400).json({ error: "RFID is required" });

    const teacher = await User.findOne({ rfid, role: "Teacher" });
    if (!teacher) {
      return res.status(404).json({ message: "RFID not found or not a teacher" });
    }
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    let attendance = await teacherAttendence.findOne({
      teacher: teacher._id,
      date: { $gte: startOfDay, $lte: endOfDay },
    });
    if (attendance) {
      return res.status(200).json({
        message: `Welcome back, ${teacher.name}! You are already marked Present.`,
        data: attendance,
      });
    }
    attendance = new teacherAttendence({
      teacher: teacher._id,
      name: teacher.name,
      email: teacher.email,
      status: "Present",
      date: new Date(),
    });
    const saved = await attendance.save();
    res.status(201).json({
      message: `Welcome, ${teacher.name}! You have been marked Present.`,
      data: saved,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
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

    if (user) {
      return res.status(200).json({
        message: `Welcome, ${user.name}!`,
        user: {
          name: user.name,
          email: user.email,
          rfid: user.rfid,
          role: user.role,
          checkTime: istTimeString,
        },
      });
    } else {
      return res.status(404).json({ message: "RFID not found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
