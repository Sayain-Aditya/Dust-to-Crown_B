const asyncHandler = require("express-async-handler");
const cloudinary = require("cloudinary").v2;

const User = require("../models/userModel");

// Register User
const registeruser = asyncHandler(async (req, res) => {
  console.log(req.body);
  let data = req.body;

  // Check Email
  if (!data.email) {
    return res
      .status(404)
      .json({ message: "Please provide the email field!", success: false });
  }
  if (!data.password) {
    return res
      .status(404)
      .json({ message: "Please provide the password field!", success: false });
  }

  const email = data.email;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res
      .status(409)
      .json({ message: "User Already Exists!", success: false });
  }

  if (req.files !== null && req.files !== undefined) {
    console.log("file");

    const uploadedImages = {};

    const uploadImageToCloudinary = async (fieldName, currentImagePublicId) => {
      if (req.files[fieldName]) {
        if (currentImagePublicId) {
          await cloudinary.uploader.destroy(currentImagePublicId);
        }

        const uploadResponse = await cloudinary.uploader.upload(
          req.files[fieldName].tempFilePath,
          { folder: "D2C-Portal" }
        );
        return {
          public_id: uploadResponse.public_id,
          secure_url: uploadResponse.secure_url,
        };
      }
      // If no new image is provided, return null
      return null;
    };

    // Upload and update the 'avatar' image if found
    const avatar = await uploadImageToCloudinary(
      "avatar",
      data?.avatar?.public_id
    );
    if (avatar) {
      uploadedImages.avatar = avatar;
    }

    // Update the data with the uploaded images
    data = {
      ...data,
      ...uploadedImages,
    };
  } else {
    // If no new image is provided, use the existing data
    data = req.body;
  }

  const user = await User.create(data);

  if (!user) {
    return res
      .status(400)
      .json({ message: "Erorr while creating user!", success: false });
  }

  res.status(201).json({ data: user, success: true });
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req?.body;

  if (!email) {
    res.status(400);
    throw new Error("Please provide the email field!");
  }
  if (!password) {
    res.status(400);
    throw new Error("Please provide the password field!");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("User Not Found!");
  }

  if (user.email !== email) {
    res.status(400);
    throw new Error("Incorrect Email!");
  }

  if (user.password !== password) {
    res.status(400);
    throw new Error("Incorrect Password!");
  }

  if (user.isActive === false) {
    res.status(400);
    throw new Error("You don't have permission to login please contact Admin.");
  }

  if (user && user.email == email && user.password == password) {
    res.status(200).json({
      _id: user._id,
      email: user.email,
      name: user.name,
      avatar: user.avatar || null,
      number: user.number,
      role: user.role,
      secondaryRole: user.secondaryRole || null,
      class: user.class || null,
      division: user.section || null,
      assignedSubjects: user.assignedSubjects || null,
      assignedClasses: user.assignedClasses || null,
      assignedSections: user.assignedSections || null,
      assignedWings: user.assignedWings || null,
      isActive: user.isActive,
      success: true,
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
});

const getMe = asyncHandler(async (req, res) => {
  const id = req?.params?.id;

  const user = await User.findById(id).select("-password");

  if (!user) {
    res.status(404).json({ success: false, message: "User Not Found!" });
  }

  res.status(200).json({ user: user, success: true });
});

const listAllusers = asyncHandler(async (req, res) => {
  const page = parseInt(req?.query?.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const users = await User.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  if (!users || users.length === 0) {
    res.status(404);
    throw new Error("Users nor found!");
  }
  const count = await User.countDocuments();

  res.status(200).json({ data: users, count, success: true });
});

// Update User
const updateUser = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(404);
    throw new Errpr("Please provide the user id.");
  }

  const userExists = await User.findById(id);

  if (!userExists) {
    res.status(404);
    throw new Error("User not exists!");
  }

  let data = req.body;

  if (req.files !== null && req.files !== undefined) {
    console.log("file");

    const uploadedImages = {};

    const uploadImageToCloudinary = async (fieldName, currentImagePublicId) => {
      if (req.files[fieldName]) {
        if (currentImagePublicId) {
          await cloudinary.uploader.destroy(currentImagePublicId);
        }

        const uploadResponse = await cloudinary.uploader.upload(
          req.files[fieldName].tempFilePath,
          { folder: "D2C-Portal" }
        );
        return {
          public_id: uploadResponse.public_id,
          secure_url: uploadResponse.secure_url,
        };
      }
      // If no new image is provided, return null
      return null;
    };

    // Upload and update the 'avatar' image if found
    const avatar = await uploadImageToCloudinary(
      "avatar",
      data?.avatar?.public_id
    );
    if (avatar) {
      uploadedImages.avatar = avatar;
    }

    // Update the data with the uploaded images
    data = {
      ...data,
      ...uploadedImages,
    };
  } else {
    // If no new image is provided, use the existing data
    data = req.body;
  }

  const user = await User.findByIdAndUpdate(id, data, {
    new: true,
  });

  if (!user) {
    res.status(400);
    throw new Error("Error while updating user!");
  }

  res.status(200).json({ data: user, success: true });
});

const deleteUser = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(404);
    throw new Errpr("Please provide the user id.");
  }

  const userExists = await User.findById(id);

  if (!userExists) {
    res.status(404);
    throw new Error("User not exists!");
  }

  await User.deleteOne({ _id: id });

  res.status(200).json({ success: true });
});

