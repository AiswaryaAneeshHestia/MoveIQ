import KiduTripList from "../../../components/Trip/KiduTripList";

const TodaysTrip: React.FC = () => (
  <KiduTripList
    title="Today's Trips"
    subtitle="List of all trips scheduled or completed for today"
    fetchMode="today"
    showAddButton={false}
  />
);

export default TodaysTrip;
