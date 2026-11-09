import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import NotFound from "./pages/NotFound";
import ThoughtGarden from "./pages/ThoughtGarden";
import Settings from "./pages/Settings";
import TheCalmCorner from "./pages/TheCalmCorner";
import MyCalendar from "./pages/MyCalendar";
import TheExpertNetwork from "./pages/TheExpertNetwork";
import AppLayout from "./layouts/AppLayout";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/context/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MySanctuary from "./pages/MySanctuary";
import MyBookings from "./pages/MyBookings";
import MyBookingsSimple from "./pages/MyBookingsSimple";
import TestBookings from "./pages/TestBookings";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<ProtectedRoute><MySanctuary /></ProtectedRoute>} />
                  {/* Home route removed */}
                  <Route path="/journal" element={<ProtectedRoute><ThoughtGarden /></ProtectedRoute>} />
                  <Route path="/blog" element={<ProtectedRoute><TheCalmCorner /></ProtectedRoute>} />
                  <Route path="/calendar" element={<ProtectedRoute><MyCalendar /></ProtectedRoute>} />
                  <Route path="/psychologists" element={<ProtectedRoute><TheExpertNetwork /></ProtectedRoute>} />
                  <Route path="/bookings" element={<ProtectedRoute><MyBookingsSimple /></ProtectedRoute>} />
                  <Route path="/bookings-full" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
                  <Route path="/test-bookings" element={<ProtectedRoute><TestBookings /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
