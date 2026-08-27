const express = require("express");
const paymentController = require("../controllers/paymentController.js");
const router = require("express").Router();

router.post("/preference", paymentController.createPreference);

module.exports = router;
