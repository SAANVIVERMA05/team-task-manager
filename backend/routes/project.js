const express = require("express");
const Project = require("../models/Project");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

// CREATE PROJECT (Admin only)
router.post("/", auth, admin, async (req, res) => {
    try {
        const project = new Project({
            name: req.body.name,
            description: req.body.description,
            createdBy: req.user.id,
            members: req.body.members || []
        });

        await project.save();
        res.json(project);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// GET ALL PROJECTS (Logged-in users)
router.get("/", auth, async (req, res) => {
    try {
        const projects = await Project.find().populate("members", "name email");
        res.json(projects);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

module.exports = router;