import express from "express";
const app = express();
import cors from "cors";
import mongoose from "mongoose";
import userModel from "./models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import isLoggedIn from "./middlewares/isLoggedIn.middleware.js";
import projectModel from "./models/project.model.js";

mongoose
  .connect(
    `mongodb+srv://incrediblesaizan22:7rbKPLkylIe8WAVb@ai-developer.c491o.mongodb.net/?retryWrites=true&w=majority&appName=AI-developer`
  )
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

const allowedOrigins = [
  "http://localhost:5173",
  "https://incrediblesaizan1-ai-developer.vercel.app",
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
app.options("*", cors());

app.get("/", (req, res) => {
  res.send("hello saizan khan");
});


app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ Error: true, message: "All fields are required" });
    }

    const isUser = await userModel.findOne({ email });
    if (isUser) {
      return res
        .status(400)
        .json({ Error: true, message: "User already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      email,
      password: hashedPassword,
    });
    await newUser.save();

    const accessToken = jwt.sign(
      { userId: newUser._id,email: newUser.email },
      "lslsdlsdlsfndnvlsklskdssldsldsl"
    );

    return res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true, // Use `false` for localhost, `true` for production
        sameSite: "none",
      })
      .status(200)
      .json({
        user: { email: newUser.email },
        message: "User Registered successfully",
      });
  } catch (error) {
    console.log("Something went wrong while registering user", error);
    res.status(500).json("Something went wrong while registering user");
  }
});


app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ Error: true, message: "All fields are required " });

    let user = await userModel.findOne({ email });
    if (!user)
      return res.status(400).json({ Error: true, message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      "lslsdlsdlsfndnvlsklskdssldsldsl"
    );

    return res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true, // Use `false` for localhost, `true` for production
        sameSite: "none",
      })
      .status(200)
      .json({
        Error: false,
        message: "You Logged In Successfully",
        user: { email: user.email },
      });
  } catch (error) {
    console.log("Something went wrong while login user", error);
    res.status(500).end("Something went wrong while login user");
  }
});


app.get("/logout", isLoggedIn, async (req, res) => {
  res.clearCookie("accessToken");
  // , " ", {
  //   httpOnly: true,
  //   secure: true, // Use `false` for localhost, `true` for production
  //   sameSite: "none",
  // });
  res.json({ message: "you logged out successfully." });
});


app.get("/profile", isLoggedIn, async (req, res) => {
  const { userId } = req.user;

  const user = await userModel.findOne({ _id: userId });

  if (!user) {
    return res.status(401);
  }

  res.json({
  user: req.user
  });
});


app.post("/create", isLoggedIn, async (req, res) => {
  try {
    const { name } = req.body;

    const isUser = await userModel.findOne({ _id: req.user.userId });
    const isProject = await projectModel.findOne({ name: req.body.name });

    if (!name) {
      return res
        .status(400)
        .json({ Error: true, message: "Please enter the name" });
    }
    if (!req.user.userId) {
      return res.status(500).json({
        Error: true,
        message: "Something went wrong please try again later",
      });
    }

    if (isProject) {
      return res
        .status(400)
        .json({ Error: true, message: "Project already Exist" });
    }

    const project = await projectModel.create({
      name,
      users: req.user.userId,
    });

    return res.status(200).json({
      project,
      message: "Project Created Successfully",
    });
  } catch (error) {
    console.log("Something went wrong while creating project", error);
    res.status(500).json("Something went wrong while creating project");
  }
});


app.get("/delete", async (req, res) => {
  await projectModel.deleteMany();
  res.send("project deleted");
});


app.get("/get-user-project", isLoggedIn, async (req, res) => {
  try {
    const projects = await projectModel.find({ users: req.user.userId });
    console.log(req.user)
    return res.status(200).json({
      projects: projects,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while fetching projects",
      error,
    });
  }
});


app.get("/project/:id",isLoggedIn,async(req,res)=>{

  try {
    const {id} = req.params

    if(!id){
      return res.status(400).json({
        message: "Something went wrong while fetching projects",
        error,
      });
    }

    const project = await projectModel.findOne({_id: id})

    return res.status(200).json({
      project
    });

  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while fetching project details",
      error,
    });
  }

})

app.get("/get-all-users",isLoggedIn,async(req,res)=>{

    try {
      const users = await userModel.find()
      return res.status(200).json({
        users
      })
    } catch (error) {
      return res.status(500).json({
        Error: true,
        message: "Something went wrong while fetching the users."
      })
    }
})


app.put("/add-user/:projectId", isLoggedIn, async (req, res) => {
try {
  
    const {collaboratorEmail} = req.body
  
  
    if(!collaboratorEmail){
      return res.status(400).json({
        Error: true,
        message: "Please enter the E-Mail of Collaborator."
      })
    }
  
    if(!req.params.projectId){
      return res.status(400).json({
        Error: true,
        message: "Please select a Project."
      })
    }
  
    const findCollaborator = await userModel.findOne({email: collaboratorEmail})
  
   if (!findCollaborator){
      return res.status(400).json({
        Error: true,
        message: "User not found."
      })
    }
  
    const updateProject = await projectModel.findOne({_id: req.params.projectId })
    
    if(!updateProject){
      return res.status(500).json({
        Error: true,
        message: "Some error occured while updating the project. Please try again later."
      })
    }

   if (updateProject.users.some(e => e.toString() === findCollaborator._id.toString())) {
  return res.status(400).json({
    Error: true,
    message: "User already a collaborator."
  });
}

    updateProject.users.push(findCollaborator._id)
    await updateProject.save()
  
    return res.status(200).json({
      updateProject,
      message: "Collaborator added successfully."
    })
  
} catch (error) {
  return res.status(500).json({
    message: "Something went wrong while adding collaborator projects",
    error,
  });
}
});


app.listen(process.env.PORT || 3000);
