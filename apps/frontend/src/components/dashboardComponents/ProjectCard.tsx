import { MoreVertical, Play } from "lucide-react";
import { useWorkspace } from "../../context/WorkspaceContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function ProjectCard({ project }: {
  project: {
    id: string,
    name: string,
    createdAt: Date,
    type: string
  }
}) {
  const { startAndRunWorkspace } = useWorkspace();
  const navigate = useNavigate()

  return (
    <div className="group relative rounded-lg bg-gray-900 border border-gray-800 p-4 hover:border-teal-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(94,234,212,0.35)]">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-mono font-semibold text-gray-100 text-sm">{project.name}</h3>
          <p className="font-mono text-xs text-gray-500 mt-0.5">{project.type}</p>
        </div>
        <button className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-gray-100 transition-opacity">
          <MoreVertical size={16} />
        </button>
      </div>

      <div className="flex items-center justify-between mt-4">

        <span className="font-mono text-xs text-gray-600">
          {new Date(project.createdAt).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </span>
      </div>

      <button className="w-full mt-4 flex items-center justify-center gap-1.5 font-mono text-sm font-medium text-gray-300 border border-gray-800 rounded-md py-1.5 hover:bg-teal-300 hover:text-black hover:border-teal-300 transition-colors"
        onClick={async () => {
          const success = await startAndRunWorkspace(project.id)
          if (success) {
            navigate(`/workspace/${project.id}`)
          }
        }}
      >
        <Play size={12} />
        Open
      </button>
    </div>
  );
}
export default ProjectCard