const express = require("express");
const { check } = require("express-validator");

const lockersController = require("../controllers/lockerControllers");

const router = express.Router();

router.get("/", lockersController.getLockers);

router.get("/:city", lockersController.getLockersByCity);

router.post(
  "/",
  [
    check("lockerNumber").not().isEmpty(),
    check("lockerLocation").not().isEmpty(),
    check("lockerStatus").not().isEmpty(),
    check("lockerCode").not().isEmpty(),
  ],
  lockersController.initializeLockers
);

router.put(
  "/:lockerId",
  [
    check("cabinetNumber").not().isEmpty(),
    check("status").isIn(["occupied", "available"]),
    check("currentParcel").not().isEmpty(),
  ],
  lockersController.updateLockerById
);

module.exports = router;
