const Parcel = require("../models/ParcelModel");

const getAllParcels = async (req, res) => {
  try {
    const parcels = await Parcel.find();
    res.status(200).json(parcels);
  } catch (error) {
    console.error("Error fetching parcels:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createParcel = async (req, res) => {
  try {
    const {
      parcelDescription,
      parcelWeight,
      parcelDimension,
      status,
      sender,
      receiver,
    } = req.body;

    console.log(req.body, "body from backend");
    const newParcel = new Parcel({
      parcelDescription,
      parcelWeight,
      parcelDimension,
      status,
      sender,
      receiver,
    });

    const savedParcel = await newParcel.save();
    res.status(201).json(savedParcel);
  } catch (error) {
    console.error("Error creating parcel:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getAllParcels, createParcel };
