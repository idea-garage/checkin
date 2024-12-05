import { Navbar } from "@/components/Navbar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useParams, useLocation } from "react-router-dom";

interface ManageLayoutProps {
  children: React.ReactNode;
}

export const ManageLayout = ({ children }: ManageLayoutProps) => {
  const navigate = useNavigate();
  const { teamSlug, slug } = useParams();
  const location = useLocation();
  const currentTab = location.pathname.split('/').pop() || 'details';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <Tabs
          value={currentTab}
          className="mb-8"
          onValueChange={(value) => navigate(`/m/${teamSlug}/${slug}/${value}`)}
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="lottery">Lottery</TabsTrigger>
            <TabsTrigger value="timetable">Timetable</TabsTrigger>
          </TabsList>
        </Tabs>
        {children}
      </main>
    </div>
  );
};