// API Base URL
const API_URL = "http://localhost:5000/api";



// Register User
async function registerUser() {
    try {
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const role = document.getElementById("role").value;
        
        if (!name || !email || !password || !role) {
            alert("Please fill in all fields");
            return;
        }
        
        // Show loading indicator
        const submitBtn = document.querySelector("#register-form button[type='submit']");
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Registering...";
        }
        
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, role }),
        });

        const data = await response.json();
        
        if (response.ok) {
            alert(data.msg);
            
            // The backend now returns a token and user info on successful registration
            if (data.token && data.user) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                window.location.href = "dashboard.html"; // Redirect to dashboard directly
            } else {
                window.location.href = "login.html"; // Fallback to login page if no token
            }
        } else {
            alert(data.msg || "Registration failed");
            
            // Reset button
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = "Register";
            }
        }
    } catch (error) {
        console.error("Registration error:", error);
        alert("An error occurred during registration. Please try again.");
        
        // Reset submit button
        const submitBtn = document.querySelector("#register-form button[type='submit']");
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Register";
        }
    }
}

// Login User
async function loginUser() {
    try {
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        
        if (!email || !password) {
            alert("Please enter both email and password");
            return;
        }
        
        // Show loading indicator
        const submitBtn = document.querySelector("#login-form button[type='submit']");
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Logging in...";
        }

        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem("token", data.token); // Save token
            localStorage.setItem("user", JSON.stringify(data.user));
            alert("Login successful!");
            window.location.href = "dashboard.html"; // Redirect to dashboard
        } else {
            alert(data.msg || "Login failed");
            
            // Reset button
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = "Login";
            }
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("An error occurred during login. Please try again.");
        
        // Reset submit button
        const submitBtn = document.querySelector("#login-form button[type='submit']");
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Login";
        }
    }
}

// Logout
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("Logged out successfully!");
    window.location.href = "login.html";
}


// Get Logged-in User info if available
const user = JSON.parse(localStorage.getItem("user"));
if (user && document.getElementById("username")) {
    document.getElementById("username").innerText = user.name;
}

// Fetch Doctors for dropdown
async function fetchDoctors() {
    try {
        const response = await fetch(`${API_URL}/doctors`);
        const doctors = await response.json();
        
        let doctorDropdown = document.getElementById("doctor-list");
        if (doctorDropdown) {
            doctorDropdown.innerHTML = "";
            doctors.forEach(doctor => {
                let option = document.createElement("option");
                option.value = doctor._id;
                option.innerText = doctor.name;
                doctorDropdown.appendChild(option);
            });
        } else {
            console.log("Doctor list element not found on this page");
        }
    } catch (error) {
        console.error("Error fetching doctors:", error);
    }
}

// Book Appointment
async function bookAppointment() {
    try {
        const doctorId = document.getElementById("doctor-list").value;
        const date = document.getElementById("appointment-date").value;
        const time = document.getElementById("appointment-time").value;

        if (!user) {
            alert("Please login first!");
            window.location.href = "login.html";
            return;
        }

        const response = await fetch(`${API_URL}/appointments/book`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ patientId: user.id, doctorId, date, time }),
        });

        const data = await response.json();
        alert(data.msg);
        fetchAppointments(); // Refresh appointments list
    } catch (error) {
        console.error("Error booking appointment:", error);
        alert("Error booking appointment. Please try again.");
    }
}

