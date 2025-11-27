import React, { useEffect, useState, useRef } from "react";
import { Card, Table, Button, Modal, Spinner, Row, Col, Badge } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaEdit, FaTrash, FaPrint } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import type { Trip } from "../../types/Trip.types";
import TripService from "../../services/Trip.services";
import Attachments from "../../components/KiduAttachments";
import AuditTrailsComponent from "../../components/KiduAuditLogs";

import KiduLoader from "../../components/KiduLoader";
import KiduPrevious from "../../components/KiduPrevious";
import KiduKilometerAccordion, { type TripKilometerAccordionRef } from "../../components/KiduKilometerAccordion";
import KiduPaymentAccordion, { type TripPaymentAccordionRef } from "../../components/KiduPaymentAccordion";
import TripStatusBadge from "./TripStatusBadge";
import TripActionPanel from "./TripActionPanel";

const TripView: React.FC = () => {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const paymentAccordionRef = useRef<TripPaymentAccordionRef>(null);
  const kmAccordionRef = useRef<TripKilometerAccordionRef>(null);

  const [data, setData] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [tripStatus, setTripStatus] = useState<string>("");

  useEffect(() => {
    const loadTrip = async () => {
      try {
        const res = await TripService.getById(Number(tripId));
        if (res.isSucess && res.value) {
          setData(res.value);
          setTripStatus(res.value.tripStatus || "");
        } else {
          toast.error("Trip not found.");
        }
      } catch {
        toast.error("Failed to load trip details.");
      } finally {
        setLoading(false);
      }
    };
    loadTrip();
  }, [tripId]);

  const handleStatusUpdate = (newStatus: string, remarks?: string) => {
    setTripStatus(newStatus);
    setTrip(prev => prev ? { ...prev, tripStatus: newStatus } : null);
  };

  const handleEdit = () => navigate(`/dashboard/trip-edit/${data?.tripOrderId}`);

  const handleDelete = async () => {
    if (!data) return;
    
    setLoadingDelete(true);
    try {
      await TripService.delete(data.tripOrderId);
      toast.success("Trip deleted successfully");
      setTimeout(() => navigate("/dashboard/trip-list"), 800);
    } catch {
      toast.error("Failed to delete trip.");
    } finally {
      setLoadingDelete(false);
      setShowConfirm(false);
    }
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  if (loading) return <KiduLoader type="trip details..." />;

  if (!data)
    return (
      <div className="text-center mt-5">
        <h5>No trip details found.</h5>
        <Button className="mt-3" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );

  const basicFields = [
    { key: "tripCode", label: "Trip Code" },
    { key: "customerName", label: "Customer Name" },
    { key: "driverName", label: "Driver Name" },
    { key: "bookedBy", label: "Booked By" },
    { key: "recivedVia", label: "Received Via" },
    { key: "paymentMode", label: "Payment Mode" }
  ];

  const locationFields = [
    { key: "fromLocation", label: "Pickup Location" },
    { key: "toLocation1", label: "Drop Location 1" },
    { key: "toLocation2", label: "Drop Location 2" },
    { key: "toLocation3", label: "Drop Location 3" },
    { key: "toLocation4", label: "Drop Location 4" }
  ];

  const amountFields = [
    { key: "tripAmount", label: "Trip Amount" },
    { key: "advanceAmount", label: "Advance Amount" },
    { key: "balanceAmount", label: "Balance Amount" }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5" style={{ fontFamily: "Urbanist" }}>
      <Card className="shadow-lg p-4 w-100" style={{ maxWidth: "1300px", borderRadius: "15px", border: "none" }}>

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <KiduPrevious />
            <h5 className="fw-bold m-0 ms-2" style={{ color: "#18575A" }}>Trip Details</h5>
          </div>

          <div className="d-flex align-items-center gap-2">
            {/* Trip Status Badge */}
            <TripStatusBadge status={tripStatus} />
            
            {/* Trip Action Panel */}
            <TripActionPanel
              trip={{ ...data, tripStatus }}
              currentStatus={tripStatus}
              onStatusUpdate={handleStatusUpdate}
              onKmUpdate={() => kmAccordionRef.current?.refreshData()}
              onPaymentUpdate={() => paymentAccordionRef.current?.refreshData()}
            />

            {/* Print Button */}
            <Button
              variant="outline-secondary"
              className="d-flex align-items-center gap-2"
              style={{ fontWeight: 500, fontSize: "15px" }}
            >
              <FaPrint /> Print
            </Button>

            {/* Edit Button */}
            <Button
              className="d-flex align-items-center gap-2 me-1"
              style={{ fontWeight: 500, backgroundColor: "#18575A", fontSize: "15px", border: "none" }}
              onClick={handleEdit}
            >
              <FaEdit /> Edit
            </Button>

            {/* Delete Button */}
            <Button 
              variant="danger" 
              className="d-flex align-items-center gap-2"
              style={{ fontWeight: 500, fontSize: "15px" }}
              onClick={() => setShowConfirm(true)}
            >
              <FaTrash size={12} /> Delete
            </Button>
          </div>
        </div>

        {/* Trip ID Header */}
        <div className="text-center mb-4">
          <h5 className="fw-bold mb-1">{data.tripCode || `T${data.tripOrderId.toString().padStart(3, "0")}`}</h5>
          <p className="small mb-0 fw-bold text-danger" style={{ color: "#18575A" }}>
            Trip ID : {data.tripOrderId}
          </p>
        </div>

        {/* Date & Time Section */}
        <Row className="mb-4">
          <Col md={6}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Header style={{ backgroundColor: "#18575A", color: "white", fontWeight: 600 }}>
                Start Date & Time
              </Card.Header>
              <Card.Body>
                <div className="text-center">
                  <h6 className="fw-bold">{formatDateTime(data.fromDate)}</h6>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Header style={{ backgroundColor: "#18575A", color: "white", fontWeight: 600 }}>
                End Date & Time
              </Card.Header>
              <Card.Body>
                <div className="text-center">
                  <h6 className="fw-bold">{formatDateTime(data.toDate)}</h6>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Basic Information Table */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Header style={{ backgroundColor: "#f8f9fa", fontWeight: 600, color: "#18575A" }}>
            Basic Information
          </Card.Header>
          <Card.Body>
            <Table bordered hover responsive className="align-middle mb-0">
              <tbody>
                {basicFields.map(({ key, label }) => {
                  const value: any = (data as any)[key];
                  return (
                    <tr key={key}>
                      <td style={{ width: "40%", fontWeight: 600, color: "#18575A" }}>{label}</td>
                      <td>{value || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* Location Information */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Header style={{ backgroundColor: "#f8f9fa", fontWeight: 600, color: "#18575A" }}>
            Location Information
          </Card.Header>
          <Card.Body>
            <Table bordered hover responsive className="align-middle mb-0">
              <tbody>
                {locationFields.map(({ key, label }) => {
                  const value: any = (data as any)[key];
                  return value ? (
                    <tr key={key}>
                      <td style={{ width: "40%", fontWeight: 600, color: "#18575A" }}>{label}</td>
                      <td>{value}</td>
                    </tr>
                  ) : null;
                })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* Amount Information */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Header style={{ backgroundColor: "#f8f9fa", fontWeight: 600, color: "#18575A" }}>
            Financial Information
          </Card.Header>
          <Card.Body>
            <Table bordered hover responsive className="align-middle mb-0">
              <tbody>
                {amountFields.map(({ key, label }) => {
                  const value: number = (data as any)[key];
                  return (
                    <tr key={key}>
                      <td style={{ width: "40%", fontWeight: 600, color: "#18575A" }}>{label}</td>
                      <td className={value > 0 ? "fw-bold" : ""}>
                        {value ? formatCurrency(value) : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* Trip Details */}
        {data.tripDetails && (
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header style={{ backgroundColor: "#f8f9fa", fontWeight: 600, color: "#18575A" }}>
              Trip Details
            </Card.Header>
            <Card.Body>
              <p className="mb-0">{data.tripDetails}</p>
            </Card.Body>
          </Card>
        )}

        {/* Payment Details Accordion */}
        <KiduPaymentAccordion
          ref={paymentAccordionRef}
          relatedEntityId={Number(data.tripOrderId)}
          relatedEntityType="Trip"
          heading="Payment Details"
        />

        {/* Kilometer Details Accordion */}
        <KiduKilometerAccordion
          ref={kmAccordionRef}
          tripId={Number(data.tripOrderId)}
          driverId={data.driverId}
        />

        {/* Attachments + Audits */}
        <Attachments tableName="TRIPORDER" recordId={data.tripOrderId} />
        <AuditTrailsComponent tableName="TRIPORDER" recordId={data.tripOrderId} />

      </Card>

      {/* Delete Modal */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this trip? This action cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)} disabled={loadingDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={loadingDelete}>
            {loadingDelete ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <Toaster position="top-right" />
    </div>
  );
};

export default TripView;

function setTrip(arg0: (prev: any) => any) {
    throw new Error("Function not implemented.");
}
