const pool = require('../db'); // Ensure you're importing the DB connection

const saveContact = async (username, email, message) => {
    try {
        const query = `INSERT INTO contacts (username, email, message) VALUES ($1, $2, $3) RETURNING *`;
        const values = [username, email, message];
        const result = await pool.query(query, values);
        return result.rows[0]; // ✅ Return the inserted contact
    } catch (error) {
        console.error("Database error:", error);
        throw error;
    }
};

module.exports = { saveContact }; // ✅ Correct export
