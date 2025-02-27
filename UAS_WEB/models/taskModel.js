const db = require('../config/db');

const Task = {
  create: async ({ user_id, title, category, status, deadline }) => {
    const [result] = await db.promise().query(
      'INSERT INTO tasks (user_id, title, category, status, deadline) VALUES (?, ?, ?, ?, ?)',
      [user_id, title, category, status, deadline]
    );
    return result.insertId;
  },

  findAllByUserId: async (user_id) => {
    const [rows] = await db.promise().query(
      'SELECT * FROM tasks WHERE user_id = ?',
      [user_id]
    );
    return rows;
  },

  update: async (id, { title, category, status, deadline }) => {
    await db.promise().query(
      'UPDATE tasks SET title = ?, category = ?, status = ?, deadline = ? WHERE id = ?',
      [title, category, status, deadline, id]
    );
  },

  delete: async (id) => {
    await db.promise().query(
      'DELETE FROM tasks WHERE id = ?',
      [id]
    );
  }
};

module.exports = Task;
