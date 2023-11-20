const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Parcel Schema

const parcelSchema = new mongoose.Schema({
  parcelDescription: { type: String, required: true },
  parcelWeight: { type: Number, required: true },
  parcelDimension: {
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
  },
  status: {
    type: String,
    required: true,
    enum: ["awaiting pickup", "in transit", "delivered"],
  },
  senderUsername: { type: String, required: true, ref: "User" },
  receiverUsername: { type: String, required: true, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

parcelSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Parcel", parcelSchema);
