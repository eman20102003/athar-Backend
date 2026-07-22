import express from "express";
import {
  createPaymentIntent,
  getMyOrders,
  getOrderStatus,
  confirmPayment,
  updateOrderStatus,
  deleteOrder
} from "../controllers/paymentController.js";
import protect from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/create-payment-intent", protect, createPaymentIntent);
router.get("/my-orders", protect, getMyOrders);
router.get("/order/:id", protect, getOrderStatus);
router.post("/confirm/:orderId", protect, confirmPayment);

export default router;