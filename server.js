const express = require("express");
const connectDb = require("./db/connect");
require("dotenv").config();
require("colors");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const { errorHandler } = require("./middleware/errorMiddleware");
const PORT = 5000;
const app = express();
const cookieParser = require("cookie-parser");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

connectDb();
// 
// Using Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  // "https://d2-c-b.vercel.app",
  "https://dust-to-crown-f.vercel.app",
  "https://d2-c-f.vercel.app",
  "https://d2-c-f-git-main-vedusahs-projects.vercel.app",
  "https://dust-to-crown-f-nine.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    optionsSuccessStatus: 204,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(cookieParser());

// Routes
app.use("/api/firebase-auth", require("./routes/firebaseOtpRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/copy-check", require("./routes/copyCheckRoutes"));
app.use("/api/exam-record", require("./routes/examRecordRoutes"));
app.use("/api/home", require("./routes/homepgeRoutes"));
app.use("/api/fee", require("./routes/feeRoutes"));
app.use("/api/fee-structure", require("./routes/feeStructureRoutes"));
app.use("/api/remark", require("./routes/remarkRoutes"));
app.use("/api/homework", require("./routes/homeworkRoutes"));
app.use("/api/student-attendance", require("./routes/studentAttendenceRoutes"));
app.use("/api/teacher-attendance", require("./routes/tacherAttendanceRoutes"));
app.use("/api/rfid", require("./routes/rfidverificationRoutes"));
app.use(
  "/api/coordinator-assignment",
  require("./routes/coordinatorAssignmentRoutes")
);
app.get("/", (_, res) => {
  res.status(200).json({ message: "D2C Backend API" });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server is Running on Port:", PORT);
});
