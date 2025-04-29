// Mock database module for development without MongoDB

const mockUsers = [
  {
    _id: "60d0fe4f5311236168a109ca",
    name: "Admin User",
    email: "admin@example.com",
    password: "$2a$10$GQKrZ5bJwC0vxU7Xc4qN3OcKD.3n7/KyTX6E/HDZoGfGlT1Rx8tbO", // "password"
    role: "admin",
    approved: true
  },
  {
    _id: "60d0fe4f5311236168a109cb",
    name: "Doctor User",
    email: "doctor@example.com",
    password: "$2a$10$GQKrZ5bJwC0vxU7Xc4qN3OcKD.3n7/KyTX6E/HDZoGfGlT1Rx8tbO", // "password"
    role: "doctor",
    approved: true
  },
  {
    _id: "60d0fe4f5311236168a109cc",
    name: "Patient User",
    email: "patient@example.com",
    password: "$2a$10$GQKrZ5bJwC0vxU7Xc4qN3OcKD.3n7/KyTX6E/HDZoGfGlT1Rx8tbO", // "password"
    role: "patient",
    approved: true
  },
  {
    _id: "60d0fe4f5311236168a109cd",
    name: "Unapproved Doctor",
    email: "newdoctor@example.com",
    password: "$2a$10$GQKrZ5bJwC0vxU7Xc4qN3OcKD.3n7/KyTX6E/HDZoGfGlT1Rx8tbO", // "password"
    role: "doctor",
    approved: false
  }
];

const mockAppointments = [
  {
    _id: "70d0fe4f5311236168a109ca",
    patientId: "60d0fe4f5311236168a109cc",
    doctorId: "60d0fe4f5311236168a109cb",
    date: "2025-05-10",
    time: "10:00 AM"
  }
];

// User constructor function
function UserModel(userData) {
  Object.assign(this, userData);
  
  // Generate a simple unique ID if not provided
  if (!this._id) {
    this._id = 'user_' + Date.now() + Math.random().toString(36).substring(2, 9);
  }
  
  this.save = async function() {
    console.log('Mock saving user:', this);
    // Add to mockUsers array if this is a new user
    const existingUserIndex = mockUsers.findIndex(u => u._id === this._id);
    
    if (existingUserIndex >= 0) {
      // Update existing user
      mockUsers[existingUserIndex] = { ...this };
    } else {
      // Add new user
      mockUsers.push({ ...this });
    }
    return this;
  };
  
  return this;
}

// Mock User model
const User = {
  findOne: async (query) => {
    if (query.email) {
      return mockUsers.find(user => user.email === query.email);
    } else if (query._id) {
      return mockUsers.find(user => user._id === query._id);
    }
    return null;
  },
  
  findById: async (id) => {
    return mockUsers.find(user => user._id === id);
  },
  
  find: async (query) => {
    if (query.role === "doctor" && query.approved === false) {
      return mockUsers.filter(user => user.role === "doctor" && user.approved === false);
    } else if (query.role === "doctor" && query.approved === true) {
      return mockUsers.filter(user => user.role === "doctor" && user.approved === true);
    }
    return [];
  }
};

// Mock Appointment model
const Appointment = {
  find: async (query) => {
    if (query.patientId) {
      const appointments = mockAppointments.filter(app => app.patientId === query.patientId);
      
      // Populate the doctorId field with doctor information
      return appointments.map(app => {
        const doctor = mockUsers.find(user => user._id === app.doctorId);
        return {
          ...app,
          doctorId: { name: doctor.name, email: doctor.email }
        };
      });
    }
    return [];
  },
  
  save: async function() {
    // In a real app, this would save to the database
    console.log('Mock saving appointment:', this);
    mockAppointments.push(this);
    return this;
  }
};

// Mock mongoose model creation function that returns our mock models
const model = (modelName, schema) => {
  if (modelName === 'User') {
    // For User, we need to combine static methods with constructor
    const UserModelConstructor = function(userData) {
      return new UserModel(userData);
    };
    
    // Add static methods to the constructor function
    UserModelConstructor.findOne = User.findOne;
    UserModelConstructor.findById = User.findById;
    UserModelConstructor.find = User.find;
    
    return UserModelConstructor;
  } else if (modelName === 'Appointment') {
    return Appointment;
  }
};

// Export mock database functions
module.exports = {
  connect: () => console.log("Connected to mock database"),
  model,
  Schema: function() { return {} },
  // New methods for direct data access
  getUsers: () => mockUsers,
  addUser: (user) => {
    console.log("Adding new user to mock database:", user.email);
    mockUsers.push(user);
    return user;
  },
  getAppointments: () => mockAppointments,
  addAppointment: (appointment) => {
    console.log("Adding new appointment to mock database");
    mockAppointments.push(appointment);
    return appointment;
  }
};
