const Task = require("../models/Task");
const taskSchema = require("../validators/taskValidator");

// ================= CREATE TASK =================
exports.createTask = async (req, res) => {
  try {
    const { error } = taskSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        msg: error.details[0].message
      });
    }

    const { title, description } = req.body;

    const task = new Task({
      title,
      description,
      userId: req.user.userId
    });

    await task.save();

    res.status(201).json({
      success: true,
      data: task
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      msg: "Server error"
    });
  }
};

// ================= GET ALL TASKS =================
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId });

    res.status(200).json({
      success: true,
      data: tasks
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      msg: "Server error"
    });
  }
};

// ================= UPDATE TASK =================
exports.updateTask = async (req, res) => {
  try {
    const { error } = taskSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        msg: error.details[0].message
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        msg: "Task not found"
      });
    }

    if (task.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        msg: "Unauthorized"
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedTask
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      msg: "Server error"
    });
  }
};

// ================= DELETE TASK =================
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        msg: "Task not found"
      });
    }

    if (task.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        msg: "Unauthorized"
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      msg: "Task deleted"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      msg: "Server error"
    });
  }
};