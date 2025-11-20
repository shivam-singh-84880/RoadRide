import imagekit from "../configs/imagekit.js";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import fs from 'fs'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export const changeRoleToOwner = async (req, res) => {
    try{
        const {_id} = req.user;
        await User.findByIdAndUpdate(_id, { role: "owner" });
        res.status(200).json({ success: true, message: "User role updated to owner" });
    } catch (error) {
        res.status(500).json({ success: false, message: "not authorized" });
    }
}


export const addCar = async (req, res) => {
    try {
        const {_id} = req.user;
        let car = JSON.parse(req.body.car);
        const imageFile = req.file;

        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/cars'
        });

        var optimizedImageUrl = imagekit.url({
            path : response.filePath,
            transformation: [
                {quality: "auto"},
                {width: "1280"},
                {format: "webp"}
            ]
        });

        const image = optimizedImageUrl;
        // await Car.create({ ...car, image, owner: _id });
        const carData = { ...car, image };
        carData.owner = _id;
        await Car.create(carData);

        res.status(201).json({ success: true, message: "Car added successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


export const getOwnerCars = async (req, res) => {
    try {
        const {_id} = req.user;
        const cars = await Car.find({ owner: _id });
        res.status(200).json({ success: true, cars });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


export const toggleCarAvailability = async (req, res) => {
    try {
        const {_id} = req.user;
        const { carId } = req.body;

        const car = await Car.findById(carId);

        if(car.owner.toString() !== _id.toString()) {
            return res.status(403).json({ success: false, message: "Not user car" });
        }

        car.isAvailable = !car.isAvailable;
        await car.save();

        res.json({ success: true, message: "Car availability toggled", car });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}




export const deleteCar = async (req, res) => {
    try {
        const {_id} = req.user;
        const { carId } = req.body;

        const car = await Car.findById(carId);

        if(car.owner.toString() !== _id.toString()) {
            return res.status(403).json({ success: false, message: "Not user car" });
        }

        await car.deleteOne();

        res.json({ success: true, message: "Car remove successfully" });

    } catch (error) {
        res.json({ success: false, message: "error at catch block delete car" });
    }
}


export const getDashboardData = async (req, res) => {
    try {
        const {_id,role} = req.user;
        if(role !== 'owner'){
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        const cars = await Car.find({ owner: _id });
        const bookings = await Booking.find({ owner: _id }).populate("car").sort({createdAt: -1});

        const pendingBookings = await Booking.find({ owner: _id, status: "pending" });
        const completedBookings = await Booking.find({ owner: _id, status: "confirmed" });

        const monthlyRevenue = bookings.slice().filter(booking => booking.status === "confirmed").reduce((acc, booking) => acc + booking.price, 0);

        const dashboardData = {
            totalCars : cars.length,
            totalBookings : bookings.length,
            totalPendingBookings : pendingBookings.length,
            totalCompletedBookings : completedBookings.length,
            recentBookings : bookings.slice(0, 3),
            monthlyRevenue
        };

        res.status(200).json({ success: true, dashboardData });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}



export const updateUserImage = async (req, res) => {
    try {
        const { _id } = req.user;
        const imageFile = req.file;

        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/users'
        });

        var optimizedImageUrl = imagekit.url({
            path : response.filePath,
            transformation: [
                {quality: "auto"},
                {width: "400"},
                {format: "webp"}
            ]
        });

        const image = optimizedImageUrl;
        await User.findByIdAndUpdate(_id, { image });

        res.status(200).json({ success: true, message: "User image updated successfully" });

    }catch(error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}