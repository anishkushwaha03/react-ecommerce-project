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
    <div className="theme-surface mx-auto mt-24 max-w-md p-8">
      <h2 className="mb-4 text-3xl font-bold text-[#F9FAFB]">Sign Up</h2>

      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <input
          className="theme-input"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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
          Sign Up
        </button>
      </form>

      <p className="mt-4 text-[#9CA3AF]">
        Already have an account?{" "}
        <Link className="text-[#F9FAFB] underline hover:text-white" to="/login">
          Log in
        </Link>
      </p>
    </div>
  );
}
