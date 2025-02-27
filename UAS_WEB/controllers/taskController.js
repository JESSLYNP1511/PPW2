const Task = require('../models/taskModel');

const taskController = {
  // Create Task
  createTask: async (req, res) => {
    const { title, category, status, deadline } = req.body;
    const userId = req.user.id;

    try {
      const task = await Task.create({ user_id: userId, title, category, status, deadline });
      res.status(201).json({ message: 'Task created successfully', task });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Task creation failed' });
    }
  },

  // Get Tasks by User
  getTasks: async (req, res) => {
    try {
    const userId = req.user.id;
      const tasks = await Task.findAllByUserId(userId);
      res.json(tasks);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch tasks' });
    }
  },

  // Update Task
  updateTask: async (req, res) => {
    const { id } = req.params;
    const { title, category, status, deadline } = req.body;

    try {
      await Task.update(id, { title, category, status, deadline });
      res.json({ message: 'Task updated successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Task update failed' });
    }
  },

  // Delete Task
  deleteTask: async (req, res) => {
    const { id } = req.params;

    try {
      await Task.delete(id);
      res.json({ message: 'Task deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Task deletion failed' });
    }
  }
};

module.exports = taskController;
