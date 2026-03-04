import { useState } from "react";
import { useNavigate, Link } from "react-router";
import axios from "axios";

export function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        { name, email, password }
      );

      const data = response.data;

      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Signup failed");
    }
  };

  return (
    <div className="mx-auto mt-16 max-w-md p-8">
      <h2 className="mb-4 text-3xl font-bold">Sign Up</h2>

      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <input
          className="rounded border border-gray-300 px-3 py-2"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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
          Sign Up
        </button>
      </form>

      <p className="mt-4">
        Already have an account?{" "}
        <Link className="text-emerald-700 underline" to="/login">
          Log in
        </Link>
      </p>
    </div>
  );
}