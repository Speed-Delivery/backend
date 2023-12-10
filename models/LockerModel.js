const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator"); // Import the uniqueValidator package

const cabinetSchema = new mongoose.Schema(
  {
    cabinetNumber: { type: String, required: true },
    status: { type: String, required: true, enum: ["occupied", "available"] },
    code: { type: String, required: true, unique: true },
    cabinetStatusLastUpdated: { type: Date, default: Date.now },
    transactionId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }, // Reference to Transaction
  },
  { _id: true }
); // Explicitly enable _id for cabinets

const lockerSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
    enum: ["Helsinki", "Espoo", "Tampere", "Vantaa", "Oulu"],
  },
  cabinets: [cabinetSchema],
  createdAt: { type: Date, default: Date.now },
});

lockerSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Locker", lockerSchema);
