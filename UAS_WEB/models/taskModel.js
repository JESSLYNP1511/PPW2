const db = require('../config/db');

const Task = {
  create: async (userId, title, category, deadline) => {
    const [result] = await db.promise().query(
      'INSERT INTO tasks (user_id, title, category, deadline) VALUES (?, ?, ?, ?)',
      [userId, title, category, deadline]
    );
    return result.insertId;
  },
  findAllByUserId: async (userId) => {
    const [rows] = await db.promise().query('SELECT * FROM tasks WHERE user_id = ?', [userId]);
    return rows;
  }
};

module.exports = Task;
