const jwt = require("jsonwebtoken")
require("dotenv").config();

const jwtsecret = "cat123"; 
function jwtGenerator(id){
    const payload= {
        user:{
            id:id
        }
    }

    return jwt.sign(payload,jwtsecret,{expiresIn:"1hr"})
}

module.exports= jwtGenerator;
