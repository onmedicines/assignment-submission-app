const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
const Student = require("./mongoSchemas/studentSchema");
const Faculty = require("./mongoSchemas/facultySchema");
const ComputerScience = require("./mongoSchemas/ComputerScienceSchema");
const Physics = require("./mongoSchemas/PhysicsSchema");
const Chemistry = require("./mongoSchemas/ChemistrySchema");
const Mathematics = require("./mongoSchemas/MathematicsSchema");
const Admin = require("./mongoSchemas/adminSchema.js");

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
mongoose.connect("mongodb://localhost/assignment_vercel");

// ============================ROUTES======================================
app.get("/", (req, res) => {
  res.render("studentLogin.ejs");
});
app.get("/student-login", (req, res) => {
  res.render("studentLogin.ejs");
});
app.get("/student-register", (req, res) => {
  res.render("studentRegister.ejs");
});
app.get("/faculty-login", (req, res) => {
  res.render("facultyLogin.ejs");
});
app.get("/faculty-register", (req, res) => {
  res.render("facultyRegister.ejs");
});
// ==============================New code==============================================

app.get("/admin-login", (req, res) => {
  res.render("adminLogin.ejs");
});
app.post("/admin-details", async (req, res) => {
  try {
    const username = req.body.adminUsername;
    if (username === "") throw "no_username";
    const password = req.body.adminPassword;
    if (password === "") throw "no_password";

    const admin = await Admin.findOne({ username: username });

    if (admin === null) throw "username_incorrect";
    if (admin.password === password) {
      res.render("adminProfile.ejs", {
        admin: admin,
      });
    } else {
      throw "password_incorrect";
    }
  } catch (err) {
    if (err === "no_username") {
      res.render("adminLogin.ejs", {
        error: "Username Required",
      });
    } else if (err === "username_incorrect") {
      res.render("adminLogin.ejs", {
        error: "Username incorrect",
      });
    } else if (err === "no_password") {
      res.render("adminLogin.ejs", {
        error: "Password Required",
      });
    } else if (err === "password_incorrect") {
      res.render("adminLogin.ejs", {
        error: "Wrong password",
      });
    }
  }
});

