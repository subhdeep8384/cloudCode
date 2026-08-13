interface Props {
    authStatus : string  ,
    email : string ,
    onLoginClick : () => void  ,
    onLogout : () => void 
}

function AuthArea({ authStatus, email, onLoginClick, onLogout } : Props) {
  if (authStatus === "checking") {
    return <div className="h-9 w-42" aria-hidden="true" />;
  }

  if (authStatus === "in") {
    return (
      <div className="flex items-center gap-3">
        <span className="hidden sm:flex items-center gap-2 font-mono text-sm text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-300" />
          {email || "you@cloudcode"}
        </span>
        <button
          onClick={onLogout}
          className="font-mono text-sm border border-gray-700 text-gray-100 px-4 py-2 rounded-md hover:border-teal-300 hover:text-teal-300 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-300"
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onLoginClick}
        className="font-mono text-sm text-gray-400 hover:text-gray-100 transition-colors px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300 rounded"
      >
        Log in
      </button>
      <button
        onClick={onLoginClick}
        className="font-mono text-sm bg-teal-300 text-black font-semibold px-4 py-2 rounded-md hover:bg-teal-200 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-black"
      >
        Sign up free
      </button>
    </div>
  );
}
export default AuthArea ;