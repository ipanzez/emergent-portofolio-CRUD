import "@/App.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import Home from "@/pages/Home";
import ProjectDetail from "@/pages/ProjectDetail";
import Login from "@/pages/admin/Login";
import AdminLayout from "@/pages/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import ProfileEditor from "@/pages/admin/ProfileEditor";
import SkillsTools from "@/pages/admin/SkillsTools";
import ExperiencesAdmin from "@/pages/admin/ExperiencesAdmin";
import ProjectsAdmin from "@/pages/admin/ProjectsAdmin";
import ProjectForm from "@/pages/admin/ProjectForm";
import Settings from "@/pages/admin/Settings";

const PublicRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="profile" element={<ProfileEditor />} />
                <Route path="skills" element={<SkillsTools />} />
                <Route path="experience" element={<ExperiencesAdmin />} />
                <Route path="projects" element={<ProjectsAdmin />} />
                <Route path="projects/new" element={<ProjectForm />} />
                <Route path="projects/:id" element={<ProjectForm />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>
            <Route path="/*" element={<PublicRoutes />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </div>
  );
}

export default App;
