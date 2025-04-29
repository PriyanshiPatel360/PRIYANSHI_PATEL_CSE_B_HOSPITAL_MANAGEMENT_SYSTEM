const express = require("express");

// Use mock database directly
const mockDb = global.mongoose;
const router = express.Router();

// Get All Approved Doctors
router.get("/", async (req, res) => {
    try {
        // Get all users and filter for approved doctors
        const allUsers = mockDb.getUsers();
        const doctors = allUsers.filter(user => 
            user.role === "doctor" && user.approved === true
        );
        res.json(doctors);
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ msg: "Server Error" });
    }
});

// Get Doctor Details by ID
router.get("/:id", async (req, res) => {
    try {
        // Get all users and find the doctor with matching ID
        const allUsers = mockDb.getUsers();
        const doctor = allUsers.find(user => 
            user._id === req.params.id && user.role === "doctor"
        );
        
        if (!doctor) {
            return res.status(404).json({ msg: "Doctor not found" });
        }
        
        // Return doctor without password
        const { password, ...doctorWithoutPassword } = doctor;
        res.json(doctorWithoutPassword);
    } catch (error) {
        console.error("Error fetching doctor details:", error);
        res.status(500).json({ msg: "Server Error" });
    }
});

module.exports = router;
