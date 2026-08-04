const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController.js");
const upload = require("../middlewares/upload.js");

router.get("/", productController.getProduct);
router.post("/", upload.array("images", 5), productController.createProduct);

module.exports = router;
