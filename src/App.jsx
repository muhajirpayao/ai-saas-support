// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/routes/ProtectedRoute";
import Landpage from "@/pages/Landpage";
import AuthFlow from "@/pages/AuthFlow";
import Dashboard from "@/pages/Dashboard";
import SignupPage from "@/pages/auth/SignupPage";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing */}
        <Route path="/" element={<Landpage />} />

        {/* Real, wired-to-Supabase auth pages */}
        <Route path="/signup" element={<SignupPage />} />

        {/* AuthFlow still owns login + onboarding internally for now */}
        <Route path="/login" element={<AuthFlow />} />
        <Route path="/onboarding" element={<AuthFlow />} />

        {/* Authenticated */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}