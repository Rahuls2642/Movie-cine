import React, { useEffect, useState, useCallback } from "react";
import API from "../api/axios"; // your axios instance with baseURL and auth header
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [countsLoading, setCountsLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [watchlistCount, setWatchlistCount] = useState(0);
  const [watchedCount, setWatchedCount] = useState(0);
  const [reviews, setReviews] = useState([]);

  const [error, setError] = useState("");

  

 
  const fetchCounts = useCallback(async () => {
    setCountsLoading(true);
    setError("");
    try {
     
      const wlRes = await API.get("/watchlist");
      const wl = Array.isArray(wlRes.data) ? wlRes.data : wlRes.data.movies || [];
      setWatchlistCount(wl.length);

    
      const wRes = await API.get("/watched");
      let watchedPayload = wRes.data;
    
      if (Array.isArray(watchedPayload)) {
        setWatchedCount(watchedPayload.length);
      } else if (Array.isArray(watchedPayload.movies)) {
        setWatchedCount(watchedPayload.movies.length);
      } else if (Array.isArray(watchedPayload.movieId)) {
        setWatchedCount(watchedPayload.movieId.length);
      } else if (typeof watchedPayload.count === "number") {
        setWatchedCount(watchedPayload.count);
      } else {
        setWatchedCount(watchedPayload?.movies?.length || watchedPayload?.movieId?.length || 0);
      }
    } catch (err) {
      console.error("Failed to fetch counts", err);
      setError(err?.response?.data?.message || "Failed to load watch data");
    } finally {
      setCountsLoading(false);
    }
  }, []);

  const fetchReviews = useCallback(async () => {
    setReviewsLoading(true);
    setError("");
    try {
   
      let res;
      try {
        res = await API.get("/reviews/me"); 
      } catch (e1) {
        try {
          res = await API.get("/reviews/user"); 
        } catch (e2) {
         
          res = await API.get("/reviews");
        }
      }

      const data = Array.isArray(res.data) ? res.data : res.data.items || [];
      setReviews(data);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
      setError(err?.response?.data?.message || "Failed to load reviews");
    } finally {
      setReviewsLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      await Promise.all([fetchCounts(), fetchReviews()]);
      if (mounted) setLoading(false);
    })();
    return () => (mounted = false);
  }, [fetchCounts, fetchReviews]);

 
  const handleDelete = async (reviewId) => {
    if (!confirm("Delete this review? This action cannot be undone.")) return;


    const prev = reviews;
    setReviews((r) => r.filter((x) => (x._id || x.id) !== reviewId));
    try {
      await API.delete(`/reviews/${reviewId}`);
    } catch (err) {
      console.error("Failed to delete review", err);
      setError(err?.response?.data?.message || "Failed to delete review");
  
      setReviews(prev);
    }
  };

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0c] text-white flex items-center justify-center">
        <div>Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-white">
      <div className="max-w-5xl mx-auto px-6 py-10 pt-30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Card: counts */}
          <div className="md:col-span-1 bg-[#0e0e10] border border-neutral-800 rounded-xl p-6 shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Your profile</h2>
                <p className="text-sm text-gray-400">Overview</p>
              </div>
            </div>

            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between bg-[#0b0b0c] p-3 rounded-lg border border-neutral-800">
                <div>
                  <div className="text-xs text-gray-400">Watchlist</div>
                  <div className="text-2xl font-bold">{countsLoading ? "..." : watchlistCount}</div>
                </div>
                <button
                  onClick={() => navigate("/watchlist")}
                  className="text-sm text-red-500 font-semibold hover:text-red-400 cursor-pointer"
                >
                  View
                </button>
              </div>

              <div className="flex items-center justify-between bg-[#0b0b0c] p-3 rounded-lg border border-neutral-800">
                <div>
                  <div className="text-xs text-gray-400">Watched</div>
                  <div className="text-2xl font-bold">{countsLoading ? "..." : watchedCount}</div>
                </div>
                <button 
                  onClick={() => navigate("/watched")}
                  className="text-sm text-red-500 font-semibold hover:text-red-400 cursor-pointer"
                >
                  View
                </button>
              </div>
            </div>
          </div>

          
          <div className="md:col-span-2 bg-[#0e0e10] border border-neutral-800 rounded-xl p-6 shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Your reviews</h3>
                <p className="text-sm text-gray-400">
                  Reviews you've written on movies
                </p>
              </div>
              <div>
                <button
                  onClick={() => { fetchReviews(); fetchCounts(); }}
                  className="text-sm text-gray-300 bg-[#0b0b0c] px-3 py-2 rounded-lg border border-neutral-800 cursor-pointer hover:bg-[#161618]"
                >
                  Refresh
                </button>
              </div>
            </div>

            {reviewsLoading ? (
              <div className="text-gray-400">Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="text-gray-400">You haven't written any reviews yet.</div>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => {
                  const id = r._id || r.id;
                  return (
                    <div key={id} className="bg-[#0b0b0c] p-4 rounded-lg border border-neutral-800">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-4">
                            <div className="text-sm font-semibold">{r.movieTitle || r.movieName || `Movie ${r.movieId || ""}`}</div>
                            <div className="text-sm text-gray-400">Rating: {r.rating}/10</div>
                          </div>
                          <p className="mt-2 text-sm text-gray-300">{r.comment || r.review || ""}</p>
                          <div className="mt-2 text-xs text-gray-500">
                            {new Date(r.createdAt || r.updatedAt || Date.now()).toLocaleString()}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <button
                            onClick={() => navigate(`/movie/${r.movieId || r.movie || r.movie_id || ""}`)}
                            className="text-sm text-gray-300 bg-[#0b0b0c] px-3 py-1 rounded-md border border-neutral-800 cursor-pointer hover:bg-[#161618]"
                          >
                            Open
                          </button>

                          <button
                            onClick={() => handleDelete(id)}
                            className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-white cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {error && <div className="mt-6 text-sm text-red-400">{error}</div>}
      </div>
    </div>
  );
}
