const mongoose = require("mongoose");

const ComputerAssignment = new mongoose.Schema({
  roll_number: {
    type: Number,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  assignment: {
    name: String,
    data: Buffer,
    mimetype: String,
    size: Number,
  },
  marks: {
    type: Number,
  },
  attendanceMarks: {
    type: Number,
  },
});

module.exports = mongoose.model("ComputerAssignment", ComputerAssignment);
