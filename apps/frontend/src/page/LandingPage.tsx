import { useState, useEffect } from "react";

import axios from "axios";
import HeroTerminal from "../components/landingPageComponents/HeroTerminal";
import LoginModal from "../components/landingPageComponents/LoginModal";
import AuthArea from "../components/landingPageComponents/AuthArea";
import { FEATURES, RUNTIMES, STEPS } from "../contants/featureSet";
import {  useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function LandingPage() {
  const [authStatus, setAuthStatus] = useState("checking");
  const [email, setEmail] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate() ;

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, { withCredentials: true });

        if (cancelled) return;
        if (res.data?.user) {
          localStorage.setItem("user" , res.data.user.id)
          setEmail(res.data.user.email || "");
          setAuthStatus("in");
        } else {
          setAuthStatus("out");
        }
      } catch {
        if (!cancelled) setAuthStatus("out");
      }
    }

    checkSession();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleLogin(emailValue : string) {
    setEmail(emailValue);
    setAuthStatus("in");
    setModalOpen(false);
  }

  async function handleLogout() {
    try {
      await axios.post(`${API_BASE}/api/auth/logout`, {}, { withCredentials: true });
    } catch {
      
    }
    setAuthStatus("out");
    setEmail("");
  }

  function handleStartClick() {
    if (authStatus !== "in") {
      setModalOpen(true);
    } else {
      navigate("/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans antialiased">
      <header className="sticky top-0 z-40 border-b border-gray-800 bg-black/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-teal-300" />
            <span className="font-mono font-bold text-lg tracking-tight">cloudCode</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-mono text-sm text-gray-400">
            <a href="#runtimes" className="hover:text-gray-100 transition-colors">
              Runtimes
            </a>
            <a href="#how" className="hover:text-gray-100 transition-colors">
              How it works
            </a>
            <a href="#features" className="hover:text-gray-100 transition-colors">
              Isolation
            </a>
          </nav>

          <AuthArea
            authStatus={authStatus}
            email={email}
            onLoginClick={() => setModalOpen(true)}
            onLogout={handleLogout}
          />
        </div>
      </header>

      <LoginModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleLogin} />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 font-mono text-xs text-teal-300 border border-teal-700/60 bg-teal-300/5 px-3 py-1 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-300" />
              every workspace ships in its own container
            </span>

            <h1 className="font-mono font-extrabold text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight text-gray-100">
              Spin up a workspace.
              <br />
              <span className="text-teal-300">Run it in isolation.</span>
            </h1>

            <p className="mt-6 text-lg text-gray-400 leading-relaxed max-w-lg">
              cloudCode gives every project its own sandboxed container — Next.js, React, Node, Python, Java, C++,
              and more. Your code, your dependencies, your process tree, walled off from everyone else's.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={handleStartClick}
                className="bg-teal-300 text-black font-mono font-semibold px-6 py-3 rounded-md hover:bg-teal-200 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-black"
              >
                {authStatus === "in" ? "Go to your workspaces →" : "Create a workspace →"}
              </button>
              <a
                href="#how"
                className="font-mono text-sm text-gray-400 hover:text-gray-100 transition-colors px-2 py-3"
              >
                See how it works
              </a>
            </div>
          </div>

          <div className="mt-16 max-w-xl">
            <HeroTerminal />
          </div>
        </div>
      </section>

      {/* RUNTIMES */}
      <section id="runtimes" className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <p className="font-mono text-xs text-teal-300 mb-2">RUNTIMES</p>
              <h2 className="font-mono font-bold text-2xl md:text-3xl text-gray-100">
                Pick a language. Get a container.
              </h2>
            </div>
            <p className="text-gray-400 text-sm max-w-sm">
              Each card below is a runtime pod — its own filesystem, its own process namespace, torn down or paused
              independently of every other workspace.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {RUNTIMES.map(({ name, icon: Icon }) => (
              <div
                key={name}
                className="group relative bg-gray-900 border border-gray-800 rounded-lg p-5 h-36 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:border-teal-300 hover:shadow-[0_20px_40px_-20px_rgba(94,234,212,0.35)]"
              >
                <Icon size={26} className="text-gray-100" />
                <div>
                  <p className="font-mono font-semibold text-gray-100">{name}</p>
                  <p className="font-mono text-[11px] text-teal-300 mt-1 opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    ◇ isolated container
                  </p>
                </div>
              </div>
            ))}

            <div className="relative bg-black border border-dashed border-gray-700 rounded-lg p-5 h-36 flex flex-col justify-between items-start">
              <span className="font-mono text-2xl text-gray-600">+</span>
              <div>
                <p className="font-mono font-semibold text-gray-400">Rust, Ruby, PHP…</p>
                <p className="font-mono text-[11px] text-teal-300 mt-1">◇ and more</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="border-t border-gray-800 bg-gray-900/30">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-xs text-teal-300 mb-2">PROCESS</p>
          <h2 className="font-mono font-bold text-2xl md:text-3xl text-gray-100 mb-12">
            Three steps, one running container
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((s) => (
              <div key={s.n} className="border-t border-gray-700 pt-5">
                <p className="font-mono text-teal-300 text-sm mb-3">{s.n}</p>
                <h3 className="font-mono font-semibold text-gray-100 mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-xs text-teal-300 mb-2">ISOLATION</p>
          <h2 className="font-mono font-bold text-2xl md:text-3xl text-gray-100 mb-12 max-w-lg">
            Your container. Nobody else's problem.
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-800 rounded-lg overflow-hidden">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-black p-6">
                <h3 className="font-mono font-semibold text-gray-100 mb-2 text-sm">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h2 className="font-mono font-bold text-2xl md:text-4xl text-gray-100 mb-4">
            Your next container is one click away.
          </h2>
          <p className="text-gray-400 mb-8">
            No setup on your machine. No dependency conflicts. Just an isolated place to run your code.
          </p>
          <button
            onClick={handleStartClick}
            className="bg-teal-300 text-black font-mono font-semibold px-7 py-3.5 rounded-md hover:bg-teal-200 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-black"
          >
            {authStatus === "in" ? "Go to your workspaces →" : "Create your first workspace →"}
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-sm bg-teal-300" />
            <span className="font-mono text-sm text-gray-400">cloudCode</span>
          </div>
          <p className="font-mono text-xs text-gray-600">isolated containers, any language, your workspace.</p>
        </div>
      </footer>
    </div>
  );
}