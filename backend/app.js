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
import { createServer } from "http";
import { Server } from "socket.io";
import {generateResponse} from "./ai.service.js"
import QuestionsModel from "./models/questions.model.js";

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
    "http://localhost:5174",
    "https://incrediblesaizan1-ai-developer.vercel.app",
  ];

// const server = createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: [
//       "http://localhost:5173",
//       "https://incrediblesaizan1-ai-developer.vercel.app",
//     ],
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   const projectId = socket.handshake.query.projectId;

//   socket.join(projectId);

//   socket.on("project-message", (data) => {
//     socket.to(projectId).emit("project-message", data);
//   });
// });

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


// io.use(async (socket, next) => {
//   try {
//     let token = socket.handshake.auth?.Authorization;

//     if (!token && socket.handshake.headers.authorization) {
//       const authHeader = socket.handshake.headers.authorization;
//       if (authHeader.startsWith("Bearer ")) {
//         token = authHeader.split(" ")[1];
//       }
//     }

//     if (!token) {
//       return next(new Error("Authentication Error: No token provided"));
//     }

//     const user = jwt.verify(
//       token.replace("Bearer ", ""),
//       "lslsdlsdlsfndnvlsklskdssldsldsl"
//     );

//     if (!user) {
//       return next(new Error("Authentication Error: Invalid token"));
//     }

//     socket.user = user;
//     next();
//   } catch (error) {
//     console.error("Socket Authentication Error:", error);
//     next(new Error("Authentication failed"));
//   }
// });

// io.on("connection", (socket) => {
//   const projectId = socket.handshake.query.projectId;
//   socket.join(projectId);

//   socket.on("project-message", (data) => {
//     console.log("Received message:", data);

//     socket.to(projectId).emit("project-message", data);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });

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
      { userId: newUser._id, email: newUser.email },
      "lslsdlsdlsfndnvlsklskdssldsldsl"
    );

    return res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true, // Use false for localhost, true for production
        sameSite: "none",
      })
      .status(200)
      .json({
        user: { email: newUser.email, accessToken },
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
        secure: true, // Use false for localhost, true for production
        sameSite: "none",
      })
      .status(200)
      .json({
        Error: false,
        message: "You Logged In Successfully",
        user: { email: user.email, accessToken },
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
  //   secure: true, // Use false for localhost, true for production
  //   sameSite: "none",
  // });
  res.json({ message: "you logged out successfully." });
});

app.get("/profile", isLoggedIn, async (req, res) => {
  const { userId } = req.user.data;

  const user = await userModel.findOne({ _id: userId });

  if (!user) {
    return res.status(401);
  }

  res.json({
    user: req.user,
  });
});

app.post("/create", isLoggedIn, async (req, res) => {
  try {
    const { name } = req.body;

    const isUser = await userModel.findOne({ _id: req.user.data.userId });
    const isProject = await projectModel.findOne({ name: req.body.name });

    if (!name) {
      return res
        .status(400)
        .json({ Error: true, message: "Please enter the name" });
    }
    if (!req.user.data.userId) {
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
      users: req.user.data.userId,
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

app.post("/prompt",isLoggedIn,async(req,res)=>{
  try {
    const question = req.body.prompt
  const { userId } = req.user.data;

    
    const data = await generateResponse(question) 
    res.send(data)
   await QuestionsModel.create({
    question: question,
    response: data,
     userId
    })
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }

})

app.get("/user-question", isLoggedIn,async(req,res)=>{

  try {
    const questions = await QuestionsModel.find({userId: req.user.data.userId})
    return res.status(200).json({questions})
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while fetching questions",
      error,
    }); 
  }

})

app.post("/find-question", isLoggedIn, async(req,res)=>{
  try {
    const quetionId = req.body.question

    const find = await QuestionsModel.findOne({_id: quetionId})

    return res.status(200).json({find})

  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while fetching questions",
      error,
    }); 
  }
})

app.get("/get-user-project", isLoggedIn, async (req, res) => {
  try {
    const projects = await projectModel.find({ users: req.user.data.userId });
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

app.get("/project/:id", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Something went wrong while fetching projects",
        error,
      });
    }

    const project = await projectModel.findOne({ _id: id });

    return res.status(200).json({
      project,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while fetching project details",
      error,
    });
  }
});

app.get("/colabUsers/:id", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Something went wrong while fetching projects",
        error,
      });
    }

    const project = await projectModel.findOne({ _id: id });

    const usersData = await Promise.all(
      project.users.map(async (e) => {
        return await userModel.findOne({ _id: e });
      })
    );

    res.status(200).json({
      usersData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while fetching project details",
      error,
    });
  }
});

app.get("/get-all-users", isLoggedIn, async (req, res) => {
  try {
    const users = await userModel.find();
    return res.status(200).json({
      users,
    });
  } catch (error) {
    return res.status(500).json({
      Error: true,
      message: "Something went wrong while fetching the users.",
    });
  }
});

app.put("/add-user/:projectId", isLoggedIn, async (req, res) => {
  try {
    const { collaboratorEmail } = req.body;

    if (!collaboratorEmail) {
      return res.status(400).json({
        Error: true,
        message: "Please enter the E-Mail of Collaborator.",
      });
    }

    if (!req.params.projectId) {
      return res.status(400).json({
        Error: true,
        message: "Please select a Project.",
      });
    }

    const findCollaborator = await userModel.findOne({
      email: collaboratorEmail,
    });

    if (!findCollaborator) {
      return res.status(400).json({
        Error: true,
        message: "User not found.",
      });
    }

    const updateProject = await projectModel.findOne({
      _id: req.params.projectId,
    });

    if (!updateProject) {
      return res.status(500).json({
        Error: true,
        message:
          "Some error occured while updating the project. Please try again later.",
      });
    }

    if (
      updateProject.users.some(
        (e) => e.toString() === findCollaborator._id.toString()
      )
    ) {
      return res.status(400).json({
        Error: true,
        message: "User already a collaborator.",
      });
    }

    updateProject.users.push(findCollaborator._id);
    await updateProject.save();

    return res.status(200).json({
      updateProject,
      message: "Collaborator added successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while adding collaborator projects",
      error,
    });
  }
});

app.get("/user/:id", isLoggedIn, async(req,res)=>{
  const {id} = req.params
  const user = await userModel.findById(id)

  res.json({
    user
  })
})

// server.listen(process.env.PORT || 3000);
app.listen(process.env.PORT || 3000)
