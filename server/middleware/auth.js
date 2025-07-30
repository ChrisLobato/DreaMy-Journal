const jwt = require("jsonwebtoken")
require('dotenv').config();
//middle ware for authentication
//This is to decouple the authentication methods that would verify or sign the token
const tempSecret = process.env.APP_SECRET //swap with environment variable

function authMiddleware(req, res, next) {
        //this is where we verify the token
        try {
            const token = req.cookies.token;
            //check if it exists and was sent with the request
            if (!token) {
                return res.status(401).json({
                    loggedIn: false,
                    user: null,
                    errorMessage: "Unauthorized"
                })
            }
            //Verify here with the secret
            const decodedToken = jwt.verify(token, tempSecret);
            req.userId = decodedToken.userId; //set the request user id to the verfied user id
            next();
        } catch (err) {
            console.error(err);
            return res.status(401).json({
                loggedIn: false,
                user: null,
                errorMessage: "Unauthorized"
            });
        }
    }

//return user id without express middleware
function verifyUser (req) {
        try {
            const token = req.cookies.token;
            if (!token) {
                return null;
            }

            const decodedToken = jwt.verify(token, tempSecret);
            return decodedToken.userId;
        } catch (err) {
            return null;
        }
    }



module.exports = {
    authMiddleware,
    verifyUser
}
