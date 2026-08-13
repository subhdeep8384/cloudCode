export  const FEATURES = [
  {
    title: "Per-workspace containers",
    body: "Every project you create runs in its own container — no shared runtime, no noisy neighbors.",
  },
  {
    title: "Any language, same flow",
    body: "Next.js, React, Node, Python, Java, C++, and more — the same create-and-run flow for all of them.",
  },
  {
    title: "Pause and resume",
    body: "Step away and your container pauses. Come back and pick up exactly where you left off.",
  },
  {
    title: "Clean teardown",
    body: "Delete a workspace and its container is destroyed with it — nothing lingers on shared infrastructure.",
  },
];

import { Terminal, Check, X, Triangle, Atom, Hexagon, Coffee, Cpu } from "lucide-react";

export const RUNTIMES = [
  { name: "Next.js", icon: Triangle },
  { name: "React", icon: Atom },
  { name: "Node.js", icon: Hexagon },
  { name: "Python", icon: Terminal },
  { name: "Java", icon: Coffee },
  { name: "C++", icon: Cpu },
  { name: "Go", icon: Terminal },
];

export const STEPS = [
  {
    n: "01",
    title: "Name your workspace",
    body: "Give your project a name and choose a language or framework — Next.js, React, Node, Python, Java, C++, and others.",
  },
  {
    n: "02",
    title: "Get an isolated container",
    body: "cloudCode provisions a dedicated container for your workspace — separate filesystem, network, and process space from every other user.",
  },
  {
    n: "03",
    title: "Code, run, repeat",
    body: "Write and execute code directly inside the container. Stop it, resume it later, or spin up a fresh one for the next idea.",
  },
];
