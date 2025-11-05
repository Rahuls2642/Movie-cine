
import React, { useState } from "react";
import axios from "axios";


export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("All fields are required.");
      return false;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("Please enter a valid email.");
      return false;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:3000/api/auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }
      setSuccessMsg("Account created. Loggin to your account...");
      setForm({ name: "", email: "", password: "" });
      setTimeout(() => (window.location.href = "/login"), 1000);
    } catch (err) {
        console.log(err)
      setError(
        err?.response?.data?.message ||
          err?.response?.data ||
          "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(180deg,#0f0f10,rgba(16,16,16,0.95))] px-4">
      <div className="max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
         <div className="bg-[#111113]/80 border border-neutral-800 rounded-2xl p-8 shadow-xl">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">Create account</h3>
               
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
              <label className="block text-xs text-gray-300 mb-2">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Your name"
                className="w-full bg-[#0b0b0c] border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

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
              <p className="mt-2 text-xs text-gray-500">Minimum 6 characters</p>
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
                <span>{loading ? "Creating account..." : "Create account"}</span>
              </button>
            </div>

            <div className="text-center text-xs text-gray-500">
              By signing up you agree to our{" "}
              <span className="text-red-500 underline cursor-pointer">Terms</span>.
            </div>
          </form>

         
          <div className="mt-6 border-t border-neutral-800 pt-4 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <button onClick={()=>{
                window.location.href = "/login"
            }} className="text-red-500 font-semibold hover:text-red-300">Sign in</button>
          </div>
        </div>
      </div>
    </div>
  );
}