// ==============================New code==============================================
app.post("/student-registered", async (req, res) => {
  try {
    const name = req.body.name;
    if (name === "") throw "noname";
    const roll_number = req.body.roll_number;
    if (roll_number === "") throw "noroll";
    const checkRoll = await Student.findOne({ roll_number: roll_number }, { roll_number: 1, _id: 0 });
    if (checkRoll !== null) throw "rollAlreadyExists";
    const semester = req.body.semester;
    if (semester === "") throw "nosem";
    const email = req.body.email;
    if (email === "") throw "noemail";
    const password = req.body.password;
    if (password === "") throw "nopass";

    const subjects = [];

    if (req.body.chem === "on") subjects.push("Chemistry");
    if (req.body.comp === "on") subjects.push("ComputerScience");
    if (req.body.math === "on") subjects.push("Mathematics");
    if (req.body.phy === "on") subjects.push("Physics");
    if (subjects.length > 3) throw "morethan3";
    if (subjects.length < 2) throw "lessthan2";

    await Student.create({
      name: name,
      roll_number: roll_number,
      semester: semester,
      email: email,
      subjects: subjects,
      password: password,
    });

    res.render("studentRegister.ejs", {
      message: "Student registered successfully.",
    });
  } catch (err) {
    if (err === "noname") {
      res.render("studentRegister.ejs", {
        error: "Name required.",
      });
    } else if (err === "noroll") {
      res.render("studentRegister.ejs", {
        error: "Roll number required.",
      });
    } else if (err === "rollAlreadyExists") {
      res.render("studentRegister.ejs", {
        error: "Roll number already exists.",
      });
    } else if (err === "nosem") {
      res.render("studentRegister.ejs", {
        error: "Semester required.",
      });
    } else if (err === "noemail") {
      res.render("studentRegister.ejs", {
        error: "Email required.",
      });
    } else if (err === "nopass") {
      res.render("studentRegister.ejs", {
        error: "Password required.",
      });
    } else if (err === "morethan3") {
      res.render("studentRegister.ejs", {
        error: "Subjects cannot be more than 3.",
      });
    } else if (err === "lessthan2") {
      res.render("studentRegister.ejs", {
        error: "Subjects cannot be less than 2",
      });
    }
  }
});
app.post("/faculty-registered", async (req, res) => {
  try {
    const name = req.body.name;
    if (name === "") throw "noname";
    const faculty_id = req.body.faculty_id;
    if (faculty_id === "") throw "noid";
    const department = req.body.department;
    if (department === "") throw "nodept";
    const email = req.body.email;
    if (email === "") throw "noemail";
    const password = req.body.password;
    if (password === "") throw "nopass";

    await Faculty.create({
      name: name,
      faculty_id: faculty_id,
      department: department,
      email: email,
      password: password,
    });

    res.render("facultyRegister.ejs", {
      message: "Faculty registered successfully.",
    });
  } catch (err) {
    if (err === "noname") {
      res.render("facultyRegister.ejs", {
        error: "Name required.",
      });
    } else if (err === "noid") {
      res.render("facultyRegister.ejs", {
        error: "Faculty ID required.",
      });
    } else if (err === "nodept") {
      res.render("facultyRegister.ejs", {
        error: "Department required.",
      });
    } else if (err === "noemail") {
      res.render("facultyRegister.ejs", {
        error: "Email required.",
      });
    } else if (err === "nopass") {
      res.render("facultyRegister.ejs", {
        error: "Password required.",
      });
    }
  }
});
app.post("/student-details", async (req, res) => {
  try {
    const roll_number = req.body.studentLoginRoll;
    const password = req.body.studentLoginPassword;

    const student = await Student.findOne({ roll_number: roll_number });
    if (student === null) throw "studentNotFound";

    if (student.password === password) {
      res.render("studentDetails.ejs", {
        name: student.name,
        roll_number: student.roll_number,
        semester: student.semester,
        email: student.email,
        subjects: student.subjects,
      });
    } else {
      throw "incorrectPassword";
    }
  } catch (err) {
    if (err === "studentNotFound") {
      res.render("studentLogin.ejs", {
        error: "No records found.",
      });
    } else if (err === "incorrectPassword") {
      res.render("studentLogin.ejs", {
        error: "Wrong password.",
      });
    }
  }
});
app.post("/view-student-details", async (req, res) => {
  const roll_number = req.body.roll_number;
  const student = await Student.findOne({ roll_number: roll_number });

  res.render("studentDetails.ejs", {
    name: student.name,
    roll_number: student.roll_number,
    semester: student.semester,
    email: student.email,
    subjects: student.subjects,
  });
});

async function getStudentAssignmentPage(roll_number) {
  const subjectObj = {};
  const statusObj = {};
  const marksObj = {};
  const attendanceMarksObj = {};

  const student = await Student.findOne({ roll_number: roll_number });

  if (student.subjects.includes("ComputerScience")) {
    const computerAssignment = await ComputerScience.findOne({ roll_number: roll_number });
    subjectObj.computer = "ComputerScience";
    if (computerAssignment === null) {
      statusObj.computer = "Not Submitted";
      marksObj.computer = "-";
      attendanceMarksObj.computer = "-";
    } else {
      statusObj.computer = "Submitted";
      marksObj.computer = computerAssignment.marks;
      attendanceMarksObj.computer = computerAssignment.attendanceMarks;
    }
  }
  if (student.subjects.includes("Physics")) {
    const physicsAssignment = await Physics.findOne({ roll_number: roll_number });
    subjectObj.physics = "Physics";
    if (physicsAssignment === null) {
      statusObj.physics = "Not Submitted";
      marksObj.physics = "-";
      attendanceMarksObj.physics = "-";
    } else {
      statusObj.physics = "Submitted";
      marksObj.physics = physicsAssignment.marks;
      attendanceMarksObj.physics = physicsAssignment.attendanceMarks;
    }
  }
  if (student.subjects.includes("Chemistry")) {
    const chemistryAssignment = await Chemistry.findOne({ roll_number: roll_number });
    subjectObj.chemistry = "Physics";
    if (chemistryAssignment === null) {
      statusObj.chemistry = "Not Submitted";
      marksObj.chemistry = "-";
      attendanceMarksObj.chemistry = "-";
    } else {
      statusObj.chemistry = "Submitted";
      marksObj.chemistry = chemistryAssignment.marks;
      attendanceMarksObj.chemistry = chemistryAssignment.attendanceMarks;
    }
  }
  if (student.subjects.includes("Mathematics")) {
    const mathsAssignment = await Mathematics.findOne({ roll_number: roll_number });
    subjectObj.maths = "Mathematics";
    if (mathsAssignment === null) {
      statusObj.maths = "Not Submitted";
      marksObj.maths = "-";
      attendanceMarksObj.maths = "-";
    } else {
      statusObj.maths = "Submitted";
      marksObj.maths = mathsAssignment.marks;
      attendanceMarksObj.maths = mathsAssignment.attendanceMarks;
    }
  }
  return {
    subjectObj,
    statusObj,
    marksObj,
    attendanceMarksObj,
  };
}

