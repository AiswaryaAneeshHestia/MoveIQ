import KiduTripList from "../../../components/Trip/KiduTripList";

const CancelledTrips: React.FC = () => (
  <KiduTripList
    title="Cancelled Trips"
    subtitle="List of trips that are cancelled with quick edit & view actions"
    fetchMode="status"
    status="Canceled"
    showAddButton={false}
  />
);

export default CancelledTrips;