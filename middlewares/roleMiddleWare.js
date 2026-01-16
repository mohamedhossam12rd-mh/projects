const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");


dotenv.config();

const roleMiddleWare = (...roles)=>{
    return(request , response , next)=>{

        if(!request.user.role){
            return response.status(401).json({ message: "Unauthorized" });
        }
        const role = request.user.role

        const exist = roles.includes(role)

        if(!exist){
            return response.status(403).json({message : "Access Denide"})

        }
        next()
    }
}

module.exports = {roleMiddleWare}