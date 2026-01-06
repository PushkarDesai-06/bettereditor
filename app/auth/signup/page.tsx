"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaImage, FaEnvelope, FaLock, FaUser } from "react-icons/fa";

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      router.push("/auth/signin?registered=true");
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-blue-950 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-800">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="bg-blue-600 p-3 rounded-lg">
            <FaImage className="text-white" size={28} />
          </div>
          <h1 className="text-white text-3xl font-bold">PhotoEditor</h1>
        </div>

        <h2 className="text-white text-2xl font-semibold text-center mb-1">
          Create account
        </h2>
        <p className="text-gray-400 text-center mb-5">
          Get started with your free account
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-gray-300 text-sm mb-1.5 block font-medium">
              Name
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="Enter your name"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-300 text-sm mb-1.5 block font-medium">
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-300 text-sm mb-1.5 block font-medium">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="Create a password"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-300 text-sm mb-1.5 block font-medium">
              Confirm Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-5"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-5 text-center">
          <p className="text-gray-400">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="text-blue-500 hover:text-blue-400 font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-5 pt-5 border-t border-gray-800">
          <p className="text-gray-500 text-sm text-center">
            Free tier includes: 10 images • 5MB per file
          </p>
        </div>
      </div>
    </div>
  );
}
