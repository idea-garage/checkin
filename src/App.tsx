import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";

import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateEvent from "./pages/CreateEvent";
import EventRegistration from "./pages/EventRegistration";
import Settings from "./pages/Settings";
import Survey from "./pages/Survey";
import Lottery from "./pages/Lottery";
import EventDetails from "./pages/EventDetails";
import Timetable from "./pages/Timetable";
import ManageEvent from "./pages/manage/ManageEvent";
import ManageLottery from "./pages/manage/ManageLottery";
import ManageParticipants from "./pages/manage/ManageParticipants";
import ManageTimetable from "./pages/manage/ManageTimetable";
import SurveyList from "./pages/manage/SurveyList";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="checkin-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/settings" element={<Settings />} />
            {/* Participant Routes */}
            <Route path="/e/:teamSlug/:slug" element={<EventRegistration />} />
            <Route path="/e/:teamSlug/:slug/details" element={<EventDetails />} />
            <Route path="/e/:teamSlug/:slug/timetable" element={<Timetable />} />
            <Route path="/e/:teamSlug/:slug/lottery" element={<Lottery />} />
            <Route path="/e/:teamSlug/:slug/survey" element={<Survey />} />
            {/* Management Routes */}
            <Route 
              path="/m/:teamSlug/:slug/details" 
              element={<ManageEvent />} 
            />
            <Route path="/m/:teamSlug/:slug/participants" element={<ManageParticipants />} />
            <Route path="/m/:teamSlug/:slug/timetable" element={<ManageTimetable />} />
            <Route path="/m/:teamSlug/:slug/lottery" element={<ManageLottery />} />
            <Route path="/m/:teamSlug/:slug/survey" element={<SurveyList />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;