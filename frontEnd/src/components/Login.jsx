import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { setToken } from "../auth/auth";
import AppContext from "../Context/Context";
import logo from "../assets/logo.png";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { setError: appContextSetError } = useContext(AppContext);

  const navigate = useNavigate();
  const location = useLocation();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    appContextSetError("");
  }, [appContextSetError]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${baseUrl}/login`,
        {
          username: email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      setToken(res.data);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-18 h-18 mx-auto mb-4 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-2xl font-bold shadow-sm">
            <img src={logo} alt="logo" className="w-18 h-18" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 mt-2 text-sm">
            Sign in to continue to your account
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            disabled={loading}
            type="submit"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            No account?{" "}
            <Link
              className="text-blue-600 font-medium hover:text-blue-700 hover:underline"
              to="/signup"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}












