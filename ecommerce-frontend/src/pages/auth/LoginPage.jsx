import { useState } from "react";
import { useNavigate, Link } from "react-router";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
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
    <div className="mx-auto mt-16 max-w-md p-8">
      <h2 className="mb-4 text-3xl font-bold">Login</h2>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          className="rounded border border-gray-300 px-3 py-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="rounded border border-gray-300 px-3 py-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          className="rounded bg-emerald-700 px-3 py-2 text-white hover:bg-emerald-600"
          type="submit"
        >
          Log In
        </button>
      </form>

      <p className="mt-4">
        Don't have an account?{" "}
        <Link className="text-emerald-700 underline" to="/signup">
          Sign up
        </Link>
      </p>
    </div>
  );
}