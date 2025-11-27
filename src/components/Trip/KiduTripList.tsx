import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Trip } from "../../types/Trip.types";
import TripService from "../../services/Trip.services";
import KiduTable from "../KiduTable";

const columns = [
    { key: "tripCode", label: "Trip ID" },
    { key: "fromDateString", label: "Departure Date" },
    { key: "customerName", label: "Customer Name" },
    { key: "recivedVia", label: "Received Via" },
    { key: "driverName", label: "Driver" },
    { key: "pickUpFrom", label: "Pickup From" },
];

interface KiduTripListProps {
    title: string;
    subtitle: string;
    fetchMode: "all" | "status" | "today";
    status?: string;
    showAddButton?: boolean;
}

const KiduTripList: React.FC<KiduTripListProps> = ({
    title,
    subtitle,
    fetchMode,
    status,
    showAddButton = false,
}) => {
    const { tripId } = useParams<{ tripId?: string }>();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTrips = async () => {
        try {
            setLoading(true);
            setError(null);

            let response;

            if (tripId) {
                response = await TripService.getById(Number(tripId));
                if (response.isSucess && response.value) {
                    setTrips([response.value]);
                } else {
                    setTrips([]);
                    setError("No trip found with this Trip ID");
                }
            } else {
                switch (fetchMode) {
                    case "all":
                        response = await TripService.getAll();
                        break;

                    case "status":
                        if (!status) throw new Error("Status required for status mode");
                        response = await TripService.getTripsByStatus(status);
                        break;

                    case "today":
                        response = await TripService.getTodaysTrip();
                        break;

                    default:
                        throw new Error("Invalid fetch mode");
                }

                if (response.isSucess && response.value) {
                    setTrips(response.value);
                } else {
                    setError(response.customMessage || "Failed to fetch trips");
                }
            }
        } catch (err) {
            console.error("Error fetching trips:", err);
            setError("An error occurred while fetching trips");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrips();
    }, [tripId, fetchMode, status]);

    return (
        <KiduTable
            title={title}
            subtitle={subtitle}
            columns={columns}
            data={trips}
            showAddButton={showAddButton}
            addButtonLabel="Add New Trip"
            addRoute="/dashboard/trip-create"
            editRoute="/dashboard/trip-edit"
            viewRoute="/dashboard/trip-view"
            idKey="tripOrderId"
            loading={loading}
            error={error}
            onRetry={fetchTrips}
        />
    );
};

export default KiduTripList;
