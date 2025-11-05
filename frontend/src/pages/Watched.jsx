
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios"; 

const IMG_BASE = "https://image.tmdb.org/t/p/w342";

export default function Watched() {
  const [watched, setWatched] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const navigate = useNavigate();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;


  const authConfig = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

  const loadWatched = async () => {
    setLoading(true);
    setError(null);
    try {
     
      const res = await API.get("/watched", authConfig); 
    
      const payload = res?.data;
      if (!payload) throw new Error("Empty response from server");
      const list = Array.isArray(payload) ? payload : payload.watched;
      if (!list) throw new Error("Unexpected response shape (expected { watched: [...] } or an array)");
      setWatched(list);
    } catch (err) {
     
      console.error("loadWatched error:", err);
      if (err.response) {
        setError(`you must be logged in to view your watched list`);
      } else if (err.request) {
        setError("No response from server — check server / CORS / network");
      } else {
        setError(err.message || "Error loading watched list");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWatched();
  
  }, []);

  const handleDelete = async (movieId) => {
    if (!token) return alert("Please sign in to remove items from your watched list");
    if (deleting) return;

    const prev = watched;
    setWatched((w) => w.filter((m) => m.movieId !== movieId));
    setDeleting(movieId);
    setError(null);

    try {
      
      const res = await API.delete(`/watched/${movieId}`, authConfig);
     
      if (!(res.status >= 200 && res.status < 300)) {
        
        setWatched(prev);
        throw new Error(`Failed to delete (status ${res.status})`);
      }
    } catch (err) {
      console.error("delete error:", err);
      setWatched(prev); 
      if (err.response) {
        setError(`Server error: ${err.response.status} ${err.response.statusText}`);
      } else if (err.request) {
        setError("No response from server — check server / CORS / network");
      } else {
        setError(err.message || "Delete failed");
      }
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div>Loading watched list…</div>
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin border-red-500 mx-auto mt-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white  ">
      <div className="max-w-screen-lg mx-auto px-6 py-10 pt-30">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Watched movies</h1>
          <div className="text-sm text-gray-400">{watched.length} {watched.length === 1 ? 'movie' : 'movies'}</div>
        </div>

        {error && <div className="mt-4 text-red-400">{error}</div>}

        {watched.length === 0 ? (
          <div className="mt-8 text-gray-400">You haven't marked any movies as watched yet.</div>
        ) : (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {watched.map((m) => (
              <div key={m.movieId} className="bg-gray-800 rounded-lg overflow-hidden shadow group">
                <div className="relative cursor-pointer" onClick={() => navigate(`/movie/${m.movieId}`)}>
                  <img src={m.posterPath ? `${IMG_BASE}${m.posterPath}` : ''} alt={m.title} className="w-full h-64 object-cover" loading="lazy" />
                </div>

                <div className="p-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-sm font-semibold" title={m.title}>{m.title}</div>
                    
                  </div>
                 

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => handleDelete(m.movieId)}
                      disabled={deleting === m.movieId}
                      className={`text-xs px-3 py-1 rounded ${deleting === m.movieId ? 'bg-gray-700' : 'bg-red-600'}`}
                    >
                      {deleting === m.movieId ? 'Removing…' : 'Remove'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
