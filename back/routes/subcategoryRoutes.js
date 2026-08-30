const express = require("express");
const router = express.Router();
const SubcategoryController = require("../controllers/subcategoryController.js");
const { verifyToken } = require("../middlewares/authMiddleware.js");

router.get("/", SubcategoryController.getSubcategories);
router.post("/", verifyToken, SubcategoryController.createSubcategory);

module.exports = router;
