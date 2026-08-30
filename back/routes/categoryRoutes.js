const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/categoryController.js");
const { verifyToken } = require("../middlewares/authMiddleware.js");

router.get("/", CategoryController.getCategory);
router.post("/", verifyToken, CategoryController.createCategory);

module.exports = router;
