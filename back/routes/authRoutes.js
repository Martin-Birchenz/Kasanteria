const authController = require("../controllers/authController.js");
const router = require("express").Router();

router.post("/login", authController.login);
router.post("/register", authController.registerAdmin);

router.get("/verify", authController.verifySession);
router.post("/logout", authController.logout);

module.exports = router;
