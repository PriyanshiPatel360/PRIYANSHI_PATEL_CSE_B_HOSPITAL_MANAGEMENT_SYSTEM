const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Sample Route
app.get("/", (req, res) => {
    res.send("E-Healthcare Backend Running");
});

// Routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const appointmentRoutes = require("./routes/appointments");
app.use("/api/appointments", appointmentRoutes);

const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);


const http = require("http");
const socketIo = require("socket.io");

const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("callUser", (data) => {
        io.to(data.userToCall).emit("callIncoming", { from: data.from });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});





// Removed duplicate PORT declaration and listen call



