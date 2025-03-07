import jwt from "jsonwebtoken"

function isLoggedIn(req, res, next){
   try {
     if(!req.cookies.accessToken) return res.status(400).json({message: "You must be loggedIn "})
     let data = jwt.verify(req.cookies.accessToken, "lslsdlsdlsfndnvlsklskdssldsldsl")
    if(data){
     req.user = {data, accessToken : req.cookies.accessToken}
    }
    next()
   } catch (error) {
    console.error("Error verifying token:", error);
    res.status(403).json({ message: "Invalid or expired token" });
   }
}   

export default isLoggedIn