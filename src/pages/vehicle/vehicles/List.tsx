// src/components/Vehicles/VehicleList.tsx
import React, { useCallback, useEffect, useState } from "react";
import type { Vehicle } from "../../../types/vehicle/Vehicles.types";
import VehicleService from "../../../services/vehicle/Vehicles.services";
import KiduTable from "../../../components/KiduTable";
import KiduLoader from "../../../components/KiduLoader";

const columns = [
    { label: "Vehicle ID", key: "vehicleId" },
    { label: "Registration Number", key: "registrationNumber" },
    { label: "Vehicle Type", key: "vehicleType" },
    { label: "Registration Expiry", key: "registrationExpiry" },
    { label: "Current Status", key: "currentStatus" },
    { label: "Location", key: "location" },
]

const VehicleList: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await VehicleService.getAll();
            if (response.isSucess && response.value) {
                setVehicles(response.value);
                setError(null);
            } else {
                setError(response.customMessage || "Failed to fetch vehicles");
            }
        } catch (error: any) {
            setError(error.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);


    if (loading) return <KiduLoader type="vehicles..." />;
    return (
        <>

            <KiduTable
                title="Vehicles"
                subtitle="List of all vehicles with quick edit & view actions"
                data={vehicles}
                columns={columns}
                addButtonLabel="Add New Vehicle"
                addRoute="/dashboard/vehicle/create-vehicle"
                editRoute="/dashboard/settings/edit-vehicle"
                viewRoute="/dashboard/settings/view-vehicle"
                idKey="vehicleId"
                error={error}
                onRetry={loadData}
            />
        </>
    );
};

export default VehicleList;
