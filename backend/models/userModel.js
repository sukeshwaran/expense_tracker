const pool = require('../db');

const createUser = async (username, email, hashedPassword) => {
  try {
    const query = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *`;
    const values = [username, email, hashedPassword];
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Database error while creating user");
  }
};

const findUserByEmail = async (email) => {
  try {
    const query = `SELECT * FROM users WHERE email = $1`;
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw new Error("Database error while finding user");
  }
};

module.exports = { createUser, findUserByEmail };
