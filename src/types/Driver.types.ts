// src/types/Driver.types.ts
import type { AuditTrails } from "./common/AuditLog.types";

export interface Driver {
    driverId: number;
    driverName: string;
    license: string;
    nationality: string;
    imageSrc: string;
    contactNumber: string;
    dob: string | null;
    dobString: string;
    gender: string;
    nationalId: string;
    isRented: boolean;
    isActive: boolean;
    auditLogs?: AuditTrails[];
}
