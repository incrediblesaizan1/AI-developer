import express from "express"
const app = express()
import cors from "cors"

const allowedOrigins =  [
    "http://localhost:5173",
    "https://incrediblesaizan1-ai-developer.vercel.app", 
    ];
  

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          console.log("Blocked origin:", origin);
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
    );  
app.options("*", cors());


app.get("/", (req, res)=>{
    res.send("hello world")
})

app.listen(process.env.PORT || 3000)