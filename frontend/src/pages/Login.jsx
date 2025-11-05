import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../api/axios";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const onChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
    setError("");
    setSuccessMsg("");
  };

  const validate = () => {
    if (!form.email.trim() || !form.password) {
      setError("Email and password are required.");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("Enter a valid email.");
      return false;
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const res = await API.post("/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        setSuccessMsg("Login successful! Redirecting...");
        setForm({ email: "", password: "" });
        // redirect example
        setTimeout(() => (window.location.href = "/"), 1000);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data ||
          "Login failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(180deg,#0f0f10,rgba(16,16,16,0.95))] px-4">
      <div className="max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">


        {/* Right: login form */}
        <div className="bg-[#111113]/80 border border-neutral-800 rounded-2xl p-8 shadow-xl">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">Sign in</h3>
                <p className="text-sm text-gray-300/80 mt-1">
                  Welcome back
                </p>
              </div>
              <div className="text-sm text-gray-400">
                New here?{" "}
                <span
      onClick={() => navigate("/register")}
      className="text-red-500 font-semibold cursor-pointer"
    >
      Register
    </span>
                
              </div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-900/80 text-red-100 px-3 py-2 text-sm">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="rounded-md bg-green-900/80 text-green-100 px-3 py-2 text-sm">
                {successMsg}
              </div>
            )}

            <div>
              <label className="block text-xs text-gray-300 mb-2">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="you@example.com"
                type="email"
                className="w-full bg-[#0b0b0c] border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  placeholder="Enter password"
                  type={showPassword ? "text" : "password"}
                  className="w-full bg-[#0b0b0c] border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-300 px-2 py-1"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold px-4 py-3 rounded-full"
              >
                {loading ? (
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="opacity-25"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                ) : null}
                <span>{loading ? "Signing in..." : "Sign in"}</span>
              </button>
            </div>

            <div className="text-center text-xs text-gray-500">
              Forgot password?{" "}
              <span className="text-red-500 underline cursor-pointer">
                Reset
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
