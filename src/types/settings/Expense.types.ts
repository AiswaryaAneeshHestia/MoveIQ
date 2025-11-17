export interface ExpenseType {
    expenseTypeId: number;
    expenseTypeName: string;
    expenseTypeCode?: string;
    description: string;
    isActive: boolean;
    isDeleted: boolean;
}
