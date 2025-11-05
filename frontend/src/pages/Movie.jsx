// src/pages/Movie.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios"; 
import axios from "axios"; 


const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export default function Movie() {
  const { id } = useParams(); 
  const [movie, setMovie] = useState(null);
  const [loadingMovie, setLoadingMovie] = useState(true);

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const [adding, setAdding] = useState(false);
  const [watchedAdding, setWatchedAdding] = useState(false);

  const [form, setForm] = useState({ rating: 8, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  const [userReview, setUserReview] = useState(null);
  const storedUser = getStoredUser();

  const tmdbKey = import.meta.env.VITE_TMDB_API_KEY || null; 

  useEffect(() => {
    let mounted = true;
    const loadMovie = async () => {
      setLoadingMovie(true);
      try {
        if (tmdbKey) {
          const res = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
            params: { api_key: tmdbKey, language: "en-US" },
          });
          if (mounted) setMovie(res.data);
        } else {
         
          if (mounted)
            setMovie({
              id,
              title: `Movie ${id}`,
              overview: "No TMDb key configured. This is placeholder content.",
              poster_path: null,
              backdrop_path: null,
              release_date: "",
              vote_average: 0,
            });
        }
      } catch (err) {
        console.error("Failed to load movie:", err);
        if (mounted)
          setMovie({
            id,
            title: `Movie ${id}`,
            overview:
              "Failed to load detailed info. Check TMDb key or network. This is fallback content.",
            poster_path: null,
            backdrop_path: null,
            release_date: "",
            vote_average: 0,
          });
      } finally {
        if (mounted) setLoadingMovie(false);
      }
    };

    loadMovie();
    return () => (mounted = false);
  }, [id, tmdbKey]);


  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      
      const res = await API.get(`/reviews/${id}`);
     
      setReviews(res.data);
      
      if (storedUser) {
        const mine = (res.data || []).find((r) => {
      
          const uid = storedUser?._id || storedUser?.id;
          return r.user && (r.user._id === uid || r.user.id === uid);
        });
        setUserReview(mine || null);
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  
  }, [id]);

  
  const imageBase = (path, size = "w500") =>
    path ? `https://image.tmdb.org/t/p/${size}${path}` : null;


  


  const addToWatchlist = async () => {
    setAdding(true);
    try {
      await API.post("/watchlist/add", {
        movieId: Number(id),
        title: movie?.title || movie?.name || `Movie ${id}`,
        posterPath: movie?.poster_path || movie?.backdrop_path || "",
      });
      alert("Added to watchlist");
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.message ||
          "Failed to add to watchlist. Are you logged in?"
      );
    } finally {
      setAdding(false);
    }
  };

  // Add to watched
  const addToWatched = async () => {
    setWatchedAdding(true);
    try {
      await API.post("/watched/add", {
        movieId: Number(id),
        title: movie?.title || movie?.name || `Movie ${id}`,
        posterPath: movie?.poster_path || movie?.backdrop_path || "",
      });
      alert("Marked as watched");
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.message ||
          "Failed to mark as watched. Are you logged in?"
      );
    } finally {
      setWatchedAdding(false);
    }
  };

  // submit review
  const submitReview = async (e) => {
    e.preventDefault();
    setReviewError("");
    setReviewSuccess("");
    if (!form.rating || form.rating < 1 || form.rating > 10) {
      setReviewError("Rating must be between 1 and 10");
      return;
    }
    setSubmittingReview(true);
    try {
      await API.post("/reviews/add", {
        movieId: Number(id),
        rating: Number(form.rating),
        comment: form.comment,
      });
      setReviewSuccess("Review submitted");
      setForm({ rating: 8, comment: "" });
      // refresh reviews and mark user's review
      await fetchReviews();
    } catch (err) {
      console.error("Failed to submit review:", err);
      setReviewError(
        err?.response?.data?.message || "Failed to submit review. Are you logged in?"
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loadingMovie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b0c] text-white">
        Loading movie...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-white">
      {/* movie hero */}
      <header
        className="relative rounded-b-2xl overflow-hidden"
        style={{
          backgroundImage: movie?.backdrop_path
            ? `linear-gradient(180deg, rgba(6,6,6,0.65), rgba(6,6,6,0.95)), url('${imageBase(
                movie.backdrop_path,
                "w1280"
              )}')`
            : "linear-gradient(180deg, rgba(6,6,6,0.95), rgba(6,6,6,0.95))",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <img
            src={
              movie?.poster_path
                ? imageBase(movie.poster_path, "w500")
                : `https://via.placeholder.com/300x450?text=${encodeURIComponent(
                    movie?.title || "Movie"
                  )}`
            }
            alt={movie?.title}
            className="w-full md:w-[260px] rounded-lg shadow-2xl object-cover"
          />

          <div className="md:col-span-2 flex flex-col justify-center">
            <div className="text-sm text-red-500 uppercase mb-2">
              {(movie?.release_date || "").slice(0, 4)}
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
              {movie?.title || movie?.name}
            </h1>

            <p className="mt-3 text-gray-300 max-w-3xl">{movie?.overview}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={addToWatchlist}
                disabled={adding}
                className="inline-flex items-center gap-2 bg-transparent border border-neutral-700 hover:border-red-600 text-white px-4 py-2 rounded-full text-sm"
              >
                {adding ? "Adding..." : "+ Add to watchlist"}
              </button>

              <button
                onClick={addToWatched}
                disabled={watchedAdding}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm"
              >
                {watchedAdding ? "Saving..." : "Already watched"}
              </button>

              <div className="px-3 py-2 text-sm text-gray-300 rounded-md bg-[#0b0b0c]/60">
                ⭐ {movie?.vote_average ? movie.vote_average.toFixed(1) : "—"} / 10
              </div>
            </div>
          </div>
        </div>
      </header>

    
      <main className="max-w-4xl mx-auto px-6 py-10">
       
        <section className="bg-[#0e0e10] border border-neutral-800 rounded-xl p-6 mb-6">
          {userReview ? (
            <div>
              <div className="text-sm text-gray-300 mb-2">Your review</div>
              <div className="bg-[#0b0b0c] p-4 rounded-md border border-neutral-800">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">
                    {storedUser?.name || userReview.user?.name || "You"}
                  </div>
                  <div className="text-sm text-gray-400">Rating: {userReview.rating}/10</div>
                </div>
                <p className="mt-2 text-sm text-gray-300">{userReview.comment || userReview.review}</p>
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-semibold mb-3">Add a review</h3>
              <form onSubmit={submitReview} className="space-y-3">
                {reviewError && (
                  <div className="text-sm text-red-400 bg-red-900/10 p-2 rounded">{reviewError}</div>
                )}
                {reviewSuccess && (
                  <div className="text-sm text-green-400 bg-green-900/10 p-2 rounded">{reviewSuccess}</div>
                )}

                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-300">Rating</label>
                  <select
                    value={form.rating}
                    onChange={(e) => setForm((s) => ({ ...s, rating: e.target.value }))}
                    className="bg-[#0b0b0c] border border-neutral-800 rounded px-3 py-2 text-sm"
                  >
                    {Array.from({ length: 10 }).map((_, i) => {
                      const val = i + 1;
                      return (
                        <option key={val} value={val}>
                          {val}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-300 block mb-1">Comment</label>
                  <textarea
                    value={form.comment}
                    onChange={(e) => setForm((s) => ({ ...s, comment: e.target.value }))}
                    rows={4}
                    className="w-full bg-[#0b0b0c] border border-neutral-800 rounded px-3 py-2 text-sm"
                    placeholder="Write your thoughts..."
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full text-white"
                  >
                    {submittingReview ? "Posting..." : "Post review"}
                  </button>
                  <div className="text-sm text-gray-400">Be respectful — one review per movie.</div>
                </div>
              </form>
            </>
          )}
        </section>

        {/* Reviews list */}
        <section>
          <h4 className="text-lg font-semibold mb-4">Reviews</h4>

          {loadingReviews ? (
            <div className="text-gray-400">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="text-gray-400">No reviews yet — be the first to write one.</div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r._id || r.id} className="bg-[#0e0e10] border border-neutral-800 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">
                      {r.user?.name || r.userName || "Anonymous"}
                    </div>
                    <div className="text-sm text-gray-300">Rating: {r.rating}/10</div>
                  </div>
                  <p className="mt-2 text-sm text-gray-300">{r.comment || r.review}</p>
                  <div className="mt-2 text-xs text-gray-500">{new Date(r.createdAt || r.updatedAt || Date.now()).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
