import {BrowserRouter , Route , Routes } from "react-router-dom"
import LandingPage from "./page/LandingPage"
import Dashboard from "./page/Dashboard"
import PlayGround from "./page/PlayGround"
import { WorkspaceProvider } from "./context/WorkspaceContext"
import WorkspaceProgressModal from "./components/workspace/WorkspaceProgressModel"
function App() {
  return (
    <WorkspaceProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={< LandingPage/>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workspace/:workspaceId" element={< PlayGround /> } />
        </Routes>
        <WorkspaceProgressModal />
      </BrowserRouter>
    </WorkspaceProvider>
  )
}

export default App
