import KiduTripList from "../../../components/Trip/KiduTripList";

const AllTrips: React.FC = () => (
  <KiduTripList
    title="Total Trips"
    subtitle="List of all trips with quick edit & view actions"
    fetchMode="all"
    showAddButton={true}
  />
);

export default AllTrips;