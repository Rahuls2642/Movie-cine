import asyncHandler from "../utils/asyncHandler.js"
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
export const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body;
     if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email and password are required' });
  }

   const normalEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({email: normalEmail});
    if (existingUser) {
        return res.status(404).json({ message: 'Email already registered' });
    }  
    const user = new User({name, email:normalEmail, password});
    await user.save();
    res.status(201).json({message: 'User registered successfully'});        
});

export const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
       
     if(!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
    }
    const normalEmail = email.toLowerCase().trim();
    const user = await User.findOne({email: normalEmail});
    if (!user) {
         return res.status(404).json({ message: 'Invalid Email or password' });
    }
    const isMatch = await user.comparePassword(password);       
    if (!isMatch) {
        return res.status(404).json({ message: 'Invalid Email or password' });
    }
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'});
    res.json({token, user: user.toJSON()});        
}
);
