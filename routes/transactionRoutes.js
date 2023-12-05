const experss = require("express");
const check = require("express-validator");

const transactionControllers = require("../controllers/transactionControllers");

const router = experss.Router();

router.get("/", transactionControllers.getTransactions);

router.post(
  "/",
  [check.check("parcelId").not().isEmpty()],
  transactionControllers.createTransaction
);

router.put(
  "/:transactionId",
  [
    check
      .check("parcelStatus")
      .isIn([
        "picked up",
        "attempted delivery",
        "awaiting pickup",
        "in transit",
        "delivered",
      ]),
  ],
  transactionControllers.updateTransaction
);

module.exports = router;
