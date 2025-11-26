import KiduTripList from "../../../components/Trip/KiduTripList";

const CompletedTrips: React.FC = () => (
  <KiduTripList
    title="Completed Trips"
    subtitle="List of trips that are completed with quick edit & view actions"
    fetchMode="status"
    status="Completed"
    showAddButton={false}
  />
);

export default CompletedTrips;