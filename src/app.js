import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();
app.use(cors());


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
app.use("/api/ai", aiRoutes);


app.use("/uploads", express.static("src/uploads"));

export default app;



