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
    check("parcelDescription").not().isEmpty(),
    check("parcelWeight").isNumeric(),
    check("parcelDimension.length").isNumeric(),
    check("parcelDimension.width").isNumeric(),
    check("parcelDimension.height").isNumeric(),
    check("sender.name").not().isEmpty(), // Updated to check sender's name
    check("sender.address").not().isEmpty(), // Updated to check sender's address
    check("sender.phone").not().isEmpty(), // Updated to check sender's phone
    check("sender.email").normalizeEmail().isEmail(), // Updated to check sender's email
    check("recipient.name").not().isEmpty(), // Updated to check recipient's name
    check("recipient.address").not().isEmpty(), // Updated to check recipient's address
    check("recipient.phone").not().isEmpty(), // Updated to check recipient's phone
    check("recipient.email").normalizeEmail().isEmail(), // Updated to check recipient's email
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
