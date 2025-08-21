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
    let ignore = false;
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (!ignore) {
          setIsLoggedIn(res.ok);
        }
      } catch {
        if (!ignore) setIsLoggedIn(false);
      }
    }
    checkSession();
    return () => {
      ignore = true;
    };
  }, []);

  async function handleLoginSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Login failed");
        return;
      }
      setIsLoggedIn(true);
      router.push("/onboarding");
    } catch {
      alert("Network error. Please try again.");
    }
  }

  async function handleSignupSubmit(e: FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Signup failed");
        return;
      }
      setIsLoggedIn(true);
      alert("Account created successfully! Redirecting to setup...");
      router.push("/onboarding");
    } catch {
      alert("Network error. Please try again.");
    }
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
