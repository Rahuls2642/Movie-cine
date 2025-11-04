import asyncHandler from "../utils/asyncHandler.js";
import Watched from '../models/Watchedmovies.js';
export const addToWatchedMovies = asyncHandler(async (req, res) => {
    const { movieId, title, posterPath } = req.body;
    if (!movieId || !title) {
        return res.status(400).json({ message: 'movieId and title are required' });
    }
    const existingEntry = await Watched.findOne({ user: req.user._id, movieId });
    if (existingEntry) {
        return res.status(400).json({ message: 'Movie already in watched list' });
    }
    const watchedMovie = new Watched({
        user: req.user._id,
        movieId,
        title,
        posterPath,
    });
    await watchedMovie.save();
    res.status(201).json({ message: 'Movie added to watched list', watchedMovie });
});

export const getwatchedMovies = asyncHandler(async (req, res) => {
    const watchedMovies = await Watched.find({ user: req.user._id });
    res.json(watchedMovies);
}); 
export const removeFromWatchedMovies = asyncHandler(async (req, res) => {
    const { movieId } = req.params;
    const deletedMovie = await Watched.findOneAndDelete({ user: req.user._id, movieId });
    if (!deletedMovie) {
        return res.status(404).json({ message: 'Movie not found in watched list' });
    }
    res.json({ message: 'Movie removed from watched list' });
});