import { ManageLayout } from "@/components/manage/ManageLayout";
import { useParams } from "react-router-dom";
import { useEventQueries } from "@/hooks/event/useEventQueries";

const ManageLottery = () => {
  const { slug } = useParams();

  if (!slug) return null;

  const { event, isLoadingEvent } = useEventQueries(slug);

  if (isLoadingEvent) {
    return (
      <ManageLayout>
        <div className="text-center">Loading lottery...</div>
      </ManageLayout>
    );
  }

  if (!event) {
    return (
      <ManageLayout>
        <div className="text-center">Event not found</div>
      </ManageLayout>
    );
  }

  return (
    <ManageLayout>
      <div>Lottery management interface will be implemented here</div>
    </ManageLayout>
  );
};

export default ManageLottery;