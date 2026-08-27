const express = require("express");
const authController = require("../controllers/authController.js");
const { verifyToken } = require("../middlewares/authMiddleware.js");
const router = require("express").Router();

router.post("/login", authController.login);
router.post("/register", authController.registerAdmin);

router.get("/verify", authController.verifySession);
router.post("/logout", authController.logout);

module.exports = router;
