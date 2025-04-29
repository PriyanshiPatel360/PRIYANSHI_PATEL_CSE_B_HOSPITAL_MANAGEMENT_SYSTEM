const express = require("express");

// Use mock database directly
const mockDb = global.mongoose;
const router = express.Router();

// Approve Doctor
router.put("/approve-doctor/:id", async (req, res) => {
    try {
        // Get all users from mock database
        const users = mockDb.getUsers();
        
        // Find doctor by ID
        const doctorIndex = users.findIndex(user => 
            user._id === req.params.id && user.role === "doctor"
        );
        
        if (doctorIndex === -1) {
            return res.status(400).json({ msg: "Doctor not found" });
        }
        
        // Update the doctor's approved status
        users[doctorIndex].approved = true;
        
        console.log("Doctor approved successfully:", users[doctorIndex].email);
        res.json({ msg: "Doctor approved successfully" });
    } catch (error) {
        console.error("Error approving doctor:", error);
        res.status(500).json({ msg: "Server Error" });
    }
});

// Get Unapproved Doctors
router.get("/unapproved-doctors", async (req, res) => {
    try {
        // Get all users from mock database
        const users = mockDb.getUsers();
        
        // Filter unapproved doctors
        const unapprovedDoctors = users.filter(user => 
            user.role === "doctor" && user.approved === false
        );
        
        console.log(`Found ${unapprovedDoctors.length} unapproved doctors`);
        res.json(unapprovedDoctors);
    } catch (error) {
        console.error("Error fetching unapproved doctors:", error);
        res.status(500).json({ msg: "Server Error" });
    }
});

module.exports = router;