// const createTransporter = async () => {
//   try {
//     const oauth2Client = new OAuth2(
//       process.env.CLIENT_ID,
//       process.env.CLIENT_SECRET,
//       "https://developers.google.com/oauthplayground"
//     );

//     oauth2Client.setCredentials({
//       refresh_token: process.env.REFRESH_TOKEN,
//     });

//     const accessToken = await new Promise((resolve, reject) => {
//       oauth2Client.getAccessToken((err, token) => {
//         if (err) {
//           console.log("*ERR: ", err);
//           reject();
//         }
//         resolve(token);
//       });
//     });

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         type: "OAuth2",
//         user: process.env.USER_EMAIL,
//         accessToken,
//         clientId: process.env.CLIENT_ID,
//         clientSecret: process.env.CLIENT_SECRET,
//         refreshToken: process.env.REFRESH_TOKEN,
//       },
//     });
//     return transporter;
//   } catch (err) {
//     return err;
//   }
// };

// const sendMail = async (email, password, username) => {
//   try {
//     const mailOptions = {
//       from: process.env.USER_EMAIL,
//       to: email,
//       subject: "Login Credentials",
//       html: `<!DOCTYPE html>
//       <html>
//       <head>
//         <style>
//           body {
//             font-family: Arial, sans-serif;
//             margin: 0;
//             padding: 0;
//           }
//           a{
//             font-weight: 600;
//           }
//         </style>
//       </head>
//       <body>
//         <h1>Hello, ${username}</h1>
//         <h2>Please find your login credentials below.</h2>
//         <h3>Email: ${email}</h3>
//         <h3>Password: ${password}</h3>
//         <a href="https://crew-schedule-sigma.vercel.app/">Login Here</a>
//       </body>
//       </html>`,
//     };

//     let emailTransporter = await createTransporter();
//     await emailTransporter.sendMail(mailOptions);
//     console.log("Email Sent Successfully!");
//   } catch (err) {
//     console.log("ERROR: ", err);
//   }
// };

const getAllTeachers = asyncHandler(async (req, res) => {
  const teachers = await User.find({
    $or: [
      { role: "Teacher" },
      { role: "Senior Coordinator" },
      { role: "Junior Coordinator" },
      { secondaryRole: "Teacher" },
      { secondaryRole: "Senior Coordinator" },
      { secondaryRole: "Junior Coordinator" },
    ],
  });
  if (!teachers || teachers.length === 0) {
    return res
      .status(404)
      .json({ message: "No Teachers Found!", success: false });
  }
  res.status(200).json({ data: teachers, success: true });
});

const updateTeacher = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const {
    assignedClasses,
    assignedSections,
    assignedWings,
    assignedSubjects,
    secondaryRole,
  } = req.body;

  const updateData = {
    assignedClasses,
    assignedSections,
    assignedWings,
    assignedSubjects,
    secondaryRole,
  };

  const teacher = await User.findByIdAndUpdate(id, updateData, { new: true });

  if (!teacher) {
    return res
      .status(404)
      .json({ message: "Teacher not found!", success: false });
  }
  res.status(200).json({ data: teacher, success: true });
});

// Saerch
const searchUsers = asyncHandler(async (req, res) => {
  const query = req.query.q;

  if (!query)
    return res
      .status(400)
      .json({ message: "Please enter a query", success: false });

  const users = await User.find({
    $or: [
      { email: { $regex: query, $options: "i" } },
      { name: { $regex: query, $options: "i" } },
    ],
  });

  if (!users || users.length === 0) {
    return res.status(404).json({ message: "No users found!", success: false });
  }

  res.status(200).json({ data: users, success: true });
});

// Get Teachers based on class, subject and section
const getTeachersByClassSubjectSection = asyncHandler(async (req, res) => {
  const { className, subject, section } = req.query;

  const teachers = await User.aggregate([
    // Match teachers with role "Teacher" OR secondaryRole "Teacher"
    {
      $match: {
        $or: [{ role: "Teacher" }, { secondaryRole: "Teacher" }],
      },
    },
    // Unwind the arrays to deconstruct them
    { $unwind: "$assignedClasses" },
    { $unwind: "$assignedSubjects" },
    { $unwind: "$assignedSections" },
    // Match documents where all conditions match
    {
      $match: {
        "assignedClasses.value": className,
        "assignedSubjects.value": subject,
        "assignedSections.value": section,
      },
    },
    // Group by teacher id to get distinct teachers
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        role: { $first: "$role" },
        secondaryRole: { $first: "$secondaryRole" },
      },
    },
  ]);

  if (!teachers || teachers.length === 0) {
    return res
      .status(404)
      .json({ message: "No teachers found!", success: false });
  }

  res.status(200).json({ data: teachers, success: true });
});

// List by role
const listByRole = asyncHandler(async (req, res) => {
  const role = req.query.role;

  const users = await User.find({
    $or: [{ role: role }, { secondaryRole: role }],
  }).select("name role secondaryRole");

  if (!users || users.length === 0) {
    return res.status(404).json({ message: "No users found!", success: false });
  }

  res.status(200).json({ data: users, success: true });
});

module.exports = {
  registeruser,
  loginUser,
  getMe,
  listAllusers,
  updateUser,
  deleteUser,
  getAllTeachers,
  updateTeacher,
  searchUsers,
  getTeachersByClassSubjectSection,
  listByRole,
};
