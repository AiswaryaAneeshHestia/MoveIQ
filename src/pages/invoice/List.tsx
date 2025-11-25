// src/pages/InvoiceMasterList.tsx
import React, { useEffect, useState, useCallback } from "react";
import KiduTable from "../../components/KiduTable";
import KiduLoader from "../../components/KiduLoader";
import type { Invoice } from "../../types/Invoice.types";
import InvoiceMasterService from "../../services/Invoice.services";

const columns = [
    { key: "invoicemasterId", label: "Invoice ID" },
    { key: "invoiceNum", label: "Invoice Number" },
    { key: "companyId", label: "Company Id" },
    { key: "financialYearId", label: "Financial Year" },
    { key: "createdOnString", label: "Created on" },
    { key: "totalAmount", label: "Amount" }
];

const InvoiceMasterList: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await InvoiceMasterService.getAll();
            if (response.isSucess && response.value) {
                setInvoices(response.value);
                setError(null);
            } else {
                setError("Failed to fetch invoices");
            }
        } catch (err) {
            console.error("Error fetching invoices:", err);
            setError("Failed to load invoice details");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    if (loading) return <KiduLoader type="invoices..." />;

    return (
        <>
            <KiduTable
                title="Invoices"
                subtitle="List of all invoices with quick edit & view actions"
                columns={columns}
                data={invoices}
                addButtonLabel="Add New Invoice"
                addRoute="/dashboard/create-invoice"
                editRoute="/dashboard/edit-invoice"
                viewRoute="/dashboard/view-invoice"
                idKey="invoicemasterId"
                error={error}
                onRetry={loadData}
            />
        </>
    );
};

export default InvoiceMasterList;
