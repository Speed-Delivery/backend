const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const lockerSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
    enum: ["Helsinki", "Espoo", "Tampere", "Vantaa", "Oulu"],
  },
  cabinets: [
    {
      cabinetNumber: { type: String, required: true },
      status: { type: String, required: true, enum: ["occupied", "available"] },
      currentParcel: { type: mongoose.Types.ObjectId, ref: "Parcel" },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

lockerSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Locker", lockerSchema);
