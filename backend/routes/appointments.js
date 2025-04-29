const express = require("express");
const Appointment = require("../models/Appointment");

const router = express.Router();

const sendEmail = require("../utils/email");

// Book an Appointment (Modify this function)
router.post("/book", async (req, res) => {
    try {
        const { patientId, doctorId, date, time } = req.body;

        const appointment = new Appointment({ patientId, doctorId, date, time });
        await appointment.save();

        // Fetch Patient & Doctor details
        const patient = await User.findById(patientId);
        const doctor = await User.findById(doctorId);

        // Send Email to Patient & Doctor
        sendEmail(patient.email, "Appointment Confirmation", `Your appointment with Dr. ${doctor.name} is on ${date} at ${time}`);
        sendEmail(doctor.email, "New Appointment", `You have a new appointment with ${patient.name} on ${date} at ${time}`);

        res.status(201).json({ msg: "Appointment booked successfully, email sent" });
    } catch (error) {
        res.status(500).json({ msg: "Server Error" });
    }
});


// Get Appointments for a User
router.get("/:userId", async (req, res) => {
    try {
        const appointments = await Appointment.find({ patientId: req.params.userId }).populate("doctorId", "name email");
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ msg: "Server Error" });
    }
});

module.exports = router;

