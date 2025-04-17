import { generateToken } from "../lib/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async ( req , res ) => {
    // fetch info
    const { email , fullname , password } = req.body;
   try {

    if( !fullname || !email || !password ) {
        return res.status(400).json({message: "All fields are required"});
    }

    //  hash password
    if( password.length < 6 ){
        return res.status(400).json({message: "Password must be at least 6 characters"});
    }

    const user = await User.findOne({email});

    // email exist
    if( user ) return res.status(400).json({message: "Email already exists"}); 

    const salt = await bcrypt.genSalt(10);

    // 455555 -> convert it into hash eg: wwur_122_@2
    const hashedPassword = await bcrypt.hash(password , salt);
    
    const newUser = new User({
        fullname,
        email,
        password: hashedPassword,
    });

    if( newUser ) {
        // generate jwt token

        generateToken(newUser._id , res);
        // save user
        await newUser.save();

        res.status(201).json({
            _id: newUser._id,
            fullname: newUser.fullname,
            email: newUser.email,
            profilePic: newUser.profilePic,
        })


    } else {
        res.status(400).json({message: "Invalid user data"});
    }


   } catch (error) {
        console.log("Error in signup controller" , error.message);
        res.status(500).json({message: "Internal server error"});
   }
}

export const login = async ( req , res ) => {
  
    const { email , password } = req.body;
  
    try {
        const user = await User.findOne({email});

        if( !user ) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        // check password
        // ( user send , in database ) 
        const isPasswordCorrect = await bcrypt.compare(password , user.password)

        if( !isPasswordCorrect ) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        // if password and email is correct generate token

        generateToken(user._id , res);

        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            profilePic: user.profilePic,
        })

    } catch (error) {
        console.log("Error in login controller" , error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

// is user is logging out -> clear cookies
export const logout = ( req , res ) => {
    try {
        res.cookie("jwt" , "" , {maxAge: 0});
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        console.log("Error in logout controller" , error.message);
        res.status(500).json({message: "Internal server error"});
    }
}