app.post("/view-student-assignment", async (req, res) => {
  const roll_number = req.body.roll_number;
  const { subjectObj, statusObj, marksObj, attendanceMarksObj } = await getStudentAssignmentPage(roll_number);
  res.render("studentAssignment.ejs", {
    roll_number: roll_number,
    subjectObj: subjectObj,
    statusObj: statusObj,
    marksObj: marksObj,
    attendanceMarksObj: attendanceMarksObj,
  });
});

app.post("/submitComputerScience", async (req, res) => {
  const roll_number = req.body.roll_number;
  let error;
  try {
    const file = req.files.assignmentComputerScience;
    if (file.mimetype !== "application/pdf") throw "notpdf";

    const student = await Student.findOne({ roll_number: roll_number });

    await ComputerScience.create({
      roll_number: roll_number,
      semester: student.semester,
      assignment: {
        name: file.name,
        data: file.data,
        mimetype: file.mimetype,
        size: file.size,
      },
    });
  } catch (err) {
    if (err === "notpdf") {
      error = "File is not a pdf.";
    } else {
      error = "Make sure you upload a PDF file.";
    }
  }

  const { subjectObj, statusObj, marksObj, attendanceMarksObj } = await getStudentAssignmentPage(roll_number);

  res.render("studentAssignment.ejs", {
    error: error,
    roll_number: roll_number,
    subjectObj: subjectObj,
    statusObj: statusObj,
    marksObj: marksObj,
    attendanceMarksObj: attendanceMarksObj,
  });
});
app.post("/viewComputerScience", async (req, res) => {
  const roll_number = req.body.roll_number;
  const computerAssignment = await ComputerScience.findOne({ roll_number: roll_number });

  res.end(new Buffer.from(computerAssignment.assignment.data, "base64"));
});
app.post("/submitPhysics", async (req, res) => {
  const roll_number = req.body.roll_number;
  let error;
  try {
    const file = req.files.assignmentPhysics;
    if (file.mimetype !== "application/pdf") throw "notpdf";

    const student = await Student.findOne({ roll_number: roll_number });

    await Physics.create({
      roll_number: roll_number,
      semester: student.semester,
      assignment: {
        name: file.name,
        data: file.data,
        mimetype: file.mimetype,
        size: file.size,
      },
    });
  } catch (err) {
    if (err === "notpdf") {
      error = "File is not a pdf.";
    } else {
      error = "Make sure you upload a PDF file.";
    }
  }

  const { subjectObj, statusObj, marksObj, attendanceMarksObj } = await getStudentAssignmentPage(roll_number);

  res.render("studentAssignment.ejs", {
    error: error,
    roll_number: roll_number,
    subjectObj: subjectObj,
    statusObj: statusObj,
    marksObj: marksObj,
    attendanceMarksObj: attendanceMarksObj,
  });
});
app.post("/viewPhysics", async (req, res) => {
  const roll_number = req.body.roll_number;
  const physicsAssignment = await Physics.findOne({ roll_number: roll_number });

  res.end(new Buffer.from(physicsAssignment.assignment.data, "base64"));
});
app.post("/submitChemistry", async (req, res) => {
  const roll_number = req.body.roll_number;
  let error;
  try {
    const file = req.files.assignmentChemistry;
    if (file.mimetype !== "application/pdf") throw "notpdf";

    const student = await Student.findOne({ roll_number: roll_number });

    await Chemistry.create({
      roll_number: roll_number,
      semester: student.semester,
      assignment: {
        name: file.name,
        data: file.data,
        mimetype: file.mimetype,
        size: file.size,
      },
    });
  } catch (err) {
    if (err === "notpdf") {
      error = "File is not a pdf.";
    } else {
      error = "Make sure you upload a PDF file.";
    }
  }

  const { subjectObj, statusObj, marksObj, attendanceMarksObj } = await getStudentAssignmentPage(roll_number);

  res.render("studentAssignment.ejs", {
    error: error,
    roll_number: roll_number,
    subjectObj: subjectObj,
    statusObj: statusObj,
    marksObj: marksObj,
    attendanceMarksObj: attendanceMarksObj,
  });
});
app.post("/viewChemistry", async (req, res) => {
  const roll_number = req.body.roll_number;
  const chemistryAssignment = await Chemistry.findOne({ roll_number: roll_number });

  res.end(new Buffer.from(chemistryAssignment.assignment.data, "base64"));
});
app.post("/submitMathematics", async (req, res) => {
  const roll_number = req.body.roll_number;
  let error;
  try {
    const file = req.files.assignmentMathematics;
    if (file.mimetype !== "application/pdf") throw "notpdf";

    const student = await Student.findOne({ roll_number: roll_number });

    await Mathematics.create({
      roll_number: roll_number,
      semester: student.semester,
      assignment: {
        name: file.name,
        data: file.data,
        mimetype: file.mimetype,
        size: file.size,
      },
    });
  } catch (err) {
    if (err === "notpdf") {
      error = "File is not a pdf.";
    } else {
      error = "Make sure you upload a PDF file.";
    }
  }

  const { subjectObj, statusObj, marksObj, attendanceMarksObj } = await getStudentAssignmentPage(roll_number);

  res.render("studentAssignment.ejs", {
    error: error,
    roll_number: roll_number,
    subjectObj: subjectObj,
    statusObj: statusObj,
    marksObj: marksObj,
    attendanceMarksObj: attendanceMarksObj,
  });
});
app.post("/viewMathematics", async (req, res) => {
  const roll_number = req.body.roll_number;
  const mathsAssignment = await Mathematics.findOne({ roll_number: roll_number });

  res.end(new Buffer.from(mathsAssignment.assignment.data, "base64"));
});

