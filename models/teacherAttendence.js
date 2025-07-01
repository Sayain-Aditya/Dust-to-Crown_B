const mongoose = require('mongoose');

const teacherAttendanceSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Must be a user with role: "Teacher"
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
   status: {
  type: String,
  enum: ['Present', 'Absent'],
  required: true
},
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);



module.exports = mongoose.model('TeacherAttendance', teacherAttendanceSchema);
