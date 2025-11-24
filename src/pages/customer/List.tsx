import React, { useEffect, useState, useCallback } from "react";
import type { Customer } from "../../types/Customer.types";
import CustomerService from "../../services/Customer.services";
import KiduLoader from "../../components/KiduLoader";
import KiduTable from "../../components/KiduTable";


const CustomerList: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // const navigate = useNavigate();

    //  Same pattern as TripList (loadData with useCallback)
    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await CustomerService.getAll();

            if (res.isSucess && res.value) {
                setCustomers(res.value);
                setError(null);
            } else {
                setError("Failed to fetch customers");
            }
        } catch (err) {
            setError("An error occurred while fetching customers");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Keep loader exactly same
    if (loading) return <KiduLoader type="customer details..." />;

    return (
        <KiduTable
            title="Customer Details"
            subtitle="List of all customers with quick edit & view actions"
            columns={[
                { key: "customerId" as keyof Customer, label: "Customer ID" },
                { key: "customerName" as keyof Customer, label: "Customer Name" },
                { key: "customerEmail" as keyof Customer, label: "Email ID" },
                { key: "customerPhone" as keyof Customer, label: "Phone Number" },
            ]}
            data={customers}
            idKey="customerId"
            addRoute="/admin-dashboard/create-customer"
            editRoute="/admin-dashboard/edit-customer"
            viewRoute="/admin-dashboard/view-customer"
            error={error}
            onRetry={loadData}
        />
    );
};

export default CustomerList;

