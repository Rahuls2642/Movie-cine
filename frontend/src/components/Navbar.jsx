import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar({ handleAuthClick: externalAuthClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const [isOpen, setIsOpen] = useState(false); // mobile menu
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem("token")));
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "token") setIsLoggedIn(Boolean(e.newValue));
    };
    const onAuthChanged = () => setIsLoggedIn(Boolean(localStorage.getItem("token")));
    window.addEventListener("storage", onStorage);
    window.addEventListener("auth-changed", onAuthChanged);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth-changed", onAuthChanged);
    };
  }, []);

  useEffect(() => setIsOpen(false), [path]);

  useEffect(() => {
    const handleDocClick = (e) => {
      if (!isOpen) return;
      if (menuRef.current && !menuRef.current.contains(e.target) && btnRef.current && !btnRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handleDocClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleDocClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen]);

  const handleAuthClick = useCallback(() => {
    if (externalAuthClick) {
      externalAuthClick();
      setTimeout(() => setIsLoggedIn(Boolean(localStorage.getItem("token"))), 60);
      return;
    }
    if (isLoggedIn) {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      window.dispatchEvent(new Event("auth-changed"));
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [externalAuthClick, isLoggedIn, navigate]);

  // improved isActive: exact by default, but can pass false to match startsWith (for parent routes)
  const isActive = (route, exact = true) =>
    exact ? (path === route ? "text-red-500 after:w-full" : "text-gray-300 hover:text-white")
          : (path === route || path.startsWith(route + "/") ? "text-red-500 after:w-full" : "text-gray-300 hover:text-white");

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)] transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="text-2xl font-extrabold tracking-tight text-white  transition-colors duration-300">
              Movie<span className="text-red-600 group-hover:text-red-500">Cine</span>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            to="/watchlist"
            className={`relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-red-600 after:transition-all after:duration-300 ${isActive("/watchlist")} after:w-0 hover:after:w-full`}
          >
            Watchlist
          </Link>

          <Link
            to="/watched"
            className={`relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-red-600 after:transition-all after:duration-300 ${isActive("/watched")} after:w-0 hover:after:w-full`}
          >
            Watched
          </Link>

          {/* FIXED: use the correct route and allow matching subroutes (e.g. /profile/settings) */}
          <Link
            to="/profile"
            className={`relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-red-600 after:transition-all after:duration-300 ${isActive("/profile", false)} after:w-0 hover:after:w-full`}
          >
            Profile
          </Link>

          <button
            onClick={handleAuthClick}
            className="relative bg-red-600 hover:bg-red-700 text-white px-5 py-1.5 rounded-full font-semibold shadow-md shadow-red-900/30 transition-all duration-300 hover:shadow-red-600/40 hover:scale-105"
          >
            {isLoggedIn ? "Logout" : "Sign Up"}
          </button>
        </div>

        <div className="md:hidden flex items-center">
          <button
            ref={btnRef}
            aria-expanded={isOpen}
            aria-label="Toggle menu"
            onClick={() => setIsOpen((s) => !s)}
            className="p-2 rounded-md inline-flex items-center justify-center text-gray-200 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <svg className={`h-6 w-6 transition-transform ${isOpen ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={menuRef}
        className={`md:hidden origin-top-right transition-all duration-200 ease-out ${
          isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        } overflow-hidden`}
      >
        <div className="px-4 pt-2 pb-6 border-t border-white/6 backdrop-blur-sm bg-black/40">
          <div className="flex flex-col gap-3">
            <Link
              to="/watchlist"
              className={`px-3 py-2 rounded-md ${isActive("/watchlist").includes("text-red-500") ? "text-red-500" : "text-gray-300 hover:text-white"} transition-colors`}
              onClick={() => setIsOpen(false)}
            >
              Watchlist
            </Link>

            <Link
              to="/watched"
              className={`px-3 py-2 rounded-md ${isActive("/watched").includes("text-red-500") ? "text-red-500" : "text-gray-300 hover:text-white"} transition-colors`}
              onClick={() => setIsOpen(false)}
            >
              Watched
            </Link>

            <Link
              to="/profile"
              className={`px-3 py-2 rounded-md ${isActive("/profile", false).includes("text-red-500") ? "text-red-500" : "text-gray-300 hover:text-white"} transition-colors`}
              onClick={() => setIsOpen(false)}
            >
              profile
            </Link>

            <div className="pt-2">
              <button
                onClick={() => {
                  handleAuthClick();
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                {isLoggedIn ? "Logout" : "Sign Up"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
