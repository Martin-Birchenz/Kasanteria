const express = require("express");
const router = express.Router();
const shippingController = require("../controllers/shippingController.js");

router.get("/calculate", shippingController.calculate);

module.exports = router;
