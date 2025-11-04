import asyncHandler from "../utils/asyncHandler.js";
import Review from '../models/Review.js';


export const addReview = asyncHandler(async (req, res) => {
    if (!req.user?._id) return res.status(401).json({ message: "Unauthorized" });
    const { movieId, rating, comment } = req.body;
    if (!movieId || rating == null) {
        return res.status(400).json({ message: 'movieId and rating are required' });
    }
     const numericMovieId = Number(movieId);
  const numericRating = Number(rating);
  if (Number.isNaN(numericMovieId)) return res.status(400).json({ message: "movieId must be a number" });
  if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 10) {
    return res.status(400).json({ message: "rating must be a number between 1 and 10" });
  }
    const review = new Review({
        user: req.user._id,
        movieId: numericMovieId,
        rating: numericRating,
        comment,
    });

    await review.save();
    const populated = await Review.findById(review._id).populate("user", "name");
res.status(201).json(populated);

});
export const getAllReview = asyncHandler(async (req, res) => {
    const reviewedMovies = await Review.find({ user: req.user._id });
    res.json(reviewedMovies);
}); 
export const getReviews = asyncHandler(async (req, res) => {
    const { movieId } = req.params;
    const numericMovieId = Number(movieId);
     if (Number.isNaN(numericMovieId)) return res.status(400).json({ message: "movieId must be a number" });
    const reviews = await Review.find({ movieId:numericMovieId }).populate('user', 'name');
    res.json(reviews);
}

);

export const deleteReview = asyncHandler(async (req, res) => {
      if (!req.user?._id) return res.status(401).json({ message: "Unauthorized" });
    const { reviewId } = req.params;
      
    const review = await Review.findOneAndDelete({ _id: reviewId, user: req.user._id });

    if (!review) {
        return res.status(404).json({ message: 'Review not found' });
    }
    res.json({ message: 'Review deleted successfully' });
});
export const updateReview = asyncHandler(async (req, res) => {
     if (!req.user?._id) return res.status(401).json({ message: "Unauthorized" });
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findOne({ _id: reviewId, user: req.user._id });
    if (!review) {
        return res.status(403).json({ message: 'Review not found' });
    }
    if (rating != null) review.rating = rating;
    if (comment != null) review.comment = comment;
    await review.save();
    const populated = await Review.findById(review._id).populate("user", "name");
    res.json({ message: 'Review updated successfully', review });
    res.json(populated);
}
);
