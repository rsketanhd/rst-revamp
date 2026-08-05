import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell, RequireAuth } from './components/layout'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { ModulePage } from './pages/ModulePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          element={
            <RequireAuth>
              <AppShell />
            </RequireAuth>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/jobs" element={<DashboardPage />} />
          <Route path="/candidates" element={<ModulePage />} />
          <Route path="/candidate-discovery" element={<ModulePage />} />
          <Route path="/client-management" element={<ModulePage />} />
          <Route path="/talent-crm" element={<ModulePage />} />
          <Route path="/jeeves-ai" element={<ModulePage />} />
          <Route path="/e2e-interviews" element={<ModulePage />} />
          <Route path="/e2e-interviews/schedule" element={<ModulePage />} />
          <Route path="/e2e-interviews/feedback" element={<ModulePage />} />
          <Route path="/reports" element={<ModulePage />} />
          <Route path="/settings" element={<ModulePage />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
