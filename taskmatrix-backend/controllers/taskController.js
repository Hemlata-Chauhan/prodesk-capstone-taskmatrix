const Task = require("../models/Task");

// CREATE TASK
exports.createTask = async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      userId: req.user.userId // from JWT
    });

    await task.save();
    res.status(201).json(task);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL TASKS (ONLY USER'S TASKS)
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId });
    res.json(tasks);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE TASK
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId }, // ownership check
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ msg: "Task not found or not authorized" });
    }

    res.json(task);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE TASK
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId // ownership check
    });

    if (!task) {
      return res.status(404).json({ msg: "Task not found or not authorized" });
    }

    res.json({ msg: "Task deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};