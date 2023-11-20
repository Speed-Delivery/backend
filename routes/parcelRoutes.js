const express = require("express");
const { check } = require("express-validator");

const parcelsController = require("../controllers/parcelControllers");

const router = express.Router();

router.get("/", parcelsController.getParcels);

router.get("/:parcelId", parcelsController.getParcelById);

router.get("/user/:userId", parcelsController.getParcelsByUserId);

router.post(
  "/",
  [
    check("parcelDescription").not().isEmpty(), // Corrected from parcelDiscription
    check("parcelWeight").not().isEmpty(),
    check("parcelDimension.length").not().isEmpty(), // Corrected from parcelDimenion
    check("parcelDimension.width").not().isEmpty(), // Corrected from parcelDimenion
    check("parcelDimension.height").not().isEmpty(), // Corrected from parcelDimenion
    check("status").isIn(["awaiting pickup", "in transit", "delivered"]),
    check("senderUsername").not().isEmpty(), // Changed from sender
    check("receiverUsername").not().isEmpty(),
  ],
  parcelsController.createParcel
);

//i want to edit only the status of the parcel
router.put(
  "/:parcelId",
  [check("status").isIn(["awaiting pickup", "in transit", "delivered"])],
  parcelsController.updateParcelById
);

// router.delete("/:pid", parcelsController.deleteParcel);

module.exports = router;
