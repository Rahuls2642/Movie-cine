import express from "express";
import auth from "../middleware/auth.js";
import {getwatchedMovies, addToWatchedMovies, removeFromWatchedMovies} from "../controllers/watchedController.js";
const router = express.Router();
router.use(auth);
router.get("/", getwatchedMovies);  
router.post("/add", addToWatchedMovies);
router.delete("/:movieId", removeFromWatchedMovies);
export default router;