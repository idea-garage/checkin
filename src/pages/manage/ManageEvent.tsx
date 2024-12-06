import { useParams } from "react-router-dom";
import { useEventQueries } from "@/hooks/event/useEventQueries";
import { ManageLayout } from "@/components/manage/ManageLayout";

const ManageEvent = () => {
  const { teamSlug, slug } = useParams();
  const { event, isLoadingEvent } = useEventQueries(teamSlug, slug);

  if (isLoadingEvent || !event) {
    return (
      <ManageLayout>
        <div className="text-center">Loading event details...</div>
      </ManageLayout>
    );
  }

  return (
    <ManageLayout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Event Details</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Event Name</h3>
            <p>{event.name}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Description</h3>
            <p>{event.description}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Date & Time</h3>
            <p>{event.date} at {event.time}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Location</h3>
            <p>{event.location}</p>
          </div>
        </div>
      </div>
    </ManageLayout>
  );
};

export default ManageEvent;