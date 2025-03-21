import jwt from "jsonwebtoken"

function isLoggedIn(req, res, next){
   try {
      let accessToken = req.headers['accesstoken']
     let data = jwt.verify(accessToken, "lslsdlsdlsfndnvlsklskdssldsldsl")
    if(data){
     req.user = {data, accessToken : accessToken}
    }
    next()
   } catch (error) {
    console.error("Error verifying token:", error);
    res.status(403).json({ message: "Invalid or expired token" });
   }
}   

export default isLoggedIn