// Fetch Appointments
async function fetchAppointments() {
    try {
        if (!user) {
            console.log("User not logged in");
            return;
        }

        const response = await fetch(`${API_URL}/appointments/${user.id}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        const appointments = await response.json();

        let appointmentsList = document.getElementById("appointments-list");
        if (appointmentsList) {
            appointmentsList.innerHTML = "";
            appointments.forEach(app => {
                let li = document.createElement("li");
                li.innerText = `Doctor: ${app.doctorId.name}, Date: ${app.date}, Time: ${app.time}`;
                appointmentsList.appendChild(li);
            });
        } else {
            console.log("Appointments list element not found on this page");
        }
    } catch (error) {
        console.error("Error fetching appointments:", error);
    }
}

// Initialize page based on current location
document.addEventListener("DOMContentLoaded", function() {
    // Check which page we're on and load the appropriate data
    const currentPath = window.location.pathname;
    
    if (currentPath.includes("dashboard.html")) {
        fetchAppointments();
    }
    
    if (currentPath.includes("appointment.html")) {
        fetchDoctors();
    }
    
    if (currentPath.includes("admin.html") && user && user.role === "admin") {
        fetchUnapprovedDoctors();
    }
});

// Add event listeners to forms
document.addEventListener("DOMContentLoaded", function() {
    // Registration form
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", function(e) {
            e.preventDefault();
            registerUser();
        });
    }
    
    // Login form
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", function(e) {
            e.preventDefault();
            loginUser();
        });
    }
    
    // Appointment form
    const appointmentForm = document.getElementById("appointment-form");
    if (appointmentForm) {
        appointmentForm.addEventListener("submit", function(e) {
            e.preventDefault();
            bookAppointment();
        });
    }
});



// Fetch Unapproved Doctors
async function fetchUnapprovedDoctors() {
    try {
        if (!user || user.role !== "admin") {
            console.log("User is not an admin");
            return;
        }
        
        const response = await fetch(`${API_URL}/admin/unapproved-doctors`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        const doctors = await response.json();

        let doctorList = document.getElementById("unapproved-doctors");
        if (doctorList) {
            doctorList.innerHTML = "";

            if (doctors.length === 0) {
                doctorList.innerHTML = "<p>No unapproved doctors at this time.</p>";
                return;
            }

            doctors.forEach(doctor => {
                let li = document.createElement("li");
                li.innerHTML = `${doctor.name} (${doctor.email}) 
                    <button onclick="approveDoctor('${doctor._id}')">Approve</button>`;
                doctorList.appendChild(li);
            });
        } else {
            console.log("Unapproved doctors list element not found on this page");
        }
    } catch (error) {
        console.error("Error fetching unapproved doctors:", error);
    }
}

// Approve Doctor
async function approveDoctor(doctorId) {
    try {
        if (!user || user.role !== "admin") {
            alert("You must be an admin to perform this action");
            return;
        }
        
        const response = await fetch(`${API_URL}/admin/approve-doctor/${doctorId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        const data = await response.json();
        alert(data.msg);
        fetchUnapprovedDoctors();
    } catch (error) {
        console.error("Error approving doctor:", error);
        alert("Error approving doctor. Please try again.");
    }
}

// Check if user is logged in on pages that require authentication
document.addEventListener("DOMContentLoaded", function() {
    const protectedPages = ["dashboard.html", "appointment.html", "admin.html", "doctors.html", "video-call.html"];
    const currentPath = window.location.pathname;
    
    const requiresAuth = protectedPages.some(page => currentPath.includes(page));
    
    if (requiresAuth && !localStorage.getItem("token")) {
        alert("Please login to access this page");
        window.location.href = "login.html";
    }
    
    // Admin page protection
    if (currentPath.includes("admin.html") && (!user || user.role !== "admin")) {
        alert("Admin access only");
        window.location.href = "dashboard.html";
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const faqItems = document.querySelectorAll(".faq-item h3");

    faqItems.forEach((item) => {
        item.addEventListener("click", function () {
            const answer = this.nextElementSibling;
            const toggle = this.querySelector(".toggle");

            if (answer.style.display === "block") {
                answer.style.display = "none";
                toggle.textContent = "+";
            } else {
                answer.style.display = "block";
                toggle.textContent = "-";
            }
        });
    });
});


// Video call functionality
if (window.location.pathname.includes("video-call.html")) {
    const socket = io("http://localhost:5000");
    
    socket.on("connect", () => {
        console.log("Connected to server");
    });
    
    socket.on("callIncoming", (data) => {
        alert(`Incoming call from ${data.from}`);
        // Handle incoming call
    });
    
    // Function to start a call
    window.startCall = function(userId) {
        socket.emit("callUser", {
            userToCall: userId,
            from: user ? user.id : "anonymous"
        });
    };
}
