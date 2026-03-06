import { useState } from "react";
import { useNavigate, Link } from "react-router";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        alert(data.error);
      }
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="theme-surface mx-auto mt-24 max-w-md p-8">
      <h2 className="mb-4 text-3xl font-bold text-[#F9FAFB]">Login</h2>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          className="theme-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="theme-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          className="theme-primary-btn"
          type="submit"
        >
          Log In
        </button>
      </form>

      <p className="mt-4 text-[#9CA3AF]">
        Don't have an account?{" "}
        <Link className="text-[#F9FAFB] underline hover:text-white" to="/signup">
          Sign up
        </Link>
      </p>
    </div>
  );
}
