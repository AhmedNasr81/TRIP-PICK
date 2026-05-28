import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout";
import { ProtectedRoute } from "@/components/protected-route";
import { LoadingScreen } from "@/components/loading-screen";

// Pages
import Home from "@/pages/home";
import Programs from "@/pages/programs";
import ProgramDetail from "@/pages/program-detail";
import Companies from "@/pages/companies";
import CompanyProfile from "@/pages/company-profile";
import CountryPage from "@/pages/country-page";

import Login from "@/pages/login";
import Register from "@/pages/register";
import ForgotPassword from "@/pages/forgot-password";
import ResetPassword from "@/pages/reset-password";
import VerifyEmail from "@/pages/verify-email";

import Profile from "@/pages/profile";
import Favorites from "@/pages/favorites";

import Dashboard from "@/pages/dashboard";
import CompanySetup from "@/pages/company-setup";

import AdminDashboard from "@/pages/admin/dashboard";
import AdminUsers from "@/pages/admin/users";
import AdminCountries from "@/pages/admin/countries";
import AdminPrograms from "@/pages/admin/programs";
import AdminCompanies from "@/pages/admin/companies";

import NotFound from "@/pages/not-found";

// Stable QueryClient — created once outside the component tree
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/programs" component={Programs} />
      <Route path="/programs/:id" component={ProgramDetail} />
      <Route path="/companies" component={Companies} />
      <Route path="/companies/:id" component={CompanyProfile} />
      <Route path="/countries/:id" component={CountryPage} />

      {/* Auth Routes */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/verify-email" component={VerifyEmail} />

      {/* Protected: All Authenticated Users */}
      <Route path="/profile">
        <ProtectedRoute><Profile /></ProtectedRoute>
      </Route>

      {/* Protected: Tourist Only */}
      <Route path="/favorites">
        <ProtectedRoute allowedRoles={['tourist']}><Favorites /></ProtectedRoute>
      </Route>

      {/* Protected: Company Only */}
      <Route path="/dashboard">
        <ProtectedRoute allowedRoles={['company']}><Dashboard /></ProtectedRoute>
      </Route>
      <Route path="/company-setup">
        <ProtectedRoute allowedRoles={['company']}><CompanySetup /></ProtectedRoute>
      </Route>

      {/* Protected: Admin Only */}
      <Route path="/admin">
        <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
      </Route>
      <Route path="/admin/users">
        <ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>
      </Route>
      <Route path="/admin/countries">
        <ProtectedRoute allowedRoles={['admin']}><AdminCountries /></ProtectedRoute>
      </Route>
      <Route path="/admin/programs">
        <ProtectedRoute allowedRoles={['admin']}><AdminPrograms /></ProtectedRoute>
      </Route>
      <Route path="/admin/companies">
        <ProtectedRoute allowedRoles={['admin']}><AdminCompanies /></ProtectedRoute>
      </Route>

      {/* Fallback 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { isLoading } = useAuth();

  return (
    <>
      <LoadingScreen visible={isLoading} />
      <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, "") || ""}>
        <Layout>
          <Router />
        </Layout>
      </WouterRouter>
      <Toaster position="bottom-right" />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <AppContent />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
