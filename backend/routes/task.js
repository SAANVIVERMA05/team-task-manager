const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

// CREATE TASK (Admin only)
router.post("/", auth, admin, async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// GET TASKS (for logged-in users)
router.get("/", auth, async (req, res) => {
    try {
        const query = req.user.role === "admin" ? {} : { assignedTo: req.user.id };
        const tasks = await Task.find(query)
            .populate("assignedTo", "name email")
            .populate("project", "name");

        res.json(tasks);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// UPDATE TASK STATUS
router.put("/:id", auth, async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(task);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

module.exports = router;