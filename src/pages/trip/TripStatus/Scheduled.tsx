import KiduTripList from "../../../components/Trip/KiduTripList";

const ScheduledTrips: React.FC = () => (
  <KiduTripList
    title="Scheduled Trips"
    subtitle="List of trips that are scheduled with quick edit & view actions"
    fetchMode="status"
    status="Scheduled"
    showAddButton={false}
  />
);

export default ScheduledTrips;