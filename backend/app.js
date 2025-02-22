import express from "express"
const app = express()
import cors from "cors"
import mongoose from "mongoose";
import userModel from "./models/user.model.js"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import cookieParser from "cookie-parser"
import isLoggedIn from "./middlewares/isLoggedIn.middleware.js";

mongoose
  .connect(
    `mongodb+srv://incrediblesaizan22:9Ou5yvpxbfcDk2vy@ai-developer.gxqxj.mongodb.net/?retryWrites=true&w=majority&appName=AI-developer`
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



app.get("/", (req, res)=>{
    res.send("hello saizan khan")
})

app.post("/register", async(req,res)=>{

    try{
    
    const {email, password} = req.body;


    if (!email || !password) {
        return res
          .status(400)  
          .json({ Error: true, message: "All fields are required" });
      }

    const isUser = await userModel.findOne({email});
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
        { userId: newUser._id },
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
})


app.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password)
        return res
          .status(400)
          .json({ Error: true, message: "All fields are required " });
  
      let user = await userModel.findOne({email});
      if (!user)
        return res.status(400).json({ Error: true, message: "User not found" });
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }
  
      const accessToken = jwt.sign(
        { userId: user._id },
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
    // res.send("hello you are logged in")
    } catch (error) {
      console.log("Something went wrong while login user", error);
      res.status(500).end("Something went wrong while login user");
    }
  });


app.get("/logout", isLoggedIn, async (req, res) => {
    res.clearCookie("accessToken")
    // , " ", {
    //   httpOnly: true,
    //   secure: true, // Use `false` for localhost, `true` for production
    //   sameSite: "none",
    // });
    res.json({ message: "you logged out successfully." });
  });


app.get("/profile", isLoggedIn,async(req,res)=>{

 const {userId} = req.user

    const user = await userModel.findOne({_id: userId})

    if (!user) {
        return res.status(401);
      }

    res.json({
        user
    })

})



app.listen(process.env.PORT || 3000)