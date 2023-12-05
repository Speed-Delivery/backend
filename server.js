const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const winston = require("winston");
const morgan = require("morgan");
const helmet = require("helmet");
const cron = require("node-cron");
const userRoutes = require("./routes/userRoutes");
const driverRoutes = require("./routes/driverRoutes");
const lockersRoutes = require("./routes/LockerRoutes");
const parcelRoutes = require("./routes/parcelRoutes");
const { PORT } = require("./config/serverConfig");
const { dbUri } = require("./config/dbConfig");
const Parcel = require("./models/ParcelModel");
const Locker = require("./models/LockerModel");
const User = require("./models/UserModel");
const app = express();
app.use(cors());

const server = http.createServer(app);

// Socket.io setup
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  },
});
// Logger setup
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});

// Middleware
app.use(bodyParser.json());
app.use(helmet());
app.use(
  morgan("combined", { stream: { write: (message) => logger.info(message) } })
);

cron.schedule("*/30 * * * * *", async () => {
  try {
    console.log("Running the cron job");

    const thirtySecondsAgo = new Date(new Date().getTime() - 30000);
    console.log("Checking for updates since:", thirtySecondsAgo.toISOString());

    // Fetch all lockers
    const lockers = await Locker.find();

    let updatedCabinetsCount = 0;

    // Process each locker and its cabinets
    lockers.forEach((locker) => {
      locker.cabinets.forEach((cabinet) => {
        const lastUpdated = new Date(cabinet.cabinetStatusLastUpdated);

        if (lastUpdated >= thirtySecondsAgo) {
          console.log(
            `Cabinet ${cabinet.cabinetNumber} in ${locker.location} was updated to ${cabinet.status} in the last 30 seconds`
          );
          updatedCabinetsCount++;
        }
      });
    });

    if (updatedCabinetsCount === 0) {
      console.log("No cabinet status updates found in the last 30 seconds");
    } else {
      console.log(
        `${updatedCabinetsCount} cabinets had status updates in the last 30 seconds`
      );
    }
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => logger.info("Connected to MongoDB"))
  .catch((err) => logger.error(err));

// Use the user routes
app.use("/api/users", userRoutes); // Changed base path to /api/users
app.use("/api/drivers", driverRoutes);
app.use("/api/lockers", lockersRoutes);
app.use("/api/parcels", parcelRoutes);

// Health check endpoint
app.get("/health", (req, res) => res.status(200).send("OK"));

// Centralized error handling and duplicate key error
app.use((err, req, res, next) => {
  if (err && err.code === 11000) {
    res.status(409).send({ error: "Username already exists." });
  } else {
    logger.error(err.stack);
    res.status(500).send("Something broke!");
  }
});

// Socket.io connection
io.on("connection", (socket) => {
  logger.info(`New client connected: ${socket.id}`);

  // Event listener for getUserParcels
  socket.on("getUserParcels", async (userId) => {
    try {
      // Fetch parcels based on the received user ID
      // all parcel
      const appParcel = await Parcel.find({}).populate("sender.user");
      console.log(appParcel);
      const userParcels = await Parcel.find({ "sender.user": userId }).populate(
        "sender.user"
      );
      console.log(userParcels);
      socket.emit("userParcels", userParcels);
    } catch (error) {
      // Handle error appropriately
      console.error("Error fetching user parcels:", error);
      socket.emit("userParcelsError", {
        message: "Error fetching user parcels",
      });
    }
  });
  // Event listener for getUserLockers
  socket.on("getUserLockers", async (userId) => {
    try {
      // Fetch lockers based on the received user ID
      const userLockers = await Locker.find();
      socket.emit("userLockers", userLockers);
    } catch (error) {
      // Handle error appropriately
      console.error("Error fetching user lockers:", error);
      socket.emit("userLockersError", {
        message: "Error fetching user lockers",
      });
    }
  });
  socket.on("disconnect", () => {
    console.log(`A user disconnected with socket id ${socket.id}`);
  });
});

server.listen(PORT, () => logger.info(`Server listening on port ${PORT}`));
