"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("mock_token");
    setIsLoggedIn(!!token);
  }, []);

  function handleLoginSubmit(e: FormEvent) {
    e.preventDefault();
    // Mock auth: in real app, call your API and set a session/token
    localStorage.setItem("mock_token", "ok");
    setIsLoggedIn(true);
    // Redirect to onboarding page
    router.push("/onboarding");
  }

  function handleSignupSubmit(e: FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    // Mock signup: in real app, call your API to create account
    localStorage.setItem("mock_token", "ok");
    localStorage.setItem("user_name", name);
    setIsLoggedIn(true);
    alert("Account created successfully! Redirecting to setup...");
    router.push("/onboarding");
  }

  function toggleForm() {
    setIsLogin(!isLogin);
    // Clear form fields when switching
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
  }

  return (
    <main style={{ padding: 24 }}>
      {/* Top image for navigation */}
      <div className="mb-6">
        <Link href={isLoggedIn ? "/dashboard" : "/"}>
          <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80">
            <Image
              src="/surfrr-logo.png"
              alt="Surfrr Logo"
              width={80}
              height={20}
              className="my-[-20px] mx-[-5px] ml-[-30px]"
            />
            <span className="text-5xl font-bold">Surfrr</span>
          </div>
        </Link>
      </div>

      <h1>{isLogin ? "Login" : "Sign Up"}</h1>

      {isLogin ? (
        <form
          onSubmit={handleLoginSubmit}
          style={{ display: "grid", gap: 12, maxWidth: 360 }}
        >
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
          <input
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
          <button type="submit">Sign in</button>
          <p style={{ textAlign: "center", margin: "16px 0 0 0" }}>
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={toggleForm}
              style={{
                background: "none",
                border: "none",
                color: "blue",
                textDecoration: "underline",
                cursor: "pointer",
                padding: 0,
                font: "inherit",
              }}
            >
              Sign up
            </button>
          </p>
        </form>
      ) : (
        <form
          onSubmit={handleSignupSubmit}
          style={{ display: "grid", gap: 12, maxWidth: 360 }}
        >
          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            required
          />
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
          <input
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
          <input
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            required
          />
          <button type="submit">Sign up</button>
          <p style={{ textAlign: "center", margin: "16px 0 0 0" }}>
            Already have an account?{" "}
            <button
              type="button"
              onClick={toggleForm}
              style={{
                background: "none",
                border: "none",
                color: "blue",
                textDecoration: "underline",
                cursor: "pointer",
                padding: 0,
                font: "inherit",
              }}
            >
              Login
            </button>
          </p>
        </form>
      )}
    </main>
  );
}
