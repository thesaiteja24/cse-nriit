const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    courseCode: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    shortName: {
      type: String,
      required: true,
    },
    credits: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
    },
    type: {
      type: String,
      enum: ["THEORY", "LAB"],
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    semester: {
      type: String, // Updated to accept "3-1" format
      required: true,
    },
    regulation: {
      type: String,
      required: true, // Added the regulation field
    },
    category: {
      isLab: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);