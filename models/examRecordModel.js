const mongoose = require("mongoose");

const examRecordSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Types.ObjectId,
      ref: "Student",
    },
    examType: {
      type: String,
    },
    examDate: {
      type: String,
    },
    isCopyChecked: {
      type: Boolean,
    },
    subject: {
      type: String,
    },
    marks: {
      type: String,
    },
    exam: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Exam_Record", examRecordSchema);
