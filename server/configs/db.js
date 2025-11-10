import mongoose from "mongoose"

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/RoadRide`);
        console.log("MongoDB connected");
    } catch (err) {
        console.log("MongoDB connection error:", err);
    }
}

export default connectDB;
