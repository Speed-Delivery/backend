const express = require("express");
const { check } = require("express-validator");

const lockersController = require("../controllers/lockerControllers");

const router = express.Router();

router.get("/", lockersController.getLockers);

router.get("/", lockersController.getLockers);

router.get("/:city", lockersController.getLockersByCity);

router.post(
  "/",
  [
    check("lockerNumber").not().isEmpty(),
    check("lockerLocation").not().isEmpty(),
    check("lockerStatus").not().isEmpty(),
  ],
  lockersController.initializeLockers
);

router.put(
  "/:lid",
  [check("lockerStatus").isIn(["available", "occupied"])],
  lockersController.updateLockerById
);

module.exports = router;
