enum Status {
  RUNNING = "RUNNING",
  STOPPED = "STOPPED",
}
function StatusPill({ status } :{status : Status } ) {
  const isRunning = status === "RUNNING";
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono text-[11px] px-2 py-0.5 rounded-full ${isRunning ? "bg-teal-300/10 text-teal-300" : "bg-gray-800 text-gray-500"
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

export default StatusPill 