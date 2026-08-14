import { AdIcon, Check, type LucideIcon } from "lucide-react";

interface Props {
    template: {
        name: string,
        icon: LucideIcon
        desc: string
    },
    selected: boolean,
    onSelect: () => void
}

function TemplateCard({ template, selected, onSelect }: Props) {
    return (
        <button
            onClick={onSelect}
            className={`relative text-left rounded-lg border p-3 transition-all duration-150 ${selected
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
                <AdIcon size={16} className="text-gray-100" />
            </div>
            <p className="font-mono text-sm font-medium text-gray-100 mt-2.5">{template.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{template.desc}</p>
        </button>
    );
}

export default TemplateCard