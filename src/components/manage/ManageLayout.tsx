import { Navbar } from "@/components/Navbar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEventData } from "@/hooks/event/useEventData";
import React from "react";
interface ManageLayoutProps {
  children: React.ReactNode;
}

export const ManageLayout = ({ children }: ManageLayoutProps) => {
  const navigate = useNavigate();
  const { teamSlug, slug } = useParams();
  const location = useLocation();
  const currentTab = location.pathname.split('/').pop() || 'details';

  const eventData = useEventData(teamSlug, slug);

  const handleTabChange = (value: string, event: React.SyntheticEvent) => {
    console.log('Tab changed:', value, event);
    navigate(`/m/${teamSlug}/${slug}/${value}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <Tabs
          value={currentTab}
          className="mb-8"
          onValueChange={(value) => handleTabChange(value, null)}
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="timetable">Timetable</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="lottery">Lottery</TabsTrigger>
            <TabsTrigger value="survey">Survey</TabsTrigger>
          </TabsList>
        </Tabs>
        {React.cloneElement(children as React.ReactElement, { eventData })}
      </main>
    </div>
  );
};