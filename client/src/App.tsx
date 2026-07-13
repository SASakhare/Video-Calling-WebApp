import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "@/lib/query-client";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import { PublicLayout } from "@/components/layouts/PublicLayout";
import { AuthLayout } from "@/components/layouts/AuthLayout";
import { AppLayout } from "@/components/layouts/AppLayout";

import Landing from "@/pages/public/Landing";
import Features from "@/pages/public/Features";
import About from "@/pages/public/About";
import Pricing from "@/pages/public/Pricing";
import Contact from "@/pages/public/Contact";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import VerifyEmail from "@/pages/auth/VerifyEmail";

import Dashboard from "@/pages/dashboard/Dashboard";
import CreateMeeting from "@/pages/meetings/CreateMeeting";
import JoinMeeting from "@/pages/meetings/JoinMeeting";
import MeetingCreated from "@/pages/meetings/MeetingCreated";
import MeetingLobby from "@/pages/meetings/MeetingLobby";
import WaitingRoom from "@/pages/meetings/WaitingRoom";
import MeetingRoom from "@/pages/meetings/MeetingRoom";
import MeetingSummary from "@/pages/meetings/MeetingSummary";
import MeetingRoomLayout from "@/components/layouts/MeetingRoomLayout";
import History from "@/pages/history/History";
import NotificationsPage from "@/pages/notifications/NotificationsPage";
import Profile from "@/pages/profile/Profile";
import Settings from "@/pages/settings/Settings";
import Help from "@/pages/help/Help";
import ErrorPage from "@/pages/errors/ErrorPage";
import MeetingUpdate from "./pages/meetings/MeetingUpdate";
import { CookiesProvider } from 'react-cookie';

export default function App() {
  return (

    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <CookiesProvider>

          <TooltipProvider delayDuration={200}>
            <Toaster position="top-right" richColors closeButton />
            <BrowserRouter>
              <Routes>
                {/* //* Public */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<Landing />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/contact" element={<Contact />} />
                </Route>

                {/* //* Auth */}
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/verify-email" element={<VerifyEmail />} />
                </Route>

                {/* //* App */}
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/meetings/new" element={<CreateMeeting />} />
                  <Route path="/meetings/join" element={<JoinMeeting />} />
                  <Route path="/meetings/created/:id" element={<MeetingCreated />} />
                  <Route path="/meetings/lobby/:id" element={<MeetingLobby />} />
                  <Route path="/meetings/waiting/:id" element={<WaitingRoom />} />
                  <Route path="/meetings/edit/:meetingId" element={<MeetingUpdate />} />
                  <Route path="/meetings/summary/:id" element={<MeetingSummary />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/help" element={<Help />} />
                </Route>

                {/* //* Live Meeting Layout Shell */}
                <Route element={<MeetingRoomLayout />}>
                  <Route path="/meetings/room/:id" element={<MeetingRoom />} />
                </Route>

                {/* //* Errors */}
                <Route path="/unauthorized" element={<ErrorPage code="401" title="Unauthorized" description="You don't have permission to view this page." />} />
                <Route path="/500" element={<ErrorPage code="500" title="Server error" description="Something went wrong on our end. We're on it." />} />
                <Route path="/404" element={<ErrorPage code="404" title="Not found" description="We couldn't find the page you were looking for." />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CookiesProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
