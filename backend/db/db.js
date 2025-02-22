import mongoose from "mongoose";

const connectDataBase = () =>{
    mongoose
  .connect(
    `mongodb+srv://incrediblesaizan22:9Ou5yvpxbfcDk2vy@ai-developer.gxqxj.mongodb.net/?retryWrites=true&w=majority&appName=AI-developer`
  )
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch(() => {
    console.log("MongoDB connection error:", error);
  });
}

export default connectDataBase