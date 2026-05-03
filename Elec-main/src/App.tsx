/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Navbar from "./components/layout/Navbar";
import FloatingChatWidget from "./components/chat/FloatingChatWidget";
import LoginModal from "./components/auth/LoginModal";
import { ToastProvider, useToast } from "./hooks/useToast";
import { useEffect } from "react";
import CustomCursor from "./components/ui/CustomCursor";

const Landing   = lazy(() => import("./pages/Landing"));
const Explore   = lazy(() => import("./pages/Explore"));
const Chat      = lazy(() => import("./pages/Chat"));
const Guide     = lazy(() => import("./pages/Guide"));
const Quiz      = lazy(() => import("./pages/Quiz"));
const QuizSess  = lazy(() => import("./pages/QuizSession"));
const Process   = lazy(() => import("./pages/Process"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login     = lazy(() => import("./pages/Login"));
const Signup    = lazy(() => import("./pages/Signup"));
const NotFound  = lazy(() => import("./pages/NotFound"));

function GlobalErrorHandler() {
  const { toast } = useToast();
  useEffect(() => {
    const handleError = (e: Event) => {
      const customEvent = e as CustomEvent;
      toast({ type: "error", message: customEvent.detail || "An unexpected error occurred" });
    };
    window.addEventListener("api-error", handleError);
    return () => window.removeEventListener("api-error", handleError);
  }, [toast]);
  return null;
}

const Loader = () => (
  <div className="min-h-screen bg-navy-900 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function App() {
  return (
    <ToastProvider>
      <CustomCursor />
      <GlobalErrorHandler />
      <BrowserRouter>
        <Navbar />
        <LoginModal />
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/"              element={<Landing />} />
            <Route path="/explore"       element={<Explore />} />
            <Route path="/chat"          element={<Chat />} />
            <Route path="/guide"         element={<Guide />} />
            <Route path="/quiz"          element={<Quiz />} />
            <Route path="/quiz/:topicId" element={<QuizSess />} />
            <Route path="/process"       element={<Process />} />
            <Route path="/login"         element={<Login />} />
            <Route path="/signup"        element={<Signup />} />
            <Route path="/dashboard"     element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="*"             element={<NotFound />} />
          </Routes>
        </Suspense>
        <FloatingChatWidget />
      </BrowserRouter>
    </ToastProvider>
  );
}
