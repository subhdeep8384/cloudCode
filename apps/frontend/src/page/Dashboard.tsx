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
  { name: "React", icon: Atom, desc: "Frontend UI library" },
  { name: "Next.js", icon: Triangle, desc: "React framework" },
  { name: "Vue", icon: Layers, desc: "Frontend framework" },
  { name: "Node.js", icon: Hexagon, desc: "JavaScript runtime" },
  { name: "Python", icon: FileCode2, desc: "General purpose" },
  { name: "Java", icon: Coffee, desc: "General purpose" },
  { name: "C++", icon: Cpu, desc: "Systems programming" },
  { name: "Go", icon: Zap, desc: "Backend & CLI tools" },
  { name: "Django", icon: Server, desc: "Python web framework" },
  { name: "Empty container", icon: Box, desc: "Blank environment" },
];

/* ---------------------------------------------------------
   UI pieces
--------------------------------------------------------- */
function StatusPill({ status }) {
  const isRunning = status === "Running";
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono text-[11px] px-2 py-0.5 rounded-full ${
        isRunning ? "bg-teal-300/10 text-teal-300" : "bg-gray-800 text-gray-500"
      }`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {isRunning && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-300 opacity-75" />
        )}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${isRunning ? "bg-teal-300" : "bg-gray-600"}`} />
      </span>
      {status}
    </span>
  );
}

function ProjectCard({ project }) {
  return (
    <div className="group relative rounded-lg bg-gray-900 border border-gray-800 p-4 hover:border-teal-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(94,234,212,0.35)]">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-mono font-semibold text-gray-100 text-sm">{project.name}</h3>
          <p className="font-mono text-xs text-gray-500 mt-0.5">{project.template}</p>
        </div>
        <button className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-gray-100 transition-opacity">
          <MoreVertical size={16} />
        </button>
      </div>

      <div className="flex items-center justify-between mt-4">
        <StatusPill status={project.status} />
        <span className="font-mono text-xs text-gray-600">{project.createdAt}</span>
      </div>

      <button className="w-full mt-4 flex items-center justify-center gap-1.5 font-mono text-sm font-medium text-gray-300 border border-gray-800 rounded-md py-1.5 hover:bg-teal-300 hover:text-black hover:border-teal-300 transition-colors">
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
      className={`relative text-left rounded-lg border p-3 transition-all duration-150 ${
        selected
          ? "border-teal-300 bg-teal-300/5 ring-1 ring-teal-300/40"
          : "border-gray-800 bg-black hover:border-gray-700 hover:bg-gray-900"
      }`}
    >
      {selected && (
        <span className="absolute top-2 right-2 h-4 w-4 rounded-full bg-teal-300 flex items-center justify-center">
          <Check size={11} className="text-black" />
        </span>
      )}
      <div className="h-8 w-8 rounded-md border border-gray-800 bg-gray-900 flex items-center justify-center">
        <Icon size={16} className="text-gray-100" />
      </div>
      <p className="font-mono text-sm font-medium text-gray-100 mt-2.5">{template.name}</p>
      <p className="text-xs text-gray-500 mt-0.5">{template.desc}</p>
    </button>
  );
}

function CreateProjectModal({ onClose, onCreate }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [name, setName] = useState("");

  const canCreate = selectedTemplate && name.trim().length > 0;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-lg w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <h2 className="font-mono text-base font-semibold text-gray-100">Create project</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-300 rounded"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4">
          <label className="font-mono text-xs text-gray-400">Project name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="my-new-project"
            className="mt-1.5 w-full bg-black border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-100 placeholder-gray-600 outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-300/40 transition-colors"
          />

          <label className="font-mono text-xs text-gray-400 mt-5 block">Choose a template</label>
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

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-800">
          <button
            onClick={onClose}
            className="font-mono text-sm font-medium text-gray-400 px-4 py-2 rounded-md hover:bg-gray-800 hover:text-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!canCreate}
            onClick={() => canCreate && onCreate({ name: name.trim(), template: selectedTemplate })}
            className="font-mono text-sm font-semibold text-black px-4 py-2 rounded-md bg-teal-300 hover:bg-teal-200 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
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
    <div className="min-h-screen bg-black font-sans">
      <div className="max-w-6xl mx-auto px-6 py-8 sm:px-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-2 h-2 rounded-sm bg-teal-300" />
              <span className="font-mono text-xs text-gray-500">cloudCode</span>
            </div>
            <h1 className="font-mono text-xl font-bold text-gray-100">Projects</h1>
            <p className="font-mono text-sm text-gray-500 mt-0.5">
              {projects.length} projects · {running} running
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 font-mono text-sm font-semibold text-black px-4 py-2 rounded-md bg-teal-300 hover:bg-teal-200 transition-colors"
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