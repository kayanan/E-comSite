import { useEffect, useState ,useContext} from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { setToken } from "../auth/auth";
import AppContext from "../Context/Context"


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const {setError:appContextSetError}=useContext(AppContext)

  const navigate = useNavigate();
  const location = useLocation();
  const baseUrl = import.meta.env.VITE_BASE_URL;
  console.log(baseUrl)

  const from = location.state?.from?.pathname || "/";

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${baseUrl}/login`, {
        username: email,
        password,
      },{
        withCredentials:true
      });
      console.log(document.cookie,"cookie")
      console.log(res)
      setToken(res.data);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }
    
    appContextSetError("");
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-center mb-4">Login</h2>

        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <input
            className="border p-2 rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="border p-2 rounded"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={loading}
            type="submit"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          No account?{" "}
          <Link className="text-blue-500 hover:underline" to="/signup">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}