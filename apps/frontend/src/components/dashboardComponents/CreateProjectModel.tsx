import { useState } from "react";
import { TEMPLATES } from "../../contants/templates";
import TemplateCard from "./TemplateCard";
import { X } from "lucide-react";

interface Props {
    onClose : () => void 
    onCreate : ({}) => void 
}

function CreateProjectModal({ onClose, onCreate } : Props) {
  const [selectedTemplate, setSelectedTemplate] = useState("");
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

export default CreateProjectModal 