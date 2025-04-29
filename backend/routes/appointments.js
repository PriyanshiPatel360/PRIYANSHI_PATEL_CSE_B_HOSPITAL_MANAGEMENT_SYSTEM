const express = require("express");

// Use mock database directly
const mockDb = global.mongoose;
const router = express.Router();

const sendEmail = require("../utils/email");

// Book an Appointment
router.post("/book", async (req, res) => {
    try {
        const { patientId, doctorId, date, time } = req.body;

        // Get users from mock database
        const users = mockDb.getUsers();
        const patient = users.find(user => user._id === patientId);
        const doctor = users.find(user => user._id === doctorId);

        if (!patient || !doctor) {
            return res.status(400).json({ msg: "Invalid patient or doctor ID" });
        }

        // Create new appointment with unique ID
        const appointmentId = 'appointment_' + Date.now();
        const appointment = { 
            _id: appointmentId,
            patientId, 
            doctorId, 
            date, 
            time 
        };

        // Add appointment to mock database
        mockDb.addAppointment(appointment);

        // Send Email to Patient & Doctor
        sendEmail(patient.email, "Appointment Confirmation", `Your appointment with Dr. ${doctor.name} is on ${date} at ${time}`);
        sendEmail(doctor.email, "New Appointment", `You have a new appointment with ${patient.name} on ${date} at ${time}`);

        console.log(`Appointment booked successfully for ${patient.name} with Dr. ${doctor.name}`);
        res.status(201).json({ msg: "Appointment booked successfully, email sent" });
    } catch (error) {
        console.error("Error booking appointment:", error);
        res.status(500).json({ msg: "Server Error" });
    }
});


// Get Appointments for a User
router.get("/:userId", async (req, res) => {
    try {
        // Get appointments from mock database
        const allAppointments = mockDb.getAppointments();
        const users = mockDb.getUsers();
        
        // Filter appointments for the user
        const userAppointments = allAppointments.filter(appointment => 
            appointment.patientId === req.params.userId
        );
        
        // Populate with doctor information
        const populatedAppointments = userAppointments.map(appointment => {
            const doctor = users.find(user => user._id === appointment.doctorId);
            return {
                ...appointment,
                doctorId: doctor ? { name: doctor.name, email: doctor.email } : null
            };
        });
        
        console.log(`Found ${populatedAppointments.length} appointments for user ${req.params.userId}`);
        res.json(populatedAppointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ msg: "Server Error" });
    }
});

module.exports = router;

