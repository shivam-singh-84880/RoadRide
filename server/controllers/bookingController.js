import Booking from "../models/Booking.js";
import Car from "../models/Car.js";


const checkAvailability = async (car, pickupDate, returnDate) => {
    const bookings = await Booking.find({
        car,
        pickupDate: {$lte: returnDate},
        returnDate: {$gte: pickupDate}
    });
    return bookings.length === 0;
}


export const checkAvailabilityOfCar = async (req, res) => {
    try {
        const { location, pickupDate, returnDate } = req.body;
        const cars = await Car.find({ location, isAvailable: true });

        const availableCarsPromises = cars.map(async (car) => {
            const isAvailable = await checkAvailability(car._id, pickupDate, returnDate);
            return {...car._doc, isAvailable : isAvailable};
        });

        let availableCars = await Promise.all(availableCarsPromises);
        availableCars = availableCars.filter(car => car.isAvailable === true);

        if (availableCars.length === 0) {
            return res.status(404).json({ message: "No cars available for the selected dates." });
        }

        res.status(200).json({ success: true, availableCars });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}



export const createBooking = async (req, res) => {
    try {
        const { _id } = req.user;
        const { car, pickupDate, returnDate } = req.body;

        const isAvailable = await checkAvailability(car, pickupDate, returnDate);
        if (!isAvailable) {
            return res.status(400).json({ success: false, message: "Car is not available for the selected dates." });
        }

        const carData = await Car.findById(car);

        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);

        const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));
        const price = noOfDays * carData.pricePerDay;

        await Booking.create({
            owner: carData.owner,
            user: _id,
            car,
            pickupDate,
            returnDate,
            price
        });
        res.status(201).json({ success: true, message: "Booking created successfully." });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}


export const getUserBookings = async (req, res) => {
    try {
        const { _id } = req.user;
        const bookings = await Booking.find({ user: _id }).populate("car").sort({ createdAt: -1 });
        res.status(200).json({ success: true, bookings });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}


export const getOwnerBookings = async (req, res) => {
    try {
       if(req.user.role !== "owner") {
           return res.status(403).json({ success: false, message: "Access denied." });
       }
       const { _id } = req.user;
       const bookings = await Booking.find({ owner: _id }).populate('car user').select("-user.password").sort({ createdAt: -1 });
       res.status(200).json({ success: true, bookings });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}


export const changeBookingStatus = async (req, res) => {
    try {
        const { bookingId, status } = req.body;
        const { _id } = req.user;

        if (req.user.role !== "owner") {
            return res.status(403).json({ success: false, message: "Access denied." });
        }

        const booking = await Booking.findById(bookingId);
        if (booking.owner.toString() !== _id.toString()) {
            return res.status(403).json({ success: false, message: "Access denied." });
        }

        booking.status = status;
        await booking.save();

        res.status(200).json({ success: true, message: "Booking status updated successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

