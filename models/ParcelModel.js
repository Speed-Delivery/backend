const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

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
  sender: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  receiver: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

parcelSchema.pre("save", async function (next) {
  // Your pre-save logic here
  // For example, you can modify the document or perform asynchronous operations

  // Call the next middleware in the schema
  next();
});

parcelSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Parcel", parcelSchema, "parcels");
