import {BrowserRouter , Route , Routes } from "react-router-dom"
import LandingPage from "./page/LandingPage"
import Dashboard from "./page/Dashboard"
import PlayGround from "./page/PlayGround"
function App() {
  return (
  <BrowserRouter>
      <Routes>
        <Route path="/" element={< LandingPage/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="workspace/:workspaceId" element={< PlayGround /> } />
      </Routes>
  </BrowserRouter>
  )
}

export default App
