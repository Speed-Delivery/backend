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
  sender: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  recipient: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  createdAt: { type: Date, default: Date.now },
});

parcelSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Parcel", parcelSchema);
