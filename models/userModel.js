const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    number: {
      type: Number,
    },
    firebaseUid: {
      type: String,
      unique: true,
      sparse: true,
    },
    avatar: {
      public_id: String,
      secure_url: String,
    },
    role: {
      type: String,
      enum: ["Admin", "Teacher", "Senior Coordinator", "Junior Coordinator"],
    },
    secondaryRole: {
      type: String,
      enum: ["Teacher", "Senior Coordinator", "Junior Coordinator"],
    },
    class: {
      type: String,
    },
    section: {
      type: String,
    },
    assignedSubjects: {
      type: [
        {
          label: { type: String },
          value: { type: String },
        },
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    assignedClasses: {
      type: [
        {
          label: { type: String },
          value: { type: String },
          sections: {
            type: [
              {
                label: { type: String },
                value: { type: String },
              },
            ],
            default: [],
          },
        },
      ],
    },
    assignedSections: {
      type: [
        {
          label: { type: String },
          value: { type: String },
        },
      ],
    },
    assignedWings: {
      type: [
        {
          label: { type: String },
          value: { type: String },
        },
      ],
    },

    // ✅ Added RFID field here
    rfid: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
