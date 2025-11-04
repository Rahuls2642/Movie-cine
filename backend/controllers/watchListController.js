import asyncHandler from "../utils/asyncHandler.js";
import WatchList from "../models/WatchList.js";

export const addToWatchList = asyncHandler(async (req, res) => {
    const { movieId, title, posterPath } = req.body;
    if (!movieId || !title) {
        return res.status(400).json({ message: 'movieId and title are required' });
    }
    const existingEntry = await WatchList.findOne({ user: req.user._id, movieId });
    if (existingEntry) {
        return res.status(400).json({ message: 'Movie already in watch list' });
    }
    const watchListEntry = new WatchList({
        user: req.user._id,
        movieId,    
        title,
        posterPath,
    });
    await watchListEntry.save();
    res.status(201).json({ message: 'Movie added to watch list', watchListEntry });
});

export const getWatchList = asyncHandler(async (req, res) => {
    const watchList = await WatchList.find({ user: req.user._id });
    res.json(watchList);
});
export const removeFromWatchList = asyncHandler(async (req, res) => {
    const { movieId } = req.params;
    const deletedEntry = await WatchList.findOneAndDelete({ user: req.user._id, movieId });
    if (!deletedEntry) {
        return res.status(404).json({ message: 'Movie not found in watch list' });
    }
    res.json({ message: 'Movie removed from watch list' });
});
