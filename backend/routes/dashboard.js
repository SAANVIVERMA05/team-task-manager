const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
    try {
        const matchStage = req.user.role === "admin" 
            ? {} 
            : { assignedTo: new mongoose.Types.ObjectId(req.user.id) };

        const statusStats = await Task.aggregate([
            { $match: matchStage },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        const userStats = await Task.aggregate([
            { $match: matchStage },
            { $group: { _id: "$assignedTo", count: { $sum: 1 } } },
            { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
            { $unwind: "$user" },
            { $project: { name: "$user.name", count: 1 } }
        ]);

        const overdue = await Task.countDocuments({
            ...matchStage,
            dueDate: { $lt: new Date() },
            status: { $ne: "done" }
        });

        res.json({ statusStats, userStats, overdue });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

module.exports = router;