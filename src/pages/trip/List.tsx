import React, { useEffect, useState, useCallback } from "react";
import TripService from "../../services/Trip.services";
import KiduTable from "../../components/KiduTable";
import KiduLoader from "../../components/KiduLoader";

const TripList: React.FC = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatTrips = (rawTrips: any[]) => {
    return rawTrips.map((trip) => ({
      id: trip.tripOrderId,
      tripId: `T${trip.tripOrderId.toString().padStart(3, "0")}`,
      fromDate: trip.fromDateString,
      customerName: trip.customerName,
      recivedVia: trip.recivedVia || "Website",
      driver: trip.driverName,
      pickUpFrom: trip.pickUpFrom || trip.fromLocation,
    }));
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await TripService.getAll();

      if (res.isSucess && res.value) {
        setTrips(formatTrips(res.value));
        setError(null);
      } else {
        setError("Failed to fetch trips");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("An error occurred while fetching trips");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) return <KiduLoader type="Loading trips..." />;

  return (
    <KiduTable
      title="Total Trips"
      subtitle="List of all trips with quick edit & view actions"
      columns={[
        { key: "tripId", label: "Trip ID" },
        { key: "fromDate", label: "Departure Date" },
        { key: "customerName", label: "Customer Name" },
        { key: "recivedVia", label: "Received Via" },
        { key: "driver", label: "Driver" },
        { key: "pickUpFrom", label: "Pickup From" },
      ]}
      data={trips}
      addButtonLabel="Add New Trip"
      addRoute="/dashboard/trip-create"
      editRoute="/admin-dashboard/edit-trip-form"
      viewRoute="/admin-dashboard/view-trip"
      idKey="id"
      error={error}
      onRetry={loadData}
    />
  );
};

export default TripList;
