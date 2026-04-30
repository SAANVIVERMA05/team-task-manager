const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/project");
const taskRoutes = require("./routes/task");
const dashboardRoutes = require("./routes/dashboard"); // ✅ ADD THIS

// Import Middlewares
const auth = require("./middleware/auth");
const admin = require("./middleware/admin");

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes); // ✅ ADD THIS

// Test route
app.get("/", (req, res) => {
    res.send("API is running");
});

// Protected Route
app.get("/api/protected", auth, (req, res) => {
    res.json({
        msg: "Protected route accessed",
        user: req.user
    });
});

// Admin-only Route
app.get("/api/admin", auth, admin, (req, res) => {
    res.json({
        msg: "Welcome Admin!"
    });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});