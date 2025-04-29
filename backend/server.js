const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();

// Use the mock database directly instead of mongoose
const mockDb = require('./utils/mockDb');
global.mongoose = mockDb;

// Import routes after setting up the database
const authRoutes = require("./routes/auth");
const appointmentRoutes = require("./routes/appointments");
const adminRoutes = require("./routes/admin");
const doctorRoutes = require("./routes/doctors");

const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(cors());

// Using mock database for development
console.log("Using mock database for development...");

// Initialize the mock database
mockDb.connect();

// Sample Route
app.get("/", (req, res) => {
    res.send("E-Healthcare Backend Running");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/doctors", doctorRoutes);

const PORT = process.env.PORT || 5000;


// Setup Socket.io
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("callUser", (data) => {
        io.to(data.userToCall).emit("callIncoming", { from: data.from });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});





// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));



