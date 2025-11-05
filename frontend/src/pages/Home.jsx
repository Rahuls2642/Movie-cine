import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || null; 

const BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p";

export default function Home() {
  const [hero, setHero] = useState(null);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);

  const abortRef = useRef(null);
  const observerRef = useRef(null);
  const prevSentinelRef = useRef(null);
  const sentinelRef = useRef(null);

  // --- Refs to keep current values for stable callbacks ---
  const pageRef = useRef(page);
  const queryRef = useRef(query);
  const loadingMoreRef = useRef(loadingMore);
  const hasMoreRef = useRef(hasMore);
  // --------------------------------------------------------

  const imgUrl = (path, size = "w342") => (path ? `${IMG_BASE}/${size}${path}` : null);
  const backdropUrl = (path) => (path ? `${IMG_BASE}/original${path}` : null);
  const navigate = useNavigate();

  // keep refs in sync with state
  useEffect(() => {
    pageRef.current = page;
  }, [page]);
  useEffect(() => {
    queryRef.current = query;
  }, [query]);
  useEffect(() => {
    loadingMoreRef.current = loadingMore;
  }, [loadingMore]);
  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  const initialFetch = useCallback(async () => {
    if (!API_KEY) {
      setError("VITE_APP_TMDB_API_KEY is missing. Set it in your .env");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
      if (!res.ok) throw new Error("Failed to fetch popular movies");
      const json = await res.json();
      const first = json.results?.[0] || null;

      if (first) {
        const vidsRes = await fetch(`${BASE}/movie/${first.id}/videos?api_key=${API_KEY}&language=en-US`);
        const vidsJson = await vidsRes.json();
        const trailer = vidsJson.results && vidsJson.results.find((v) => v.type === "Trailer" && v.site === "YouTube");
        setHero({ ...first, trailer });
      }

      setMovies(json.results || []);
      setPage(1);
      setHasMore(Boolean(json.page < json.total_pages));
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initialFetch();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [initialFetch]);

  useEffect(() => {
    if (abortRef.current) abortRef.current.abort();

    if (!query || query.trim().length < 2) {
      setSearching(false);
      if (query === "") {
        if (movies.length === 0) initialFetch();
      }
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    const timer = setTimeout(async () => {
      setSearching(true);
      setLoading(true);
      setError(null);

      try {
        const q = encodeURIComponent(query.trim());
        const res = await fetch(`${BASE}/search/movie?api_key=${API_KEY}&language=en-US&query=${q}&page=1&include_adult=false`, { signal: controller.signal });
        if (!res.ok) throw new Error("Search failed");
        const json = await res.json();

        setMovies(json.results || []);
        setPage(1);
        setHasMore(Boolean(json.page < json.total_pages));

        const first = json.results?.[0] || null;
        if (first) {
          const vidsRes = await fetch(`${BASE}/movie/${first.id}/videos?api_key=${API_KEY}&language=en-US`);
          const vidsJson = await vidsRes.json();
          const trailer = vidsJson.results && vidsJson.results.find((v) => v.type === "Trailer" && v.site === "YouTube");
          setHero({ ...first, trailer });
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error(err);
        setError(err.message || "Search error");
      } finally {
        setLoading(false);
        setSearching(false);
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, initialFetch, movies.length]);

  // --- Stable loadMore using refs to avoid stale closures ---
  const loadMore = useCallback(async () => {
    if (loadingMoreRef.current || !hasMoreRef.current) return;
    setLoadingMore(true);
    setError(null);

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const nextPage = pageRef.current + 1;
      const q = queryRef.current;
      const endpoint = q && q.trim().length >= 2
        ? `${BASE}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(q)}&page=${nextPage}&include_adult=false`
        : `${BASE}/movie/popular?api_key=${API_KEY}&language=en-US&page=${nextPage}`;

      const res = await fetch(endpoint, { signal: controller.signal });
      if (!res.ok) throw new Error("Failed to load more");
      const json = await res.json();

      setMovies((prev) => [...prev, ...(json.results || [])]);
      setPage(nextPage);                 // sync React state
      pageRef.current = nextPage;        // sync ref
      setHasMore(Boolean(json.page < json.total_pages));
    } catch (err) {
      if (err.name === "AbortError") return;
      console.error(err);
      setError(err.message || "Load more failed");
    } finally {
      setLoadingMore(false);
    }
  }, []);
  // --------------------------------------------------------

  // Create observer once — loadMore is stable (uses refs internally)
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            loadMore();
          }
        }
      },
      {
        root: null,
        rootMargin: "300px",
        threshold: 0.1,
      }
    );

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = null;
    };
  }, [loadMore]);

  const attachSentinel = useCallback((node) => {
    if (prevSentinelRef.current && observerRef.current) {
      try {
        observerRef.current.unobserve(prevSentinelRef.current);
      } catch (e) {
        // ignore
      }
      prevSentinelRef.current = null;
    }

    if (node && observerRef.current) {
      observerRef.current.observe(node);
      prevSentinelRef.current = node;
      sentinelRef.current = node;
    } else {
      sentinelRef.current = null;
    }
  }, []);

  if (loading && movies.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="mb-4">Loading movies…</div>
          <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin border-red-500 mx-auto" />
        </div>
      </div>
    );
  }

  if (error && movies.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-400">
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {hero && (
        <header className="relative overflow-hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden style={{ mixBlendMode: "multiply" }} />
          <div className="relative bg-cover bg-center" style={{ backgroundImage: `url(${backdropUrl(hero.backdrop_path || hero.poster_path)})` }}>
            <div className="max-w-screen-xl mx-auto px-6 py-20 lg:py-32">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="lg:col-span-1">
                  <img src={imgUrl(hero.poster_path, "w342")} alt={hero.title} className="w-full rounded-2xl shadow-2xl border border-black/40" loading="lazy" />
                </div>

                <div className="lg:col-span-2 text-left">
                  <div className="flex items-center gap-4 text-sm text-gray-300 mb-2">
                    <span className="px-2 py-1 bg-black/50 rounded">{hero.release_date?.slice(0, 4)}</span>
                    <span className="px-2 py-1 bg-black/50 rounded">{Math.round(hero.popularity)} views</span>
                    <span className="px-2 py-1 bg-black/50 rounded">{hero.vote_average?.toFixed(1)} / 10</span>
                  </div>

                  <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">{hero.title}</h1>
                  <p className="mt-4 text-gray-300 max-w-2xl">{hero.overview}</p>

                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    {hero.trailer ? (
                      <a href={`https://www.youtube.com/watch?v=${hero.trailer.key}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-red-600 text-white font-semibold shadow-lg">
                        ▶ Watch trailer
                      </a>
                    ) : (
                      <button className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-gray-700 text-white font-semibold" disabled>
                        No trailer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      <nav className="max-w-screen-xl mx-auto px-6 py-6 flex items-center justify-between text-sm text-gray-300">
        <div className="flex items-center gap-4">
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name (min 2 chars)..." className="bg-black/40 placeholder-gray-500 rounded px-3 py-2 text-sm outline-none w-64" />
          <div className="text-gray-400 text-xs">{searching ? "Searching…" : query.trim().length >= 2 ? "Search results" : "Showing: Popular"}</div>
        </div>
      </nav>

      <main className="max-w-screen-xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {movies.map((m) => (
            <article key={m.id} onClick={() => navigate(`/movie/${m.id}`)} className="group bg-gray-800 rounded-xl overflow-hidden shadow-lg cursor-pointer hover:scale-[1.02] transition-transform">
              <div className="relative">
                <img src={imgUrl(m.poster_path, "w342")} alt={m.title} className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                <div className="absolute left-3 top-3 bg-black/50 px-2 py-1 rounded text-xs">{m.vote_average?.toFixed(1)}</div>
              </div>

              <div className="p-3">
                <h3 className="text-sm font-semibold truncate" title={m.title}>{m.title}</h3>
                <div className="mt-2 text-xs text-gray-400 flex items-center justify-between">
                  <div>{m.release_date ? m.release_date.slice(0, 4) : "—"}</div>
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); navigate(`/movie/${m.id}`); }} className="text-xs px-3 py-1 bg-red-600 rounded-full font-semibold">
                      Details
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div ref={attachSentinel} className="h-6" />

        <div className="mt-6 flex justify-center">
          {loadingMore && (
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-6 h-6 border-4 border-t-transparent rounded-full animate-spin border-red-500" />
              <div>Loading more…</div>
            </div>
          )}

          {!hasMore && <div className="text-gray-500">No more results</div>}
        </div>
      </main>

      <footer className="py-8 text-center text-gray-500 text-sm">Data from The Movie Database (TMDB)</footer>
    </div>
  );
}
