const authController = require("../controllers/authController.js");
const { verifyToken } = require("../middlewares/authMiddleware.js");
const router = require("express").Router();

router.post("/login", authController.login);
router.post("/register", authController.registerAdmin);

router.use(verifyToken);

module.exports = router;
