const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const transactionSchema = new mongoose.Schema({
  parcelId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Parcel", // Reference to the Parcel model
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false, // Make userId optional
    ref: "User", // Reference to the User model
  },
  parcelStatus: {
    type: String,
    required: false,
    enum: [
      "picked up",
      "attempted delivery",
      "awaiting pickup",
      "in transit",
      "delivered",
    ],
  },
  lockerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Locker",
    required: false, // Only required for parcels at the pickup point
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  transactionStatusLastUpdated: { type: Date, default: Date.now },
});

transactionSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Transaction", transactionSchema);
