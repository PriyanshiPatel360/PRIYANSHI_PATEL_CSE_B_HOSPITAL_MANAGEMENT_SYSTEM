const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Use mock database directly since it's set in global.mongoose
const mockDb = global.mongoose;
const router = express.Router();

// User Registration
router.post("/register", async (req, res) => {
    try {
        console.log("Registration attempt for:", req.body.email);
        const { name, email, password, role } = req.body;

        // Check if user exists in mock database
        const existingUsers = mockDb.getUsers();
        const userExists = existingUsers.find(user => user.email === email);
        
        if (userExists) {
            return res.status(400).json({ msg: "User already exists" });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create New User with unique ID
        const userId = 'user_' + Date.now();
        const newUser = {
            _id: userId,
            name, 
            email, 
            password: hashedPassword, 
            role,
            approved: role === 'doctor' ? false : true // Doctors need approval
        };
        
        // Add user to mock database
        mockDb.addUser(newUser);
        
        // Generate Token
        const token = jwt.sign(
            { id: userId, role: role }, 
            process.env.JWT_SECRET || "secretKey", 
            { expiresIn: "1h" }
        );
        
        console.log("User registered successfully:", email);
        
        // Return user data with token
        return res.status(201).json({ 
            msg: "User registered successfully", 
            token,
            user: { id: userId, name, email, role }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ msg: "Server Error during registration" });
    }
});

// User Login
router.post("/login", async (req, res) => {
    try {
        console.log("Login attempt for:", req.body.email);
        const { email, password } = req.body;

        // Get all users from mock database
        const users = mockDb.getUsers();
        const user = users.find(u => u.email === email);
        
        if (!user) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        // Compare Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        // Generate Token
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET || "secretKey", 
            { expiresIn: "1h" }
        );

        console.log("User logged in successfully:", email);
        
        res.json({ 
            token, 
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                role: user.role 
            } 
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ msg: "Server Error during login" });
    }
});

module.exports = router;
