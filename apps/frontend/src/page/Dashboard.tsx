import { useState } from "react";
import {
  Plus,
  X,
  Check,
  Atom,
  Triangle,
  Layers,
  FileCode2,
  Hexagon,
  Coffee,
  Cpu,
  Zap,
  Server,
  Box,
  MoreVertical,
  Play,
} from "lucide-react";

/* ---------------------------------------------------------
   Mock data
--------------------------------------------------------- */
const INITIAL_PROJECTS = [
  { id: 1, name: "portfolio-site", template: "Next.js", status: "Running", createdAt: "2 days ago" },
  { id: 2, name: "ml-pipeline", template: "Python", status: "Stopped", createdAt: "5 days ago" },
  { id: 3, name: "checkout-api", template: "Node.js", status: "Running", createdAt: "1 week ago" },
  { id: 4, name: "matrix-solver", template: "C++", status: "Stopped", createdAt: "2 weeks ago" },
  { id: 5, name: "auth-service", template: "Java", status: "Stopped", createdAt: "3 weeks ago" },
  { id: 6, name: "dashboard-ui", template: "React", status: "Running", createdAt: "1 month ago" },
  { id: 7, name: "landing-page", template: "React", status: "Stopped", createdAt: "1 month ago" },
  { id: 8, name: "data-scraper", template: "Python", status: "Stopped", createdAt: "2 months ago" },
  { id: 9, name: "blog-app", template: "Next.js", status: "Running", createdAt: "2 months ago" },
  { id: 10, name: "cli-tool", template: "Go", status: "Stopped", createdAt: "3 months ago" },
];

const TEMPLATES = [
  { name: "React", icon: Atom, desc: "Frontend UI library", from: "from-cyan-400", to: "to-blue-500" },
  { name: "Next.js", icon: Triangle, desc: "React framework", from: "from-zinc-300", to: "to-zinc-500" },
  { name: "Vue", icon: Layers, desc: "Frontend framework", from: "from-emerald-400", to: "to-green-500" },
  { name: "Node.js", icon: Hexagon, desc: "JavaScript runtime", from: "from-green-400", to: "to-emerald-600" },
  { name: "Python", icon: FileCode2, desc: "General purpose", from: "from-yellow-400", to: "to-blue-500" },
  { name: "Java", icon: Coffee, desc: "General purpose", from: "from-orange-400", to: "to-red-500" },
  { name: "C++", icon: Cpu, desc: "Systems programming", from: "from-blue-400", to: "to-indigo-600" },
  { name: "Go", icon: Zap, desc: "Backend & CLI tools", from: "from-cyan-300", to: "to-sky-500" },
  { name: "Django", icon: Server, desc: "Python web framework", from: "from-green-500", to: "to-teal-700" },
  { name: "Empty container", icon: Box, desc: "Blank environment", from: "from-zinc-500", to: "to-zinc-700" },
];

/* ---------------------------------------------------------
   UI pieces
--------------------------------------------------------- */
function StatusPill({ status }) {
  const isRunning = status === "Running";
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full font-medium ${
        isRunning ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-800 text-zinc-500"
      }`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {isRunning && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        )}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${isRunning ? "bg-emerald-400" : "bg-zinc-600"}`} />
      </span>
      {status}
    </span>
  );
}

function ProjectCard({ project }) {
  return (
    <div className="group relative rounded-2xl bg-zinc-900/60 border border-zinc-800 p-4 backdrop-blur-sm hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-200">
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: "radial-gradient(140px circle at 30% 0%, rgba(99,102,241,0.10), transparent 70%)" }}
      />

      <div className="relative flex items-start justify-between">
        <div>
          <h3 className="font-medium text-zinc-100 text-sm">{project.name}</h3>
          <p className="text-xs text-zinc-500 mt-0.5">{project.template}</p>
        </div>
        <button className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-zinc-300 transition-opacity">
          <MoreVertical size={16} />
        </button>
      </div>

      <div className="relative flex items-center justify-between mt-4">
        <StatusPill status={project.status} />
        <span className="text-xs text-zinc-600">{project.createdAt}</span>
      </div>

      <button className="relative w-full mt-4 flex items-center justify-center gap-1.5 text-sm font-medium text-zinc-300 border border-zinc-800 rounded-lg py-1.5 hover:bg-zinc-800 hover:text-white transition-colors">
        <Play size={12} />
        Open
      </button>
    </div>
  );
}

function TemplateCard({ template, selected, onSelect }) {
  const Icon = template.icon;
  return (
    <button
      onClick={onSelect}
      className={`relative text-left rounded-xl border p-3 transition-all duration-150 ${
        selected
          ? "border-indigo-500/60 bg-indigo-500/10 ring-1 ring-indigo-500/40"
          : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900"
      }`}
    >
      {selected && (
        <span className="absolute top-2 right-2 h-4 w-4 rounded-full bg-indigo-500 flex items-center justify-center">
          <Check size={11} className="text-white" />
        </span>
      )}
      <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${template.from} ${template.to} flex items-center justify-center`}>
        <Icon size={16} className="text-white" />
      </div>
      <p className="text-sm font-medium text-zinc-100 mt-2.5">{template.name}</p>
      <p className="text-xs text-zinc-500 mt-0.5">{template.desc}</p>
    </button>
  );
}

function CreateProjectModal({ onClose, onCreate }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [name, setName] = useState("");

  const canCreate = selectedTemplate && name.trim().length > 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <h2 className="text-base font-semibold text-zinc-100">Create project</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4">
          <label className="text-sm font-medium text-zinc-300">Project name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="my-new-project"
            className="mt-1.5 w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 transition-colors"
          />

          <label className="text-sm font-medium text-zinc-300 mt-5 block">Choose a template</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-2">
            {TEMPLATES.map((t) => (
              <TemplateCard
                key={t.name}
                template={t}
                selected={selectedTemplate === t.name}
                onSelect={() => setSelectedTemplate(t.name)}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="text-sm font-medium text-zinc-400 px-4 py-2 rounded-lg hover:bg-zinc-900 hover:text-zinc-200 transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!canCreate}
            onClick={() => canCreate && onCreate({ name: name.trim(), template: selectedTemplate })}
            className="text-sm font-medium text-white px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/20 disabled:shadow-none"
          >
            Create project
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Dashboard
--------------------------------------------------------- */
export default function Dashboard() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [showModal, setShowModal] = useState(false);

  const handleCreate = ({ name, template }) => {
    setProjects((prev) => [
      { id: Date.now(), name, template, status: "Stopped", createdAt: "just now" },
      ...prev,
    ]);
    setShowModal(false);
  };

  const running = projects.filter((p) => p.status === "Running").length;

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] opacity-20"
        style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.35), transparent 70%)" }}
      />

      <div className="relative max-w-6xl mx-auto px-6 py-8 sm:px-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-semibold text-zinc-100">Projects</h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              {projects.length} projects · {running} running
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 text-sm font-medium text-white px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 shadow-lg shadow-indigo-500/20 transition-all"
          >
            <Plus size={16} />
            Create project
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>

      {showModal && <CreateProjectModal onClose={() => setShowModal(false)} onCreate={handleCreate} />}
    </div>
  );
}