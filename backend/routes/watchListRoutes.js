import express from "express";
import auth from "../middleware/auth.js";
import {
  getWatchList,
  addToWatchList,
  removeFromWatchList,
} from "../controllers/watchListController.js"; 

const router = express.Router();
router.use(auth);
router.get("/", getWatchList);
router.post("/add", addToWatchList);
router.delete("/:movieId", removeFromWatchList);
export default router;