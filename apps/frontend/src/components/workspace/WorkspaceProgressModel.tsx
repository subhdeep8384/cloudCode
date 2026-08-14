import { useWorkspace } from "../../context/WorkspaceContext";

export default function WorkspaceProgressModal() {
  const {
    showModal,
    isRunning,
    currentStep,
    logs,
    error,
    closeModal,
  } = useWorkspace();

  if (!showModal) return null;

  const progress = currentStep * 25;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

      <div className="w-137.5 rounded-xl border border-gray-800 bg-[#0d0d0d] p-6 shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-lg font-semibold text-white">
              Starting Workspace
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Preparing your development environment
            </p>
          </div>

          {!isRunning && (
            <button
              onClick={closeModal}
              className="text-gray-500 hover:text-white"
            >
              ✕
            </button>
          )}

        </div>


        {/* Progress */}

        <div className="mt-6">

          <div className="mb-2 flex justify-between text-xs text-gray-500">
            <span>Progress</span>

            <span>
              {progress}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-gray-800">

            <div
              className="h-full bg-teal-400 transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>


        {/* Steps */}

        <div className="mt-6 space-y-3 text-sm">

          <Step
            active={currentStep === 1}
            completed={currentStep > 1}
            text="Creating workspace"
          />

          <Step
            active={currentStep === 2}
            completed={currentStep > 2}
            text="Starting container"
          />

          <Step
            active={currentStep === 3}
            completed={currentStep > 3}
            text="Installing dependencies"
          />

          <Step
            active={currentStep === 4}
            completed={currentStep >= 4}
            text="Workspace ready"
          />

        </div>


        {/* Logs */}

        <div className="mt-6 h-48 overflow-y-auto rounded-lg border border-gray-800 bg-black p-4">

          <div className="space-y-1 font-mono text-xs">

            {logs.map((log, index) => (
              <div
                key={index}
                className={
                  log.startsWith("✕")
                    ? "text-red-400"
                    : log.startsWith("✓")
                      ? "text-green-400"
                      : "text-gray-400"
                }
              >
                {log}
              </div>
            ))}

            {isRunning && (
              <div className="animate-pulse text-teal-400">
                ▌
              </div>
            )}

          </div>

        </div>


        {/* Error */}

        {error && (
          <div className="mt-4 rounded-md border border-red-900 bg-red-950/30 p-3 text-sm text-red-400">
            {error}
          </div>
        )}


        {/* Done */}

        {!isRunning && (
          <button
            onClick={closeModal}
            className="mt-5 w-full rounded-md bg-teal-400 py-2 text-sm font-medium text-black hover:bg-teal-300"
          >
            {error ? "Close" : "Done"}
          </button>
        )}

      </div>

    </div>
  );
}

function Step({
  active,
  completed,
  text,
}: {
  active: boolean;
  completed: boolean;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3">

      <div
        className={`
          flex h-7 w-7 items-center justify-center
          rounded-full text-xs

          ${
            completed
              ? "bg-green-400 text-black"
              : active
                ? "bg-teal-400 text-black"
                : "bg-gray-800 text-gray-500"
          }
        `}
      >
        {completed ? "✓" : "○"}
      </div>

      <span
        className={
          completed
            ? "text-green-400"
            : active
              ? "text-white"
              : "text-gray-500"
        }
      >
        {text}
      </span>

      {active && !completed && (
        <span className="ml-auto text-xs text-teal-400">
          Running...
        </span>
      )}

    </div>
  );
}