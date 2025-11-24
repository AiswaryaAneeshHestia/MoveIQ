import type { AuditTrails } from "./common/AuditLog.types";

export interface Customer {
    customerId: number;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    customerAddress: string;
    dob: string | null;
    dobString: string;
    gender: string;
    nationalilty: string;
    nationality: string; // matches API spelling
    createdAt: string;
    isActive: boolean;
    auditTrails?: AuditTrails[];
}
