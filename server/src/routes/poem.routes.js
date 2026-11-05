import express from "express";
import { createPoem, getPoems, getPoem, updatePoem, deletePoem } from "../controllers/poem.controller.js";
import { protect } from "../middleware/auth.middleware.js";


const router = express.Router();

router.post("/", protect, createPoem);
router.get("/", protect, getPoems);
router.get("/:id", protect, getPoem);
router.patch("/:id", protect, updatePoem);
router.delete("/:id", protect, deletePoem);


export default router;
