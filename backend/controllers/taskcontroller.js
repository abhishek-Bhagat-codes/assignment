const Task = require("../models/task");

// Create Task
const createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate } = req.body;

        if (!title) {
            return res.status(400).json({
                status: "not Ok",
                message: "Title is required"
            });
        }

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo: req.user.user_id
        });

        return res.status(201).json({
            status: "Ok",
            message: "Task created successfully",
            task
        });

    } catch (error) {
        return res.status(500).json({
            status: "not Ok",
            message: error.message
        });
    }
};

// Get All Tasks for Logged-in User
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({
            assignedTo: req.user.user_id
        });

        return res.status(200).json({
            status: "Ok",
            tasks
        });

    } catch (error) {
        return res.status(500).json({
            status: "not Ok",
            message: error.message
        });
    }
};

// Get Single Task
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            assignedTo: req.user.user_id
        });

        if (!task) {
            return res.status(404).json({
                status: "not Ok",
                message: "Task not found"
            });
        }

        return res.status(200).json({
            status: "Ok",
            task
        });

    } catch (error) {
        return res.status(500).json({
            status: "not Ok",
            message: error.message
        });
    }
};

// Update Task
const updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                assignedTo: req.user.user_id
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({
                status: "not Ok",
                message: "Task not found"
            });
        }

        return res.status(200).json({
            status: "Ok",
            message: "Task updated successfully",
            task
        });

    } catch (error) {
        return res.status(500).json({
            status: "not Ok",
            message: error.message
        });
    }
};

// Delete Task
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            assignedTo: req.user.user_id
        });

        if (!task) {
            return res.status(404).json({
                status: "not Ok",
                message: "Task not found"
            });
        }

        return res.status(200).json({
            status: "Ok",
            message: "Task deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            status: "not Ok",
            message: error.message
        });
    }
};

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
};