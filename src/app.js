import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import { stripeWebhook } from "./controllers/paymentController.js";
import libraryRoutes from "./routes/libraryRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import highlightRoutes from "./routes/highlightRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import downloadRoutes from "./routes/downloadRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";






const app = express();
app.use(cors());


app.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Athar Backend API is Running",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/categories", categoryRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/payment", paymentRoutes);

app.use("/uploads", (req, res, next) => {
  res.set("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express.static("src/uploads"));
app.use("/api/library", libraryRoutes);
app.use("/api/ai", aiRoutes);

app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/highlights", highlightRoutes);
app.use("/api/notes", noteRoutes);

app.use("/api/library/book", downloadRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

export default app;





