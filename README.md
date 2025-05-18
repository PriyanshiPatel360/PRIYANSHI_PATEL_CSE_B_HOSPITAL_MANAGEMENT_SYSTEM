# Hospital Management System / E-Healthcare Platform

A comprehensive online healthcare platform that connects patients with doctors, manages appointments, and provides video consultations.

## Overview

This Hospital Management System provides a complete solution for healthcare management, including:

- User authentication (patients, doctors, admin)
- Appointment scheduling and management
- Doctor profiles and specializations
- Admin dashboard for system management

## Team Members:
Priyanshi Patel: 2401010268
Akansha: 2401010195
Dolly: 2401010196
Reena : 2401010249

##Video Explanation Link:
https://drive.google.com/file/d/1EkKwZL37WmnOGLJ4PDtRjwzNWSf__mOQ/view?usp=drivesdk

##Report Link:
https://drive.google.com/file/d/1FLsVJtdsZkzMr2vC2xpvTzjE_aamSVjA/view?usp=drivesdk

##Powerpoint Presentation:
https://drive.google.com/file/d/1FUWsBMHAOc9axrrlQA2WikdE0p_IBWHb/view?usp=drivesdk

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **JWT** - JSON Web Tokens for authentication
- **MongoDB** - Database for development
- **bcryptjs** - Password hashing

- **dotenv** - Environment variable management

### Frontend
- **HTML5/CSS3** - Structure and styling
- **JavaScript** - Client-side functionality
- **Responsive Design** - Mobile-friendly interface

## Project Structure

```
├── backend/               # Server-side code
│   ├── models/            # Data models
│   ├── routes/            # API routes
│   │   ├── auth.js        # Authentication routes
│   │   ├── appointments.js # Appointment management
│   │   ├── admin.js       # Admin functionality
│   │   └── doctors.js     # Doctor management
│   ├── utils/             # Utility functions
│   │   └── mockDb.js      # Mock database implementation
│   ├── .env               # Environment variables
│   └── server.js          # Main server file
│
└── frontend/              # Client-side code
    ├── index.html         # Main entry point
    ├── login.html         # Login page
    ├── register.html      # Registration page
    ├── dashboard.html     # User dashboard
    ├── appointment.html   # Appointment management
    ├── doctors.html       # Doctor listings
    ├── admin.html         # Admin panel
    ├── video-call.html    # Video consultation
    ├── script.js          # Main JavaScript file
    ├── style.css          # Main CSS file
    └── *.css              # Component-specific CSS files
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/PriyanshiPatel360/PRIYANSHI_PATEL_CSE_B_HOSPITAL_MANAGEMENT_SYSTEM.git
   cd PRIYANSHI_PATEL_CSE_B_HOSPITAL_MANAGEMENT_SYSTEM
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the backend directory with the following variables:
     ```
     PORT=5000
     MONGO_URL=your_mongodb_url
     JWT_SECRET=your_jwt_secret
     ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   node server.js
   ```
   The server will run on `http://localhost:5000`.

2. In a separate terminal, serve the frontend:
   ```
   npx http-server -p 8080 .
   ```
   The frontend will be accessible at `http://localhost:8080`.

3. Open your browser and navigate to `http://localhost:8080` to access the application.

## Features

- **User Authentication**: Secure login and registration for patients and doctors
- **Appointment Management**: Book, reschedule, and cancel appointments
- **Doctor Profiles**: Browse doctor profiles with specializations and ratings
- **Admin Dashboard**: Manage users, appointments, and system settings
- **Responsive Design**: Works on desktop and mobile devices

## Development

This project uses a mock database for development purposes, making it easy to run locally without setting up an actual database system.

- Backend API endpoints are available at `http://localhost:5000/api/`
- Socket.io server manages real-time communication for video calls
