const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Approve Doctor
router.put("/approve-doctor/:id", async (req, res) => {
    try {
        const doctor = await User.findById(req.params.id);
        if (!doctor || doctor.role !== "doctor") return res.status(400).json({ msg: "Doctor not found" });

        doctor.approved = true;
        await doctor.save();

        res.json({ msg: "Doctor approved successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Server Error" });
    }
});

// Get Unapproved Doctors
router.get("/unapproved-doctors", async (req, res) => {
    try {
        const doctors = await User.find({ role: "doctor", approved: false });
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ msg: "Server Error" });
    }
});

module.exports = router;


