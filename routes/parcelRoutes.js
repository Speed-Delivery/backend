const express = require("express");
const router = express.Router();
const parcelController = require("../controllers/parcelController");

// Route to get all parcels
router.get("/parcels", parcelController.getAllParcels);

// Route to create a new parcel
router.post("/parcels", parcelController.createParcel);

module.exports = router;
