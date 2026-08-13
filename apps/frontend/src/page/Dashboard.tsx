import { useEffect, useState } from "react";
import axios from "axios";
import CreateProjectModal from "../components/dashboardComponents/CreateProjectModel";
import {  Plus } from "lucide-react";
import ProjectCard from "../components/dashboardComponents/ProjectCard";


export default function Dashboard() {
  const [projects, setProjects] = useState<{
    id: string,
    name: string,
    createdAt: Date,
    type: string
  }[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchAllProject = async () => {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/workspace`, {
        withCredentials: true
      });
      setProjects(res.data)
    }
    fetchAllProject();
  }, [])



  const running = 1
  const handleCreate = () => {

  }
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
            <ProjectCard key={p.id + Math.random()} project={p} />
          ))}
        </div>
      </div>

      {showModal && <CreateProjectModal onClose={() => setShowModal(false)} onCreate={handleCreate} />}
    </div>
  );
}