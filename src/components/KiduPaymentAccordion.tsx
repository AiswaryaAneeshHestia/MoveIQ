import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Accordion, Table, Button, Spinner, Alert, Modal } from "react-bootstrap";
import { Pencil, Trash2, Plus } from "lucide-react";
import type { Expenses } from "../types/Expense.types";
import TripPaymentModal from "../pages/trip/ActionPanel/TripPaymentModal";
import toast from "react-hot-toast";
import ExpenseMasterService from "../services/Customer.services";
import { useNavigate } from "react-router-dom";

interface TripPaymentAccordionProps {
    relatedEntityId: number;
    relatedEntityType: string;
    heading?: string;
}

export interface TripPaymentAccordionRef {
    refreshData: () => void;
}

const TripPaymentAccordion = forwardRef<TripPaymentAccordionRef, TripPaymentAccordionProps>(
    ({ relatedEntityId, relatedEntityType, heading = "Payment Details" }, ref) => {

        const navigate = useNavigate();
        const [payments, setPayments] = useState<Expenses[]>([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);
        const [showModal, setShowModal] = useState(false);
        const [editData, setEditData] = useState<Expenses | null>(null);
        const [deleteId, setDeleteId] = useState<number | null>(null);
        const [deleting, setDeleting] = useState(false);

        useEffect(() => {
            if (relatedEntityId) fetchData();
        }, [relatedEntityId, relatedEntityType]);

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await ExpenseMasterService.getAll();

                if (response.isSucess && response.value) {
                    const filtered = response.value.filter(p =>
                        !p.isDeleted &&
                        p.relatedEntityId === relatedEntityId &&
                        p.relatedEntityType === relatedEntityType
                    );

                    setPayments(filtered);
                } else {
                    setPayments([]);
                }
            } catch (err) {
                console.error("Error fetching payment data:", err);
                setError("Failed to fetch payment data.");
            } finally {
                setLoading(false);
            }
        };

        useImperativeHandle(ref, () => ({
            refreshData: fetchData
        }));

        const handleSave = async (formData: any) => {
            try {
                const userName = localStorage.getItem("userName") || "Admin";

                const payload: Expenses = {
                    expenseMasterId: editData?.expenseMasterId || 0,
                    expenseTypeId: formData.expenseTypeId,
                    amount: formData.amount,
                    expenseVoucher: formData.expenseVoucher || "",
                    remark: formData.remark || "",
                    paymentMode: formData.mode,
                    relatedEntityId: relatedEntityId,
                    relatedEntityType: relatedEntityType,
                    createdOn: new Date().toISOString(),
                    createdBy: userName,
                    isActive: true,
                    isDeleted: false,
                };

                if (editData) {
                    const res = await ExpenseMasterService.update(editData.expenseMasterId, payload);
                    if (res.isSucess) toast.success("Payment updated successfully!");
                    else {
                        toast.error(res.customMessage || "Failed to update payment");
                        return;
                    }
                } else {
                    const res = await ExpenseMasterService.create(payload);
                    if (!res.isSucess) {
                        toast.error(res.customMessage || "Failed to create payment");
                        return;
                    }
                }

                setShowModal(false);
                setEditData(null);
                await fetchData();
            } catch (err) {
                console.error(err);
                toast.error("Failed to save payment details");
            }
        };

        const handleDelete = async () => {
            if (!deleteId) return;
            try {
                setDeleting(true);

                const response = await ExpenseMasterService.delete(deleteId);

                if (response.isSucess) {
                    toast.success("Deleted successfully");
                    setDeleteId(null);
                    await fetchData();
                } else {
                    toast.error(response.customMessage || "Failed to delete");
                }
            } catch (err) {
                console.error("Error deleting payment record:", err);
                toast.error("Failed to delete");
            } finally {
                setDeleting(false);
            }
        };

        const handleEdit = (payment: Expenses) => {
            navigate(`/admin-dashboard/edit-expenses/${payment.expenseMasterId}`);
        };

        const handleCloseModal = () => {
            setShowModal(false);
            setEditData(null);
        };

        return (
            <>
                <Accordion className="mt-4 custom-accordion">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            <span className="fw-bold head-font fs-6" style={{ color: "#18575A" }}>
                                {heading} ({payments.length})
                            </span>
                        </Accordion.Header>

                        <Accordion.Body>
                            <div className="d-flex justify-content-end mb-3">
                                <Button
                                    size="sm"
                                    className="head-font fw-bold"
                                    style={{ backgroundColor: "#18575A", border: "none" }}
                                    onClick={() => setShowModal(true)}
                                >
                                    <Plus size={16} className="me-1" /> Add Payment
                                </Button>
                            </div>

                            {loading ? (
                                <div className="text-center py-4">
                                    <Spinner animation="border" variant="danger" />
                                </div>
                            ) : error ? (
                                <Alert variant="danger">{error}</Alert>
                            ) : payments.length === 0 ? (
                                <Alert variant="info" className="text-center">
                                    No payment records found. Click "Add Payment" to create one.
                                </Alert>
                            ) : (
                                <Table bordered hover responsive>
                                    <thead style={{ backgroundColor: "#18575A", color: "white" }}>
                                        <tr className="head-font text-center">
                                            <th className="bg-secondary text-white">Sl No</th>
                                            <th className="bg-secondary text-white">Payment ID</th>
                                            <th className="bg-secondary text-white">Type</th>
                                            <th className="bg-secondary text-white">Mode</th>
                                            <th className="bg-secondary text-white">Amount</th>
                                            <th className="bg-secondary text-white">Voucher</th>
                                            <th className="bg-secondary text-white">Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {payments.map((payment, index) => (
                                            <tr key={payment.expenseMasterId} className="head-font text-center">
                                                <td>{index + 1}</td>
                                                <td>{payment.expenseMasterId}</td>
                                                <td>{payment.expenseTypeName || "N/A"}</td>
                                                <td>{payment.paymentMode}</td>
                                                <td className="fw-bold">₹{payment.amount.toFixed(2)}</td>
                                                <td>{payment.expenseVoucher || "-"}</td>
                                                <td>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="me-2"
                                                        style={{ borderColor: "#18575A" }}
                                                        onClick={() => handleEdit(payment)}
                                                    >
                                                        <Pencil size={14} color="#18575A" />
                                                    </Button>

                                                    <Button
                                                        size="sm"
                                                        variant="outline-danger"
                                                        onClick={() => setDeleteId(payment.expenseMasterId)}
                                                    >
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                <TripPaymentModal
                    show={showModal}
                    onHide={handleCloseModal}
                    onSave={handleSave}
                    relatedEntityId={relatedEntityId}
                    relatedEntityType={relatedEntityType}
                    heading={`Add ${heading}`}
                    editData={
                        editData
                            ? {
                                expenseMasterId: editData.expenseMasterId,
                                expenseTypeId: editData.expenseTypeId,
                                amount: editData.amount,
                                expenseVoucher: editData.expenseVoucher,
                                remark: editData.remark,
                                mode: editData.paymentMode,
                            }
                            : null
                    }
                />

                <Modal show={!!deleteId} onHide={() => setDeleteId(null)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this payment record?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setDeleteId(null)} disabled={deleting}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDelete} disabled={deleting}>
                            {deleting ? "Deleting..." : "Delete"}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
);

TripPaymentAccordion.displayName = "TripPaymentAccordion";

export default TripPaymentAccordion;
