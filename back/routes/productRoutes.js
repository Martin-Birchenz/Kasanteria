const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController.js");
const upload = require("../middlewares/upload.js");
const { verifyToken } = require("../middlewares/authMiddleware.js");

router.get("/", productController.getProduct);
router.get("/featured", productController.getFeatured);
router.get("/:id", productController.getProductById);
router.post(
  "/",
  verifyToken,
  upload.array("images", 5),
  productController.createProduct,
);
router.patch("/:id/status", verifyToken, productController.toggleStatus);
router.delete("/:id", verifyToken, productController.deleteProduct);

module.exports = router;
