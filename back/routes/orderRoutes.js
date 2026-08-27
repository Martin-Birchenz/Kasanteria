const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController.js");
const { verifyToken } = require("../middlewares/authMiddleware.js");

router.post("/", orderController.createOrder);
router.get("/", verifyToken, orderController.getOrders);
router.get("/:id", verifyToken, orderController.getOrderDetail);
router.put("/:id/status", verifyToken, orderController.updateOrderStatus);

module.exports = router;
