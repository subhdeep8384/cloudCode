import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react"; 

type WorkspaceContextType = {
  showModal: boolean;
  isRunning: boolean;
  currentStep: number;
  logs: string[];
  error: string | null;

  startAndRunWorkspace: (projectId: string) => Promise<boolean>;
  closeModal: () => void;
};

const WorkspaceContext =
  createContext<WorkspaceContextType | null>(null);

  export function WorkspaceProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [showModal, setShowModal] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, message]);
  };

  const startAndRunWorkspace = async (projectId: string) => {
    setShowModal(true);
    setIsRunning(true);
    setCurrentStep(0);
    setLogs([]);
    setError(null);

    try {
    
      setCurrentStep(1);
      addLog("Creating workspace...");

      const response1 = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/workspace/${projectId}/start`,
        {
          method: "POST",
          credentials : "include"
        }
      );

      const data1 = await response1.json();

      if (!response1.ok) {
        throw new Error(
          data1.message || "Failed to create workspace"
        );
      }

      addLog(`✓ ${data1.message}`);


      // =========================
      // API 2
      // =========================

      setCurrentStep(2);
      addLog("Starting container...");

      const response2 = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/workspace/${projectId}/install`,
        {
          method: "POST",
          credentials : "include"
        }
      );

      const data2 = await response2.json();

      if (!response2.ok) {
        throw new Error(
          data2.message || "Failed to start container"
        );
      }

      addLog(`✓ ${data2.message}`);


      // =========================
      // API 3
      // =========================

      setCurrentStep(3);
      addLog("Installing dependencies...");

      const response3 = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/workspace/${projectId}/run`,
        {
          method: "POST",
          credentials : "include"
        }
      );

      const data3 = await response3.json();

      if (!response3.ok) {
        throw new Error(
          data3.message || "Failed to install dependencies"
        );
      }

      addLog(`✓ ${data3.message}`);


      // =========================
      // DONE
      // =========================

      setCurrentStep(4);
      addLog("✓ Workspace is ready!");

      setIsRunning(false);
      return true ;

    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong";

      setError(message);

      addLog(`✕ ${message}`);

      setIsRunning(false);
      return false 
    }
  };

  const closeModal = () => {
    if (isRunning) return;

    setShowModal(false);
    setLogs([]);
    setCurrentStep(0);
    setError(null);
  };

  return (
    <WorkspaceContext.Provider
      value={{
        showModal,
        isRunning,
        currentStep,
        logs,
        error,
        startAndRunWorkspace,
        closeModal,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error(
      "useWorkspace must be used inside WorkspaceProvider"
    );
  }

  return context;
}