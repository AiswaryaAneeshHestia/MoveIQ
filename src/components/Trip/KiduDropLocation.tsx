import React from "react";
import { useNavigate } from "react-router-dom";
import TripService from "../../services/Trip.services";
import KiduServerTable from "./KiduServerTable";

interface KiduServerTripListProps {
  title: string;
  subtitle?: string;
  fetchMode: "all" | "today" | "status";
  status?: "Scheduled" | "Completed" | "Canceled";
  showAddButton?: boolean;
}

const KiduServerTripList: React.FC<KiduServerTripListProps> = ({
  title,
  subtitle,
  fetchMode,
  status,
  showAddButton = true,
}) => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  // Updated columns to match actual API response structure
  const columns = [
    { key: "tripOrderId", label: "Trip ID" },
    { key: "tripDate", label: "Trip Date" },
    { key: "customerName", label: "Customer" },
    { key: "driverName", label: "Driver" },
    { key: "vehicleRegNo", label: "Vehicle" },
    { key: "pickupLocation", label: "Pickup" },
    { key: "dropLocation", label: "Drop" },
    { key: "tripStatus", label: "Status" },
    { key: "totalAmount", label: "Amount" },
  ];

  const fetchData = async ({
    pageNumber,
    pageSize,
    searchTerm,
  }: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }) => {
    let listType = "";
    
    // Determine listType based on fetchMode
    if (fetchMode === "all") {
      listType = "all";
    } else if (fetchMode === "today") {
      listType = "today";
    } else if (fetchMode === "status" && status) {
      listType = status;
    }

    const response = await TripService.getPaginatedTrips({
      year: currentYear,
      customerId: 0,
      listType: listType,
      filtertext: searchTerm || "",
      pagesize: pageSize,
      pagenumber: pageNumber,
    });

    console.log("API Response:", response);
    console.log("List Type:", listType);

    if (response.isSucess && response.value) {
      // Log the first item to see the actual structure
      if (response.value.data && response.value.data.length > 0) {
        console.log("First item structure:", response.value.data[0]);
        console.log("All keys:", Object.keys(response.value.data[0]));
      }

      // Transform the data to ensure proper formatting
      const transformedData = response.value.data.map((trip: any) => ({
        tripOrderId: trip.tripOrderId || trip.TripOrderId || "",
        tripDate: trip.tripDate || trip.TripDate || "",
        customerName: trip.customerName || trip.CustomerName || "",
        driverName: trip.driverName || trip.DriverName || "",
        vehicleRegNo: trip.vehicleRegNo || trip.VehicleRegNo || "",
        pickupLocation: trip.pickupLocation || trip.PickupLocation || "",
        dropLocation: trip.dropLocation || trip.DropLocation || "",
        tripStatus: trip.tripStatus || trip.TripStatus || "",
        totalAmount: trip.totalAmount || trip.TotalAmount || "",
      }));

      console.log("Transformed data:", transformedData);

      return {
        data: transformedData,
        total: response.value.total,
      };
    } else {
      throw new Error(response.error || "Failed to fetch trips");
    }
  };

  return (
    <KiduServerTable
      title={title}
      subtitle={subtitle}
      columns={columns}
      idKey="tripOrderId"
      addButtonLabel="Add Trip"
      addRoute="/trips/add"
      viewRoute="/dashboard/trip-view"
      editRoute="/dashboard/trip-edit"
      showAddButton={showAddButton}
      showExport={true}
      showSearch={true}
      showActions={true}
      showTitle={true}
      fetchData={fetchData}
      rowsPerPage={10}
      onRowClick={(trip) => navigate(`/dashboard/trip-view/${trip.tripOrderId}`)}
    />
  );
};

export default KiduServerTripList;