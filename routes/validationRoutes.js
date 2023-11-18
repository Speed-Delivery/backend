const express = require("express");
const router = express.Router();
const validationController = require("../controllers/validationController");

const { validateUsers } = require('../controllers/validationController');

router.post("/validateUsers", validationController.validateUsers);
// GET endpoint for testing
router.get("/test", (req, res) => {
  res.json({ message: "GET request to /api/validation/test is successful!" });
});

module.exports = router;
