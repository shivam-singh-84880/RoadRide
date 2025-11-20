import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    const token = req.headers.authorization;
    if(!token){
        return res.json({ success: false, message: "Not Authorized token not found" });
    }
    try{
        const decoded = jwt.decode(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        if(!userId){
            return res.json({success:false, message: "Not Authorized user id not found"});
        }
        req.user = await User.findById(userId).select("-password");
        next();
    } catch (error) {
        return res.json({ success: false, message: "Not Authorized catch block" });
    }
}


// const authHeader = req.headers.authorization || req.headers.Authorization;
//     if (!authHeader) {
//         return res.status(401).json({ success: false, message: "Not Authorized: token not found" });
//     }

//     // strip "Bearer " if present
//     const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

//     try {
//         // verify the token (will throw if invalid/expired)
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // decoded may contain id, userId or _id depending on how you signed the token
//         const userId = decoded.id || decoded.userId || decoded._id;
//         if (!userId) {
//             return res.status(401).json({ success: false, message: "Not Authorized: user id not found in token" });
//         }

//         req.user = await User.findById(userId).select("-password");
//         if (!req.user) {
//             return res.status(401).json({ success: false, message: "Not Authorized: user not found" });
//         }

//         next();
//     } catch (error) {
//         console.error("Auth middleware error:", error.message || error);
//         return res.status(401).json({ success: false, message: "Not Authorized: invalid token" });
//     }