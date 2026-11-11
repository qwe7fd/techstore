import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { login } from "../services/authService";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to sign in");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header/>
      <main className="flex-1">
        <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4 lg:px-8 py-8">
          <div className="w-full max-w-md">
            <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
              <div className="mb-8">
                <h1 className="mb-2 text-2xl font-bold">Welcome back</h1>
                <p className="text-sm text-gray-600">Sign in to your TechStore account</p>
              </div>

              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-semibold">Email</label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-semibold">Password</label>
                  <input
                    id="password"
                    type="password"
                    required
                    placeholder="Your password"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {submitting ? "Signing In..." : "Sign In"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  )
}

export default Login;
