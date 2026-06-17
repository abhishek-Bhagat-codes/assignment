// importing modules
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// modules 
const User = require("../models/UserModel")

//-----------------------------------------------------------------------------------
// utlity functions 
//-----------------------------------------------------------------------------------
function normalizeEmail(email) {
  email = email.trim().toLowerCase();
  const [localPart, domain] = email.split("@");
  if (domain === "gmail.com" || domain === "googlemail.com") {
    return `${localPart.split("+")[0].replace(/\./g, "")}@gmail.com`;
  }
  return email;
}

function normalizeUsername(username){
    username = username.trim().toLowerCase();
    return username;
}

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const checkIsUserExist = async (username, email) => {
  const user = await User.findOne({
    $or: [
      { username },
      { email }
    ]
  });
  return user;
};

// create loginToken using JWT 
const generateToken = (user) => {
  return jwt.sign(
    {
      user_id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d", //In this example, the token will expire in 1 day. You can adjust this as needed.
    }
  );
};

//-----------------------------------------------------------------------------------
// controllers functions
//-----------------------------------------------------------------------------------

// signUp
const signUp = async (req,res)=>{
    const {username,password,email,role} = req.body;
    if(!username || !password || !email){
        return res.status(400).json({
            status:"not ok",
            message:"username,email,password and role are required for signUp"
        })
    }
    userRole = role;
    if(!userRole){
        userRole = "user"
    }

    if(password.length<6){
        return res.status(400).json({
            status:"not ok",
            message:"password must be morethen 6 characters."
        })
    }
    else{
        compatableEmail = await normalizeEmail(email);
        compatableUsername = await normalizeUsername(username);
        userExist = await checkIsUserExist(compatableUsername,compatableEmail);
        if(userExist){
            return res.status(400).json({
                status:"not Ok",
                message:"username or email is not avlable"
            })
        }
        hashedPassword = await hashPassword(password);
        // create new user 
        user = await User.create({
            username:compatableUsername,
            email:compatableEmail,
            password:hashedPassword,
            role:userRole
        })
        const tocken = await generateToken(user)
        return res.status(201).json({
           status:"Created",
           message:"new user created.",
            userInfo:{
                username:user.username,
                email:user.email,
                user_id:user._id,
                role:user.role
           },
           tocken
        })
    }
}

// login
const login = async (req,res) =>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({
            status:"not Ok",
            message:"email and password both required"
        })
    }
    let normalizedEmail  = await normalizeEmail(email);
    let userExist = await User.findOne({email:normalizedEmail});
    if(!userExist){
        return res.status(400).json({
            status:"not Ok",
            message:"user not found"
        })
    }
    else{
        userHashedPassword = userExist.password;
        const passwordMatch = await comparePassword(password, userHashedPassword);
        if(!passwordMatch){
            return res.status(400).json({
                status:"not Ok",
                message:"Invalid password"
            })
        }
        userInfo = {
            _id:userExist._id,
            username:userExist.username,
            email:userExist.email,
            role:userExist.role
        }
        tocken = generateToken(userInfo);
        return res.status(200).json({
            status:"Ok",
            message:"Loged in",
            tocken
        })
    }
}




module.exports = {signUp,login}