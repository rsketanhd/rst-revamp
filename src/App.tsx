import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell, RequireAuth } from './components/layout'
import { ToastProvider } from './components/ui'
import { CandidateDiscoveryPage } from './pages/CandidateDiscoveryPage'
import { CandidatesPage } from './pages/CandidatesPage'
import { CreateJobPage } from './pages/CreateJobPage'
import { DashboardPage } from './pages/DashboardPage'
import { JobApplicationsPage } from './pages/JobApplicationsPage'
import { JobsPage } from './pages/JobsPage'
import { JeevesAiPage } from './pages/JeevesAiPage'
import { LoginPage } from './pages/LoginPage'
import { ModulePage } from './pages/ModulePage'
import { CreateOneWayInterviewPage } from './pages/CreateOneWayInterviewPage'
import { InterviewSchedulerPage } from './pages/InterviewSchedulerPage'
import { OneWayInterviewDetailPage } from './pages/OneWayInterviewDetailPage'
import { OneWayInterviewsPage } from './pages/OneWayInterviewsPage'
import { SettingsPage } from './pages/SettingsPage'

export default function App() {
  return (
    <ToastProvider>
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
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/new" element={<CreateJobPage />} />
            <Route
              path="/jobs/:jobCode/applications"
              element={<JobApplicationsPage />}
            />
            <Route path="/candidates" element={<CandidatesPage />} />
            <Route
              path="/candidate-discovery"
              element={<CandidateDiscoveryPage />}
            />
            <Route path="/client-management" element={<ModulePage />} />
            <Route path="/talent-crm" element={<ModulePage />} />
            <Route path="/jeeves-ai" element={<JeevesAiPage />} />
            <Route path="/e2e-interviews" element={<ModulePage />} />
            <Route
              path="/e2e-interviews/one-way"
              element={<OneWayInterviewsPage />}
            />
            <Route
              path="/e2e-interviews/one-way/new"
              element={<CreateOneWayInterviewPage />}
            />
            <Route
              path="/e2e-interviews/one-way/:interviewId"
              element={<OneWayInterviewDetailPage />}
            />
            <Route path="/e2e-interviews/two-way" element={<ModulePage />} />
            <Route
              path="/e2e-interviews/scheduler"
              element={<InterviewSchedulerPage />}
            />
            <Route
              path="/e2e-interviews/schedule"
              element={<InterviewSchedulerPage />}
            />
            <Route path="/e2e-interviews/feedback" element={<ModulePage />} />
            <Route path="/reports" element={<ModulePage />} />
            <Route path="/settings/:sectionId" element={<SettingsPage />} />
            <Route
              path="/settings"
              element={<Navigate to="/settings/recruiter-profile" replace />}
            />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}
