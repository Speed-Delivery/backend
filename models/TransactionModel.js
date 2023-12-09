const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator"); // Import the uniqueValidator package

const transactionSchema = new mongoose.Schema({
  parcelId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Parcel", // Assuming you have a Parcel model
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false, // Make userId optional
    ref: "User", // Assuming you have a User model
  },
  parcelStatus: {
    type: String,
    required: false,
    enum: [
      "picked up",
      "waiting to be placed",
      "awaiting pickup",
      "in transit",
      "delivered",
    ],
  },
  CabinetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cabinet", // Reference to a specific Cabinet
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  transactionStatusLastUpdated: { type: Date, default: Date.now },
});

transactionSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Transaction", transactionSchema);
