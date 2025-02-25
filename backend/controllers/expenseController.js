const { addExpense, getExpenses, updateExpense, deleteExpense } = require('../models/expenseModel');

const createExpense = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const userId = req.user.id;
    const { category, amount, description } = req.body; 

    if (!category || !amount || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newExpense = await addExpense(userId, description, amount, category);
    res.status(201).json({ message: 'Expense created successfully', data: newExpense });
  } catch (error) {
    console.error('Error creating expense:', error.message);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

const fetchExpenses = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const userId = req.user.id;
    console.log("Fetching expenses for user:", userId);
    const expenses = await getExpenses(userId);

    res.status(200).json({ data: expenses });
  } catch (error) {
    console.error('Error fetching expenses:', error.message);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

const modifyExpense = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const userId = req.user.id;
    const expenseId = req.params.id;
    const { category, amount, description } = req.body;

    if (!category || !amount || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const updatedExpense = await updateExpense(expenseId, userId, description, amount, category);
    if (!updatedExpense) {
      return res.status(404).json({ message: 'Expense not found or unauthorized' });
    }

    res.status(200).json({ message: 'Expense updated successfully', data: updatedExpense });
  } catch (error) {
    console.error('Error updating expense:', error.message);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

const removeExpense = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const userId = req.user.id;
    const expenseId = req.params.id;

    const deletedExpense = await deleteExpense(expenseId, userId);
    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found or unauthorized' });
    }

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error.message);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

module.exports = { createExpense, fetchExpenses, modifyExpense, removeExpense };
