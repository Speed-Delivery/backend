// server.js is the entry point for the application.
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const winston = require("winston");
const morgan = require("morgan");
const helmet = require("helmet");
const userRoutes = require("./routes/userRoutes");
const lockersRoutes = require("./routes/LockerRoutes");
const { PORT } = require("./config/serverConfig");
const { dbUri } = require("./config/dbConfig");

const app = express();

// Logger setup
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(helmet());
app.use(
  morgan("combined", { stream: { write: (message) => logger.info(message) } })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => logger.info("Connected to MongoDB"))
  .catch((err) => logger.error(err));

// Use the user routes
app.use("/api/user", userRoutes);
app.use("/api/lockers", lockersRoutes);

// Health check endpoint
app.get("/health", (req, res) => res.status(200).send("OK"));

// Centralized error handling
app.use((err, req, res, next) => {
  // Check for duplicate key error
  if (err && err.code === 11000) {
    res.status(409).send({ error: "Username already exists." });
  } else {
    logger.error(err.stack);
    res.status(500).send("Something broke!");
  }
});

app.listen(process.env.PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
