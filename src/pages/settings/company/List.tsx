import React, { useEffect, useState, useCallback } from "react";
import type { Company } from "../../../types/settings/Company.types";
import CompanyService from "../../../services/settings/Company.services";
import KiduTable from "../../../components/KiduTable";
import KiduLoader from "../../../components/KiduLoader";

const columns = [
    { label: "Company ID", key: "companyId" },
    { label: "Company Name", key: "comapanyName" },
    { label: "Email", key: "email" },
    { label: "Contact", key: "contactNumber" },
    { label: "City", key: "city" },
    { label: "Country", key: "country" },
];

const CompanyList: React.FC = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await CompanyService.getAll();
            console.log(res);
            
            if (res.isSucess && res.value) {
                setCompanies(res.value);
                setError(null);
            } else {
                setError(res.customMessage || "Failed to fetch companies");
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    if (loading) return <KiduLoader type="Companies..." />;

    return (
        <KiduTable
            title="Company Details"
            subtitle="List of all companies with quick edit & view actions"
            data={companies}
            addButtonLabel="Add New Company"
            columns={columns}
            idKey="companyId"
            addRoute="/dashboard/settings/create-company"
            editRoute="/dashboard/settings/edit-company"
            viewRoute="/dashboard/settings/view-company"
            error={error}
            onRetry={loadData}
        />
    );
};

export default CompanyList;
