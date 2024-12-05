import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Users, ChartBar, Gift } from "lucide-react";

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  // Example event data
  const event = {
    id: eventId,
    name: "Tech Conference 2024",
    date: "2024-03-15",
    time: "10:00 AM",
    location: "Virtual",
    participants: [
      { id: 1, nickname: "techie1", email: "techie1@example.com" },
      { id: 2, nickname: "coder2", email: "coder2@example.com" },
      { id: 3, nickname: "dev3", email: "dev3@example.com" },
    ],
    surveyResponses: 12,
    totalParticipants: 25,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">{event.name}</h1>
              <p className="text-muted-foreground">
                {event.date} at {event.time} • {event.location}
              </p>
            </div>
            <div className="space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate(`/e/${eventId}/survey`)}
              >
                <ChartBar className="mr-2 h-4 w-4" />
                View Survey
              </Button>
              <Button onClick={() => navigate(`/e/${eventId}/lottery`)}>
                <Gift className="mr-2 h-4 w-4" />
                Start Lottery
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Participants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {event.totalParticipants}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartBar className="h-5 w-5" />
                  Survey Responses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{event.surveyResponses}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Participant List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nickname</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {event.participants.map((participant) => (
                    <TableRow key={participant.id}>
                      <TableCell>{participant.nickname}</TableCell>
                      <TableCell>{participant.email}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Registered
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default EventDetails;