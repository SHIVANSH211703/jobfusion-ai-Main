const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const authRoutes = require("./modules/auth/routes/auth.routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

// Security Middleware
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

// Request Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logger
app.use(morgan("dev"));

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 JobFusion AI Backend is running...",
  });
});

// API Routes
app.use("/api/v1/auth", authRoutes);

// 404 Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// Global Error Handler
app.use(errorMiddleware);

module.exports = app;