app.post("/faculty-details", async (req, res) => {
  try {
    const faculty_id = req.body.faculty_id;
    const password = req.body.faculty_password;

    const faculty = await Faculty.findOne({ faculty_id: faculty_id });

    if (faculty === null) throw "facultyNotFound";

    if (faculty.password === password) {
      res.render("facultyDetails.ejs", {
        faculty_id: faculty_id,
        name: faculty.name,
        faculty_id: faculty.faculty_id,
        email: faculty.email,
        department: faculty.department,
      });
    } else {
      throw "incorrectPassword";
    }
  } catch (err) {
    if (err === "facultyNotFound") {
      res.render("facultyLogin.ejs", {
        error: "No records found.",
      });
    } else if (err === "incorrectPassword") {
      res.render("facultyLogin.ejs", {
        error: "Wrong password.",
      });
    }
  }
});
app.post("/view-faculty-details", async (req, res) => {
  const faculty_id = req.body.faculty_id;

  const faculty = await Faculty.findOne({ faculty_id: faculty_id });

  res.render("facultyDetails.ejs", {
    faculty_id: faculty_id,
    name: faculty.name,
    faculty_id: faculty.faculty_id,
    email: faculty.email,
    department: faculty.department,
  });
});
app.post("/view-faculty-assignment", async (req, res) => {
  const faculty_id = req.body.faculty_id;
  res.render("facultyAssignment.ejs", {
    faculty_id: faculty_id,
  });
});
app.post("/view-assignment-by-semester", async (req, res) => {
  const sem = req.body.semester;
  const faculty_id = req.body.faculty_id;
  let assignments = [];

  const faculty = await Faculty.findOne({ faculty_id: faculty_id });

  if (faculty.department === "ComputerScience") {
    assignments = await ComputerScience.find({ semester: sem }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 }).sort({ roll_number: 1 });
  } else if (faculty.department === "Physics") {
    assignments = await Physics.find({ semester: sem }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 }).sort({ roll_number: 1 });
  } else if (faculty.department === "Chemistry") {
    assignments = await Chemistry.find({ semester: sem }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 }).sort({ roll_number: 1 }).sort({ roll_number: 1 });
  } else if (faculty.department === "Mathematics") {
    assignments = await Mathematics.find({ semester: sem }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 }).sort({ roll_number: 1 });
  }

  let rolls = [];
  assignments.forEach((assignment) => {
    rolls.push(assignment.roll_number);
  });

  const students = await Student.find({ roll_number: { $in: rolls } }).sort({ roll_number: 1 });

  res.render("facultyAssignment.ejs", {
    faculty_id: faculty_id,
    faculty: faculty,
    assignments: assignments,
    students: students,
  });
});
app.post("/view-assignment-by-roll-number", async (req, res) => {
  const faculty_id = req.body.faculty_id;
  const roll_number = req.body.roll_number;

  const faculty = await Faculty.findOne({ faculty_id: faculty_id }, { password: 0 });
  const student = await Student.findOne({ roll_number: roll_number }, { password: 0 });
  let assignment;

  if (faculty.department === "ComputerScience") {
    assignment = await ComputerScience.findOne({ roll_number: roll_number }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 });
  } else if (faculty.department === "Physics") {
    assignment = await Physics.findOne({ roll_number: roll_number }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 });
  } else if (faculty.department === "Chemistry") {
    assignment = await Chemistry.findOne({ roll_number: roll_number }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 });
  } else if (faculty.department === "Mathematics") {
    assignment = await Mathematics.findOne({ roll_number: roll_number }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 });
  }

  res.render("facultyAssignment.ejs", {
    faculty_id: faculty_id,
    faculty: faculty,
    student: student,
    assignment: assignment,
  });
});
app.post("/choose-semester-marks-edit", async (req, res) => {
  const sem = req.body.semester;
  const faculty_id = req.body.faculty_id;
  let assignments = [];

  const faculty = await Faculty.findOne({ faculty_id: faculty_id });

  if (faculty.department === "ComputerScience") {
    assignments = await ComputerScience.find({ semester: sem }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 }).sort({ roll_number: 1 });
  } else if (faculty.department === "Physics") {
    assignments = await Physics.find({ semester: sem }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 }).sort({ roll_number: 1 });
  } else if (faculty.department === "Chemistry") {
    assignments = await Chemistry.find({ semester: sem }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 }).sort({ roll_number: 1 });
  } else if (faculty.department === "Mathematics") {
    assignments = await Mathematics.find({ semester: sem }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 }).sort({ roll_number: 1 });
  }

  let rolls = [];
  assignments.forEach((assignment) => {
    rolls.push(assignment.roll_number);
  });

  const students = await Student.find({ roll_number: { $in: rolls } }).sort({ roll_number: 1 });

  res.render("facultyAssignment.ejs", {
    updateMarks: 1,
    faculty_id: faculty_id,
    faculty: faculty,
    assignments: assignments,
    students: students,
  });
});
app.post("/choose-semester-marks-update", async (req, res) => {
  const sem = req.body.semester;
  const faculty_id = req.body.faculty_id;
  const roll_number = req.body.roll_number;
  const marks = req.body.marks;

  let assignments = [];
  const faculty = await Faculty.findOne({ faculty_id: faculty_id });
  if (faculty.department === "ComputerScience") {
    await ComputerScience.findOneAndUpdate({ roll_number: roll_number }, { marks: marks });
    assignments = await ComputerScience.find({ semester: sem }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 }).sort({ roll_number: 1 });
  } else if (faculty.department === "Physics") {
    await Physics.findOneAndUpdate({ roll_number: roll_number }, { marks: marks });
    assignments = await Physics.find({ semester: sem }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 }).sort({ roll_number: 1 });
  } else if (faculty.department === "Chemistry") {
    await Chemistry.findOneAndUpdate({ roll_number: roll_number }, { marks: marks });
    assignments = await Chemistry.find({ semester: sem }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 }).sort({ roll_number: 1 });
  } else if (faculty.department === "Mathematics") {
    await Mathematics.findOneAndUpdate({ roll_number: roll_number }, { marks: marks });
    assignments = await Mathematics.find({ semester: sem }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 }).sort({ roll_number: 1 });
  }
  let rolls = [];
  assignments.forEach((assignment) => {
    rolls.push(assignment.roll_number);
  });
  const students = await Student.find({ roll_number: { $in: rolls } }).sort({ roll_number: 1 });

  res.render("facultyAssignment.ejs", {
    faculty_id: faculty_id,
    faculty: faculty,
    assignments: assignments,
    students: students,
  });
});
app.post("/choose-semester-attendance-edit", async (req, res) => {
  const sem = req.body.semester;
  const faculty_id = req.body.faculty_id;
  let assignments = [];

  const faculty = await Faculty.findOne({ faculty_id: faculty_id });

  if (faculty.department === "ComputerScience") {
    assignments = await ComputerScience.find({ semester: sem }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 }).sort({ roll_number: 1 });
  } else if (faculty.department === "Physics") {
    assignments = await Physics.find({ semester: sem }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 }).sort({ roll_number: 1 });
  } else if (faculty.department === "Chemistry") {
    assignments = await Chemistry.find({ semester: sem }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 }).sort({ roll_number: 1 }).sort({ roll_number: 1 });
  } else if (faculty.department === "Mathematics") {
    assignments = await Mathematics.find({ semester: sem }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 }).sort({ roll_number: 1 });
  }

  let rolls = [];
  assignments.forEach((assignment) => {
    rolls.push(assignment.roll_number);
  });

  const students = await Student.find({ roll_number: { $in: rolls } }).sort({ roll_number: 1 });

  res.render("facultyAssignment.ejs", {
    updateAttendance: 1,
    faculty_id: faculty_id,
    faculty: faculty,
    assignments: assignments,
    students: students,
  });
});
app.post("/choose-semester-attendance-update", async (req, res) => {
  const sem = req.body.semester;
  const faculty_id = req.body.faculty_id;
  const roll_number = req.body.roll_number;
  const marks = req.body.marks;

  let assignments = [];
  const faculty = await Faculty.findOne({ faculty_id: faculty_id });
  if (faculty.department === "ComputerScience") {
    await ComputerScience.findOneAndUpdate({ roll_number: roll_number }, { attendanceMarks: marks });
    assignments = await ComputerScience.find({ semester: sem }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 }).sort({ roll_number: 1 });
  } else if (faculty.department === "Physics") {
    await Physics.findOneAndUpdate({ roll_number: roll_number }, { attendanceMarks: marks });
    assignments = await Physics.find({ semester: sem }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 }).sort({ roll_number: 1 });
  } else if (faculty.department === "Chemistry") {
    await Chemistry.findOneAndUpdate({ roll_number: roll_number }, { attendanceMarks: marks });
    assignments = await Chemistry.find({ semester: sem }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 }).sort({ roll_number: 1 }).sort({ roll_number: 1 });
  } else if (faculty.department === "Mathematics") {
    await Mathematics.findOneAndUpdate({ roll_number: roll_number }, { attendanceMarks: marks });
    assignments = await Mathematics.find({ semester: sem }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 }).sort({ roll_number: 1 });
  }
  let rolls = [];
  assignments.forEach((assignment) => {
    rolls.push(assignment.roll_number);
  });
  const students = await Student.find({ roll_number: { $in: rolls } }).sort({ roll_number: 1 });

  res.render("facultyAssignment.ejs", {
    faculty_id: faculty_id,
    faculty: faculty,
    assignments: assignments,
    students: students,
  });
});

