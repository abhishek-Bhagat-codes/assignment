const express = require("express");
const authenticate = require("../middleware/authenticate");

const {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
} = require("../controllers/taskController");

const main = express.Router();

main.get("/test_auth", authenticate, (req, res) => {
    return res.status(200).json({
        message: "Auth protection is working.",
        user: req.user
    });
});

// Task Routes
main.post("/task", authenticate, createTask);
main.get("/tasks", authenticate, getTasks);
main.get("/task/:id", authenticate, getTaskById);
main.put("/task/:id", authenticate, updateTask);
main.delete("/task/:id", authenticate, deleteTask);

module.exports = main;