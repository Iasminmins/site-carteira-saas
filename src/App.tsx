
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CertificateProvider } from "@/contexts/CertificateContext";

// Import pages
import Login from "./pages/Login";
import Dashboard from "./pages/admin/Dashboard";
import CertificatesManagement from "./pages/admin/CertificatesManagement";
import EmployeesManagement from "./pages/admin/EmployeesManagement";
import EmployeeDetails from "./pages/admin/EmployeeDetails";
import Settings from "./pages/admin/Settings";
import NewCertificate from "./pages/admin/NewCertificate";
import EmployeeCertificates from "./pages/employee/EmployeeCertificates";
import PublicCertificate from "./pages/PublicCertificate";
import PublicEmployee from "./pages/PublicEmployee";
import NotFound from "./pages/NotFound";
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import CompanyManagement from "./pages/superadmin/CompanyManagement";

// Add API service for MongoDB integration
import ApiProvider from "./services/ApiProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Protected route component
const ProtectedRoute = ({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode, 
  requiredRole?: "superadmin" | "admin" | "employee" 
}) => {
  // For demo purposes, we're just checking if user exists in local storage
  // In a real app, this would validate the JWT token or session
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on role
    if (user.role === "superadmin") {
      return <Navigate to="/superadmin/dashboard" replace />;
    } else if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/employee/certificates" replace />;
    }
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ApiProvider>
      <TooltipProvider>
        <AuthProvider>
          <CertificateProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Login />} />
              
              {/* SuperAdmin Routes */}
              <Route 
                path="/superadmin/dashboard" 
                element={
                  <ProtectedRoute requiredRole="superadmin">
                    <SuperAdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/superadmin/companies" 
                element={
                  <ProtectedRoute requiredRole="superadmin">
                    <CompanyManagement />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/certificates" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <CertificatesManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/certificates/new" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <NewCertificate />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/employees" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <EmployeesManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/employees/:id" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <EmployeeDetails />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/settings" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              
              {/* Employee Routes */}
              <Route 
                path="/employee/certificates" 
                element={
                  <ProtectedRoute requiredRole="employee">
                    <EmployeeCertificates />
                  </ProtectedRoute>
                } 
              />
              
              {/* Public Certificate View */}
              <Route path="/certificate/:id" element={<PublicCertificate />} />
              
              {/* Public Employee View - Shows all certificates */}
              <Route path="/employee/:id" element={<PublicEmployee />} />
              
              {/* Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CertificateProvider>
        </AuthProvider>
      </TooltipProvider>
    </ApiProvider>
  </QueryClientProvider>
);

export default App;
