// this is where the functions to register and login a user will exist
// these functions will be utilized in the router for authentication in auth.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require('dotenv').config();

const tempSecret = process.env.APP_SECRET // to be moved into the backend
const saltRounds = 10; //How much randomness we sprinkle into the password

//self note that  exports. already exists in a module and is given the value of module.exports before module is evaluated
exports.registerUser = async (req, res) => {
    const { email, username, password } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email }});
    if(existingUser)
        return res.status(400).json({ErrorMsg: "Email Already Exists"})

    //valid email verification will be removed for now till a later date
    if(password.includes(username))
        return res.status(400).json({ErrorMsg: "Password contains Username"});

    emailName = email.substring(0,email.indexOf("@"));// get part of email without the domain
    if(password.includes(email))
        return res.status(400).json({ErrorMsg: "Password contains Email"});

    const salt = await bcrypt.genSalt(saltRounds);
    let passwordHash = await bcrypt.hash(password,salt)
    await prisma.user.create({
        data:{
            email,
            username,
            password: passwordHash
        }
    });

    return res.json({message: "success"});

} 
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email }});
    if(!user)
        return res.status(400).json({ErrorMsg: "User not found"});

    const passwordMatch = await bcrypt.compare(password, user.password)

    if(!passwordMatch)
        return res.status(400).json({ErrorMsg: "Incorrect Password"});

    //sign token
    const token = jwt.sign({ userId: user.id },tempSecret );

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    }).status(200).json({email: user.email, username: user.username, createdAt: user.createdAt});

}


exports.logoutUser = async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: true,
        sameSite: "none"
    }).send();
}

//check if user is logged in
exports.getLoggedInUser = async (req,res) =>{
    const { verifyUser } = require('../middleware/auth');
    const userId = verifyUser(req);

    if(!userId)
        return res.status(200).json({loggedIn: false, user: null});

    const user = await prisma.user.findUnique({ where: { id: userId}});
    if (!user) 
        return res.status(404).json({loggedIn: false});

    res.status(200).json({
        loggedIn: true,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt
    })

}