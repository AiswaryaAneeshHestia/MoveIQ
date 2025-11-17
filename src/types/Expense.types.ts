import type { AuditTrails } from "./common/AuditLog.types";

export interface Expenses {
    expenseMasterId: number;
    expenseTypeId: number;
    expenseTypeName?: string;
    amount: number;
    expenseVoucher: string;
    remark: string;
    paymentMode: string;
    relatedEntityId: number;
    relatedEntityType: string;
    createdOn: string;
    createdBy: string;
    isActive: boolean;
    isDeleted: boolean;
    aauditLgs?: AuditTrails[];
}