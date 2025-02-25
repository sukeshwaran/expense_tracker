const pool = require('../db');

const addExpense = async (userId, category, amount, description) => { // 🔄 Changed 'title' to 'description'
  try {
    const query = `INSERT INTO expenses (user_id, category, amount, description) VALUES ($1, $2, $3, $4) RETURNING *`; 
    const values = [userId, category, amount, description]; // 🔄 Updated field names
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    console.error("Error adding expense:", error);
    throw new Error("Database error while adding expense");
  }
};

const getExpenses = async (userId) => {
  try {
    const query = `SELECT * FROM expenses WHERE user_id = $1 ORDER BY created_at DESC`;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  } catch (error) {
    console.error("Error fetching expenses:", error);
    throw new Error("Database error while fetching expenses");
  }
};

const updateExpense = async (expenseId, userId, category, amount, description) => { // 🔄 Updated parameter names
  try {
    const query = `UPDATE expenses SET category = $1, amount = $2, description = $3 WHERE id = $4 AND user_id = $5 RETURNING *`; 
    const values = [category, amount, description, expenseId, userId]; // 🔄 Updated values order
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    console.error("Error updating expense:", error);
    throw new Error("Database error while updating expense");
  }
};

const deleteExpense = async (expenseId, userId) => {
  try {
    const query = `DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *`;
    const { rows } = await pool.query(query, [expenseId, userId]);
    return rows[0];
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw new Error("Database error while deleting expense");
  }
};

module.exports = { addExpense, getExpenses, updateExpense, deleteExpense };
