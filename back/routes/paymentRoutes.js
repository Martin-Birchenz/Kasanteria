const express = require("express");
const router = express.Router();
const PaymentController = require("../controllers/paymentController.js");

router.post("/create-preference", PaymentController.createPaymentPreference);
router.get("/webhook", PaymentController.handleWebhook);

module.exports = router;
