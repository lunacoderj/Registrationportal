const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    dob: Date,
    gender: String,
    course: String,
    year: Number,
    phone: String,
    address: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
