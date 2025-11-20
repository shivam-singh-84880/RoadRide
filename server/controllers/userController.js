import User from "../models/User.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import Car from "../models/Car.js";

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET);
};

export const registerUser = async (req, res) => {
    const { name, email, password} = req.body;

    try {
        if(!name || !email || !password || password.length<6) {
            return res.status(400).json({success:false, message: "All fields are required and password must be at least 6 characters long" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashedPassword});

        const token = generateToken(user._id).toString();

        res.json({
            success: true,
            message: "User registered successfully",
            token
        });

    } catch (error) {
        res.json({ success:false, message: "Error registering user", error });
    }
};


export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User does not exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        const token = generateToken(user._id).toString();

        res.json({
            success: true,
            message: "User logged in successfully",
            token
        });
    } catch (error) {
        return res.json({ success: false, message: "Error logging in user", error });
    }
};

export const getUserData = async (req, res) => {
    try {
        const {user} = req;
        res.json({ success: true, user });
    } catch (error) {
        return res.json({ success: false, message: "Error fetching user data", error });
    }
};

//Get all cars for the frontend
export const getCars = async (req, res) => {
    try {
        const cars = await Car.find({isAvailable: true});
        res.status(200).json({ success: true, cars });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
