import express from 'express';
const app = express();
const API_URL = "http://localhost:5000/api";

// Fetch Doctors
async function fetchDoctors() {
    const response = await fetch(`${API_URL}/doctors`);
    const doctors = await response.json();
    console.log(doctors);
}

fetchDoctors();



// Register User
async function registerUser() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
    });

    const data = await response.json();
    alert(data.msg);
    if (response.ok) {
        window.location.href = "login.html"; // Redirect to login
    }
}

// Login User
async function loginUser() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

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
        alert(data.msg);
    }
}

// Logout
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("Logged out successfully!");
    window.location.href = "login.html";
}


// Get Logged-in User
const user = JSON.parse(localStorage.getItem("user"));
document.getElementById("username").innerText = user.name;

// Fetch Doctors
async function fetchDoctors() {
    const response = await fetch(`${API_URL}/doctors`);
    const doctors = await response.json();

    let doctorDropdown = document.getElementById("doctor-list");
    doctors.forEach(doctor => {
        let option = document.createElement("option");
        option.value = doctor._id;
        option.innerText = doctor.name;
        doctorDropdown.appendChild(option);
    });
}

// Book Appointment
async function bookAppointment() {
    const doctorId = document.getElementById("doctor-list").value;
    const date = document.getElementById("appointment-date").value;
    const time = document.getElementById("appointment-time").value;

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
}

// Fetch Appointments
async function fetchAppointments() {
    const response = await fetch(`${API_URL}/appointments/${user.id}`);
    const appointments = await response.json();

    let appointmentsList = document.getElementById("appointments-list");
    appointmentsList.innerHTML = "";
    appointments.forEach(app => {
        let li = document.createElement("li");
        li.innerText = `Doctor: ${app.doctorId.name}, Date: ${app.date}, Time: ${app.time}`;
        appointmentsList.appendChild(li);
    });
}

// Load Data
fetchDoctors();
fetchAppointments();


// Fetch Unapproved Doctors
async function fetchUnapprovedDoctors() {
    const response = await fetch(`${API_URL}/admin/unapproved-doctors`);
    const doctors = await response.json();

    let doctorList = document.getElementById("unapproved-doctors");
    doctorList.innerHTML = "";

    doctors.forEach(doctor => {
        let li = document.createElement("li");
        li.innerHTML = `${doctor.name} (${doctor.email}) 
            <button onclick="approveDoctor('${doctor._id}')">Approve</button>`;
        doctorList.appendChild(li);
    });
}

// Approve Doctor
async function approveDoctor(doctorId) {
    const response = await fetch(`${API_URL}/admin/approve-doctor/${doctorId}`, { method: "PUT" });
    const data = await response.json();
    alert(data.msg);
    fetchUnapprovedDoctors();
}

// Load Unapproved Doctors
if (document.getElementById("unapproved-doctors")) fetchUnapprovedDoctors();

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


app.listen(port, () => {
    console.log(`Serve at http://localhost:${port}`);
    }
);