app.post("/choose-roll-marks-edit", async (req, res) => {
  const faculty_id = req.body.faculty_id;
  const roll_number = req.body.roll_number;

  const faculty = await Faculty.findOne({ faculty_id: faculty_id }, { password: 0 });
  const student = await Student.findOne({ roll_number: roll_number }, { password: 0 });
  let assignment;

  if (faculty.department === "ComputerScience") {
    assignment = await ComputerScience.findOne({ roll_number: roll_number }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 });
  } else if (faculty.department === "Physics") {
    assignment = await Physics.findOne({ roll_number: roll_number }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 });
  } else if (faculty.department === "Chemistry") {
    assignment = await Chemistry.findOne({ roll_number: roll_number }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 });
  } else if (faculty.department === "Mathematics") {
    assignment = await Mathematics.findOne({ roll_number: roll_number }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 });
  }

  res.render("facultyAssignment.ejs", {
    update: 1,
    faculty_id: faculty_id,
    faculty: faculty,
    student: student,
    assignment: assignment,
  });
});
app.post("/choose-roll-marks-update", async (req, res) => {
  const faculty_id = req.body.faculty_id;
  const roll_number = req.body.roll_number;
  const marks = req.body.marks;

  const faculty = await Faculty.findOne({ faculty_id: faculty_id }, { password: 0 });
  const student = await Student.findOne({ roll_number: roll_number }, { password: 0 });
  let assignment;

  if (faculty.department === "ComputerScience") {
    await ComputerScience.findOneAndUpdate({ roll_number: roll_number }, { marks: marks });
    assignment = await ComputerScience.findOne({ roll_number: roll_number }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 });
  } else if (faculty.department === "Physics") {
    await Physics.findOneAndUpdate({ roll_number: roll_number }, { marks: marks });
    assignment = await Physics.findOne({ roll_number: roll_number }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 });
  } else if (faculty.department === "Chemistry") {
    await Chemistry.findOneAndUpdate({ roll_number: roll_number }, { marks: marks });
    assignment = await Chemistry.findOne({ roll_number: roll_number }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 });
  } else if (faculty.department === "Mathematics") {
    await Mathematics.findOneAndUpdate({ roll_number: roll_number }, { marks: marks });
    assignment = await Mathematics.findOne({ roll_number: roll_number }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 });
  }

  res.render("facultyAssignment.ejs", {
    faculty_id: faculty_id,
    faculty: faculty,
    student: student,
    assignment: assignment,
  });
});
app.post("/choose-roll-attendance-edit", async (req, res) => {
  const faculty_id = req.body.faculty_id;
  const roll_number = req.body.roll_number;

  const faculty = await Faculty.findOne({ faculty_id: faculty_id }, { password: 0 });
  const student = await Student.findOne({ roll_number: roll_number }, { password: 0 });
  let assignment;

  if (faculty.department === "ComputerScience") {
    assignment = await ComputerScience.findOne({ roll_number: roll_number }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 });
  } else if (faculty.department === "Physics") {
    assignment = await Physics.findOne({ roll_number: roll_number }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 });
  } else if (faculty.department === "Chemistry") {
    assignment = await Chemistry.findOne({ roll_number: roll_number }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 });
  } else if (faculty.department === "Mathematics") {
    assignment = await Mathematics.findOne({ roll_number: roll_number }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 });
  }

  res.render("facultyAssignment.ejs", {
    updateAttendance: 1,
    faculty_id: faculty_id,
    faculty: faculty,
    student: student,
    assignment: assignment,
  });
});
app.post("/choose-roll-attendance-update", async (req, res) => {
  const sem = req.body.semester;
  const faculty_id = req.body.faculty_id;
  const roll_number = req.body.roll_number;
  const marks = req.body.marks;

  const faculty = await Faculty.findOne({ faculty_id: faculty_id }, { password: 0 });
  let assignment;

  if (faculty.department === "ComputerScience") {
    await ComputerScience.findOneAndUpdate({ roll_number: roll_number }, { attendanceMarks: marks });
    assignment = await ComputerScience.findOne({ roll_number: roll_number }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 });
  } else if (faculty.department === "Physics") {
    await Physics.findOneAndUpdate({ roll_number: roll_number }, { attendanceMarks: marks });
    assignment = await Physics.findOne({ roll_number: roll_number }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 });
  } else if (faculty.department === "Chemistry") {
    await Chemistry.findOneAndUpdate({ roll_number: roll_number }, { attendanceMarks: marks });
    assignment = await Chemistry.findOne({ roll_number: roll_number }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 });
  } else if (faculty.department === "Mathematics") {
    await Mathematics.findOneAndUpdate({ roll_number: roll_number }, { attendanceMarks: marks });
    assignment = await Mathematics.findOne({ roll_number: roll_number }, { roll_number: 1, semester: 1, marks: 1, attendanceMarks: 1 });
  }

  const student = await Student.findOne({ roll_number: roll_number }, { password: 0 });

  res.render("facultyAssignment.ejs", {
    faculty_id: faculty_id,
    faculty: faculty,
    assignment: assignment,
    student: student,
  });
});
