
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { setToken } from "../auth/auth";
import logo from "../assets/logo.png";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${baseUrl}/register`, {
        name,
        username: email,
        password,
      });

      if (res.data.accessToken) setToken(res.data.accessToken);

      navigate("/", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);s
    }
  }

  const disableBtn = loading || !name || !email || !password;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-18 h-18 mx-auto mb-4 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-2xl font-bold shadow-sm">
            <img src={logo} alt="logo" className="w-18 h-18" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500 mt-2 text-sm">
            Sign up to get started with your account
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              placeholder="Create a password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            disabled={disableBtn}
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;