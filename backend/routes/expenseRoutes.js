const express = require('express');
const { createExpense, fetchExpenses, modifyExpense, removeExpense } = require('../controllers/expenseController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/', authenticate, createExpense); // Add an expense
router.get('/', authenticate, fetchExpenses); // Get all expenses
router.put('/:id', authenticate, modifyExpense); // Update an expense
router.delete('/:id', authenticate, removeExpense); // Delete an expense

module.exports = router;
