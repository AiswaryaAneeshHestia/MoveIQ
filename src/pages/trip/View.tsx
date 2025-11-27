import React, { useEffect, useRef, useState } from "react";
import { Button, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaPrint } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import type { Trip } from "../../types/Trip.types";
import TripService from "../../services/Trip.services";
import Attachments from "../../components/KiduAttachments";
import AuditTrailsComponent from "../../components/KiduAuditLogs";
import KiduLoader from "../../components/KiduLoader";
import TripStatusBadge from "./TripStatusBadge";
import { FaArrowLeft } from "react-icons/fa6";
import type { KiduPaymentAccordionRef } from "../../components/KiduPaymentAccordion";
import type { KiduKilometerAccordionRef } from "../../components/KiduKilometerAccordion";
import KiduPaymentAccordion from "../../components/KiduPaymentAccordion";
import KiduKmAccordion from "../../components/KiduKilometerAccordion";

const TripView: React.FC = () => {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const paymentAccordionRef = useRef<KiduPaymentAccordionRef>(null);
  const kmAccordionRef = useRef<KiduKilometerAccordionRef>(null);

  const [data, setData] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [tripStatus, setTripStatus] = useState<string>("");

  useEffect(() => {
    const loadTrip = async () => {
      try {
        const res = await TripService.getById(Number(tripId));
        console.log(res);
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

  if (loading) return <KiduLoader type="trip details..." />;
  if (!data)
    return (
      <div className="text-center mt-5">
        <h5>No trip details found.</h5>
        <Button className="mt-3" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5" style={{ fontFamily: "Urbanist" }}>
      <div className="shadow-lg py-2 px-3 w-100" style={{ maxWidth: "1300px", borderRadius: "15px", border: "none" }}>

        {/* Header */}
        <div className="d-flex justify-content-between w-100 align-items-center mb-1 px-2 " style={{
          backgroundColor: "#18575A",
          fontSize: "1rem",
          height: "60px",
        }}>
          <div className="d-flex align-items-center">
            <Button
              size="sm"
              variant="link"
              onClick={() => navigate(-1)}
              className="me-3"
              style={{ backgroundColor: "white", padding: "0.2rem 0.5rem", textDecoration: "none", color: "#18575A" }}
            >
              <FaArrowLeft className="me-1 fw-bold" size={18} />
            </Button>
            <h5 className="fw-bold m-0 ms-2 text-white">Trip Details</h5>
          </div>
          <div className="d-flex align-items-center gap-2">
            {/* Trip Status Badge */}
            <TripStatusBadge status={tripStatus} />
            {/* Print Button */}
            <Button
              variant="outline-danger"
              className="d-flex align-items-center gap-2"
              style={{ fontWeight: 500, fontSize: "15px" }}
            >
              <FaPrint />
            </Button>
          </div>
        </div>
        <div style={{ padding: "1.5rem" }}>
          <Row className="gy-3 ps-4">
            <Col xs={12} md={4}>
              <div className="fw-semibold" style={{ fontSize: "1rem" }}>Trip ID</div>
              <div className="text-danger" style={{ fontSize: "0.85rem" }}>{data.tripOrderId}</div>
            </Col>

            <Col xs={12} md={4}>
              <div className="fw-semibold" style={{ fontSize: "1rem" }}>Customer Name</div>
              <div className="text-muted" style={{ fontSize: "0.85rem" }}>{data.customerName}</div>
            </Col>

            <Col xs={12} md={4}>
              <div className="fw-semibold" style={{ fontSize: "1rem" }}>Driver</div>
              <div className="text-muted" style={{ fontSize: "0.85rem" }}>{data.driverName}</div>
            </Col>

            <Col xs={12} md={4}>
              <div className="fw-semibold" style={{ fontSize: "1rem" }}>Received Via</div>
              <div className="text-muted" style={{ fontSize: "0.85rem" }}>{data.tripBookingModeName}</div>
            </Col>

            <Col xs={12} md={4}>
              <div className="fw-semibold" style={{ fontSize: "1rem" }}>Start Date & Time</div>
              <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                {data.fromDateString || "-"}
              </div>
            </Col>

            <Col xs={12} md={4}>
              <div className="fw-semibold" style={{ fontSize: "1rem" }}>End Date & Time</div>
              <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                {data.toDateString || "-"}
              </div>
            </Col>

            <Col xs={12} md={4}>
              <div className="d-flex gap-3 flex-wrap">
                <div>
                  <div className="fw-semibold" style={{ fontSize: "1rem" }}>Pickup From</div>
                  <div className="text-muted" style={{ fontSize: "0.85rem" }}>{data.fromLocation}</div>
                </div>
              </div>
            </Col>

            <Col xs={12} md={4}>
              <div>
                <div className="fw-semibold" style={{ fontSize: "1rem" }}>Drop Locations</div>
                <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                  {data.toLocation1} , {data.toLocation2} , {data.toLocation3} , {data.toLocation4}
                </div>
              </div>
              {/* )} */}
            </Col>

            {data.paymentMode && data.paymentMode.trim() !== "" && (
              <Col xs={12} md={4}>
                <div className="fw-semibold" style={{ fontSize: "1rem" }}>Payment Mode</div>
                <div className="text-muted" style={{ fontSize: "0.85rem" }}>{data.paymentMode}</div>
              </Col>
            )}

            {data.paymentDetails && data.paymentDetails.trim() !== "" && (
              <Col xs={12} md={4}>
                <div className="fw-semibold" style={{ fontSize: "1rem" }}>Payment Details</div>
                <div className="text-muted" style={{ fontSize: "0.85rem" }}>{data.paymentDetails}</div>
              </Col>
            )}

            {data.tripDetails && data.tripDetails.trim() !== "" && (
              <Col xs={12} className="mt-3">
                <div className="fw-semibold mb-1" style={{ fontSize: "1rem" }}>Other Trip Details</div>
                <div className="text-muted" style={{ fontSize: "0.85rem", backgroundColor: "transparent" }}>
                  {data.tripDetails}
                </div>
              </Col>
            )}
          </Row>
        </div>
        {/* Payment Details Accordion */}
        <KiduPaymentAccordion
          ref={paymentAccordionRef}
          relatedEntityId={Number(data.tripOrderId)}
          relatedEntityType="Trip"
          heading="Payment Details"
        />
        {/* Kilometer Details Accordion */}
        <KiduKmAccordion
          ref={kmAccordionRef}
          tripId={Number(data.tripOrderId)}
          driverId={data.driverId}
        />
        {/* Attachments + Audits */}
        <Attachments tableName="TRIPORDER" recordId={data.tripOrderId} />
        <AuditTrailsComponent tableName="TRIPORDER" recordId={data.tripOrderId} />
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default TripView;

