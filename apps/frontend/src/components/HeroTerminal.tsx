import { Check } from "lucide-react";
import { useEffect, useState } from "react";

function HeroTerminal() {
  const CMD = "cloudcode new --lang=python my-workspace";
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const start = setTimeout(function tick() {
      if (i <= CMD.length) {
        setTyped(CMD.slice(0, i));
        i++;
        setTimeout(tick, 38);
      } else {
        setDone(true);
      }
    }, 500);
    return () => clearTimeout(start);
  }, []);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden shadow-2xl">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-800 bg-gray-800/40">
        <span className="w-2.5 h-2.5 rounded-full bg-gray-700" />
        <span className="w-2.5 h-2.5 rounded-full bg-gray-700" />
        <span className="w-2.5 h-2.5 rounded-full bg-gray-700" />
        <span className="ml-3 font-mono text-xs text-gray-600">workspace/new</span>
      </div>
      <div className="p-5 font-mono text-sm leading-7">
        <p className="text-gray-400">
          ${" "}
          <span className="text-gray-100">{typed}</span>
          {!done && <span className="inline-block w-2 h-4 bg-teal-300 ml-1 align-middle animate-pulse" />}
        </p>
        {done && (
          <div className="mt-2 space-y-1 animate-[fadeIn_0.5s_ease-in]">
            <p className="text-gray-400 flex items-center gap-1.5">
              <Check size={14} className="text-teal-300" />
              container provisioned <span className="text-teal-300">python:3.12-isolated</span>
            </p>
            <p className="text-gray-400 flex items-center gap-1.5">
              <Check size={14} className="text-teal-300" />
              workspace ready at <span className="text-gray-100">/workspaces/my-workspace</span>
            </p>
            <p className="text-teal-300">$ ready for input</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HeroTerminal