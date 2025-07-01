const mongoose = require("mongoose");

const coordinatorAssignmentSchema = new mongoose.Schema(
  {
    teacherName: {
      type: String,
      required: true,
    },
    teacherId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    class: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    assignedWorkType: {
      type: String,
      enum: ["book", "copy", "file"],
      required: true,
    },
    projectedDate: {
      type: Date,
      required: true,
    },
    actualSubmissionDate: {
      type: Date,
      default: null,
    },
    coordinatorName: {
      type: String,
      required: true,
    },
    coordinatorId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "CoordinatorAssignment",
  coordinatorAssignmentSchema
);
