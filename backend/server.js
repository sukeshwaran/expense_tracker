const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const contactRoutes = require("./routes/contactRoutes"); // New Contact Routes
const pool = require("./db");
require("dotenv").config();
const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
const app = express();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET, POST, PUT, DELETE',
  credentials: true
}));
app.use(express.json()); // Correct way to parse JSON
app.use(morgan("dev")); // For logging HTTP requests

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/expenses", expenseRoutes);
app.use("/api/v1", contactRoutes); // Use Contact API

// Connect to PostgreSQL and start the server
pool.connect()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error", err.stack);
  });

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Server is shutting down...");
  pool.end(() => {
    console.log("Database connection closed");
    process.exit(0);
  });
});
app.get('/', (req, res) => {
  res.send('Expense Tracker API is running...');
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
