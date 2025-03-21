import express from "express";
const app = express();
import cors from "cors";
import mongoose from "mongoose";
import userModel from "./models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import isLoggedIn from "./middlewares/isLoggedIn.middleware.js";
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

 
  var corsOptions = {
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, 
  };

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions))


app.get("/", async(req, res) => {
  res.send("hello saizan khan");
});

app.post("/register", async (req, res) => {
  try {
    const { email, password,username, name } = req.body;

    if (!email || !password || !username || !name) {
      return res
        .status(400)
        .json({ Error: true, message: "All fields are required" });
    }

    const isUser = await userModel.findOne({ $or: [{ email }, { username }] });
    if (isUser) {
      return res
        .status(400)
        .json({ Error: true, message: "User already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      email,
      username,
      name,
      password: hashedPassword,
    });
    await newUser.save();

    const accessToken = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      "lslsdlsdlsfndnvlsklskdssldsldsl"
    );

    return res
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
    const { identifier, password } = req.body;

    if (!identifier || !password)
      return res
        .status(400)
        .json({ Error: true, message: "All fields are required " });

    let user = await userModel.findOne({ $or: [{ email: req.body.identifier }, { username: req.body.identifier }] });
    if (!user){
      return res.status(400).json({ Error: true, message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      "lslsdlsdlsfndnvlsklskdssldsldsl"
    );

    return res
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


app.get("/profile", isLoggedIn, async (req, res) => {
  const { userId } = req.user.data;

  const user = await userModel.findOne({ _id: userId });
  if (!user) {
    return res.status(401);
  }

  res.json({
    user
  });

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

app.delete("/delete-question/:id", isLoggedIn, async(req,res)=>{

  try {
    const {id} = req.params
    const deleteque = await QuestionsModel.findOneAndDelete({_id: id})
  } catch (error) {
    res.status(500).json({
      message :"Something went wrong while deleting the message"
    })
  }

})


app.get("/user/:id", isLoggedIn, async(req,res)=>{
  const {id} = req.params
  const user = await userModel.findById(id)

  res.json({
    user
  })
})


app.listen(process.env.PORT || 3000)
