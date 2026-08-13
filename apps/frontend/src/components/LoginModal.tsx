import axios from "axios";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
const API_BASE = import.meta.env.VITE_BACKEND_URL;

interface Props {
    open : boolean ,
    onClose : () => void 
    onSubmit : (value : string) => void 
}

function LoginModal({ open, onClose, onSubmit } : Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => emailRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e : KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!open) return null;

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE}/api/auth/google`;
  };

  const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await axios.post(
        `${API_BASE}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      onSubmit(res.data?.user?.email || email);
      setEmail("");
      setPassword("");
    } catch (err) {
      console.log(err)
      setError("Couldn't log in. Check your details and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-lg p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-mono font-semibold text-gray-100">Log in to cloudCode</h3>
          <button
            aria-label="Close"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-300 rounded"
          >
            <X size={16} />
          </button>
        </div>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="block font-mono text-xs text-gray-400 mb-1.5" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              ref={emailRef}
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-100 placeholder-gray-600 outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-300/40"
            />
          </div>
          <div>
            <label className="block font-mono text-xs text-gray-400 mb-1.5" htmlFor="login-pass">
              Password
            </label>
            <input
              id="login-pass"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-100 placeholder-gray-600 outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-300/40"
            />
          </div>

          {error && <p className="text-xs text-red-400 font-mono">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-teal-300 text-black font-mono font-semibold text-sm py-2.5 rounded-md hover:bg-teal-200 disabled:opacity-60 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            {submitting ? "Logging in…" : "Log in"}
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full border border-gray-700 text-gray-100 font-mono text-sm py-2.5 rounded-md hover:border-teal-300 hover:text-teal-300 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-300"
          >
            Continue with Google
          </button>

          <p className="text-xs text-gray-600 text-center pt-1">
            Demo UI — connect this to your real auth API.
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginModal