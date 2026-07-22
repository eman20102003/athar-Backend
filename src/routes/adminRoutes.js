import express from "express";
import {
  getDashboardSummary,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllOrders,
  updateOrderStatus,   
  deleteOrder, 
  deleteReviewAsAdmin,
  createUserByAdmin,
  getAllReviews ,
} from "../controllers/adminController.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";


const router = express.Router();


router.use(protect, adminOnly);

router.get("/summary", getDashboardSummary);

router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

router.get("/orders", getAllOrders);

router.delete("/reviews/:id", deleteReviewAsAdmin);
router.post("/users", createUserByAdmin);
router.get("/reviews", getAllReviews);

router.put("/orders/:id", updateOrderStatus); 
router.delete("/orders/:id", deleteOrder);    

export default router;