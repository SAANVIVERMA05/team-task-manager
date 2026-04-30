const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/auth");

const router = express.Router();

// Dashboard stats
router.get("/", auth, async (req, res) => {
    try {
        const total = await Task.countDocuments();

        const completed = await Task.countDocuments({ status: "done" });
        const pending = await Task.countDocuments({ status: "todo" });

        const overdue = await Task.countDocuments({
            dueDate: { $lt: new Date() },
            status: { $ne: "done" }
        });

        res.json({
            total,
            completed,
            pending,
            overdue
        });

    } catch (err) {
        res.status(500).send("Server error");
    }
});

module.exports = router;