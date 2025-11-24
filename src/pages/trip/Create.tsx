import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Row, Col, Card, InputGroup } from "react-bootstrap";
// import AddDropLocation from "../OtherComponents/AddDropLocation";
// import DriverSearchPopup from "../Driver/DriverSearchPopup";
import { BsSearch } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import TripService from "../../services/Trip.services";
import toast, { Toaster } from "react-hot-toast";
import CustomerSearchPopup from "../customer/CustomerPopup";

interface MainTripFormProps {
  onClose?: () => void;
}

const alphaRegex = /^[A-Za-z\s]+$/;
const TripCreate: React.FC<MainTripFormProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [tripId, setTripId] = useState("");
  console.log(tripId);
  const [customerName, setCustomerName] = useState("");
  const [customerId, setCustomerId] = useState<number>();
  //const [receivedVia, setReceivedVia] = useState("Phone");
  const [receivedVia, setReceivedVia] = useState(""); // changed to empty initially
  const [bookingModes, setBookingModes] = useState<
    { tripBookingModeId: number; tripBookingModeName: string }[]
  >([]);
  const [fromDate, setFromDate] = useState("");
  const [fromDateString, setFromDateString] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [fromAmPm, setFromAmPm] = useState("AM");
  const [toDate, setToDate] = useState("");
  const [toDateString, setToDateString] = useState("");
  const [toTime, setToTime] = useState("");
  const [toAmPm, setToAmPm] = useState("AM");
  const [pickupFrom, setPickupFrom] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverId, setDriverId] = useState<number>();
  const [details, setDetails] = useState("");
  const [dropLocations, setDropLocations] = useState<string[]>([""]);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [paymentDetails, setPaymentDetails] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showDriverPopup, setShowDriverPopup] = useState(false);
  const [customerError, setCustomerError] = useState<string>("");
  const [driverError, setDriverError] = useState<string>("");
  const [pickupError, setPickupError] = useState<string>("");
  const [receivedViaError, setReceivedViaError] = useState<string>("");
  const [dropLocationError, setDropLocationError] = useState<string>("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tripStatus] = useState("Scheduled");
  const generatedOnce = useRef(false);
  console.log(tripStatus);

  // ---------------------- LOAD BOOKING MODES ------------------------
  useEffect(() => {
    const loadModes = async () => {
      try {
        const res = await TripService.getBookingMode();
        if (res.isSucess && res.value) {
          setBookingModes(res.value);
        }
      } catch {
        toast.error("Failed to load booking modes");
      }
    };
    loadModes();
  }, []);

  useEffect(() => {
    if (!generatedOnce.current) {
      // In create mode, generate new trip ID
      const lastId = localStorage.getItem("lastTripId") || "T-0";
      const num = parseInt(lastId.replace("T", "")) || 0;
      const newIdNum = num + 1;
      const newTripId = `T${newIdNum.toString().padStart(3, "0")}`;
      setTripId(newTripId);
      localStorage.setItem("lastTripId", newTripId);
      generatedOnce.current = true;
    }
  }, []);


  const handleDropLocationsChange = (items: string[]) => {
    setDropLocations(items);
    if (items.some((it) => it && it.trim() !== "")) {
      setDropLocationError("");
    }
  };

  const handleReset = () => {
    setCustomerName("");
    setCustomerId(undefined);
    setReceivedVia("Phone");
    setFromDate("");
    setFromDateString("");
    setFromTime("");
    setFromAmPm("AM");
    setToDate("");
    setToDateString("");
    setToTime("");
    setToAmPm("AM");
    setPickupFrom("");
    setDriverName("");
    setDriverId(undefined);
    setDetails("");
    setDropLocations([""]);
    setPaymentMode("Cash");
    setPaymentDetails("");
    setCustomerError("");
    setDriverError("");
    setPickupError("");
    setReceivedViaError("");
    setDropLocationError("");
    setSubmitAttempted(false);
    onClose?.();
  };

  const convertTo24Hour = (time: string, ampm: string): string => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    let hour = parseInt(hours);
    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, "0")}:${minutes}`;
  };

  const generate12HourTimes = () => {
    const times: string[] = [];
    for (let h = 1; h <= 12; h++) {
      for (let m = 0; m < 60; m += 15) {
        const hour = h.toString().padStart(2, "0");
        const minute = m.toString().padStart(2, "0");
        times.push(`${hour}:${minute}`);
      }
    }
    return times;
  };
  const timesList = generate12HourTimes();

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setSubmitAttempted(true);
    setIsSubmitting(true);
    try {
      const filteredDrops = dropLocations.filter((d) => d && d.trim() !== "");
      const fromDateTime = fromDate && fromTime
        ? `${fromDate}T${convertTo24Hour(fromTime, fromAmPm)}:00`
        : "";
      const toDateTime = toDate && toTime
        ? `${toDate}T${convertTo24Hour(toTime, toAmPm)}:00`
        : "";

      const finalCustomerName = customerName.trim();
      const finalDriverName = driverName.trim();

      const createPayload = {
       // tripBookingModeId: receivedVia === "Phone" ? 1 : receivedVia === "Direct Booking" ? 2 : 3,
       tripBookingModeId: Number(receivedVia), 
        customerId: customerId || 1,
        driverId: driverId || 1,
        fromDate: fromDateTime,
        fromDateString: fromDateString || "",
        toDate: toDateTime,
        toDateString: toDateString || "",
        fromLocation: pickupFrom,
        toLocation1: filteredDrops[0] || "",
        toLocation2: filteredDrops[1] || "",
        toLocation3: filteredDrops[2] || "",
        toLocation4: filteredDrops[3] || "",
        bookedBy: "Admin",
        tripDetails: details,
        tripStatus: "Scheduled",
        tripAmount: 0,
        advanceAmount: 0,
        balanceAmount: 0,
        isActive: true,
        paymentMode: paymentMode,
        paymentDetails: paymentDetails,
        customerName: finalCustomerName,
        driverName: finalDriverName,
      };

      const response = await TripService.create(createPayload);
      console.log(response);

      if (response.isSucess) {
        toast.success("Trip created successfully!");
        setTimeout(() => {
          navigate("/admin-dashboard/total-trips");
        }, 1000);
      } else {
        toast.error(response.customMessage || "Failed to create trip");
      }

    } catch (error) {
      console.error("Error submitting trip:", error);
      toast.error("An error occurred while saving the trip");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCustomerChange = (val: string) => {
    console.log("Customer name changed to:", val);
    setCustomerName(val);
    if (submitAttempted) {
      if (!val || val.trim() === "") setCustomerError("Required field");
      else if (!alphaRegex.test(val.trim())) setCustomerError("Only alphabets allowed");
      else setCustomerError("");
    }
  };

  const onDriverChange = (val: string) => {
    setDriverName(val);
    if (submitAttempted) {
      if (!val || val.trim() === "") setDriverError("Required field");
      else if (!alphaRegex.test(val.trim())) setDriverError("Only alphabets allowed");
      else setDriverError("");
    }
  };

  const onPickupChange = (val: string) => {
    setPickupFrom(val);
    if (submitAttempted) {
      if (!val || val.trim() === "") setPickupError("Required field");
      else setPickupError("");
    }
  };

  const onReceivedViaChange = (val: string) => {
    setReceivedVia(val);
    if (submitAttempted) {
      if (!val || val.trim() === "") setReceivedViaError("Required field");
      else setReceivedViaError("");
    }
  };

  return (
    <>
      <Card
        className="mx-3"
        style={{
          maxWidth: "100%",
          fontSize: "0.85rem",
          marginTop: "50px",
          backgroundColor: "#f0f0f0ff",
        }}
      >
        <Card.Header
          style={{ backgroundColor: "#18575A", color: "white", padding: "0.5rem" }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <Button
                size="sm"
                variant="link"
                className="me-2"
                style={{ backgroundColor: "white", padding: "0.2rem 0.5rem", color: "#18575A" }}
                onClick={() => navigate(-1)}
              >
                <FaArrowLeft />
              </Button>

              <h6 className="mb-0 p-2 fw-medium fs-5">
                Start Your Booking
              </h6>

            </div>
          </div>
        </Card.Header>
        <Card.Body style={{ padding: "1rem" }}>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-2 mx-3">
              <Col xs={12} md={6} className="mb-2 mb-md-0">
                <Form.Label className="mb-1 fw-medium">Customer Name</Form.Label>
                <InputGroup>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Enter customer name"
                    className="custom-placeholder custom-input p-2"
                    value={customerName}
                    readOnly
                    onChange={(e) => onCustomerChange(e.target.value)}
                    style={{ backgroundColor: "#ffffffff" }}
                  />
                  <Button
                    size="sm"
                    onClick={() => setShowPopup(true)}
                    style={{ backgroundColor: "#18575A" }}
                  >
                    <BsSearch />
                  </Button>
                </InputGroup>
                {customerError && (
                  <div className="text-danger small mt-1">{customerError}</div>
                )}
              </Col>

              {/* <Col xs={12} md={6}>
                <Form.Group className="mb-2">
                  <Form.Label className="mb-1 fw-medium">Received Via</Form.Label>
                  <Form.Select
                    size="sm"
                    className="p-2 custom-input"
                    value={receivedVia}
                    onChange={(e) => onReceivedViaChange(e.target.value)}
                  >
                    <option>Phone</option>
                    <option>Direct Booking</option>
                    <option>Website</option>
                  </Form.Select>
                  {receivedViaError && (
                    <div className="text-danger small mt-1">{receivedViaError}</div>
                  )}
                </Form.Group>
              </Col> */}
              {/* ---------- RECEIVED VIA (API BASED) ----------- */}
              <Col xs={12} md={6}>
                <Form.Group className="mb-2">
                  <Form.Label className="mb-1 fw-medium">Received Via</Form.Label>

                  <Form.Select
                    size="sm"
                    className="p-2 custom-input"
                    value={receivedVia}
                    onChange={(e) => onReceivedViaChange(e.target.value)}
                  >
                    <option value="">Select</option>
                    {bookingModes.map((mode) => (
                      <option
                        key={mode.tripBookingModeId}
                        value={mode.tripBookingModeId}
                      >
                        {mode.tripBookingModeName}
                      </option>
                    ))}
                  </Form.Select>

                  {receivedViaError && (
                    <div className="text-danger small mt-1">{receivedViaError}</div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <CustomerSearchPopup
              show={showPopup}
              handleClose={() => setShowPopup(false)}
              onSelect={(customer) => {
                setCustomerId(customer.customerId);
                setCustomerName(customer.customerName);
                setShowPopup(false);
              }}
            />

            {/* <DriverSearchPopup
              show={showDriverPopup}
              handleClose={() => setShowDriverPopup(false)}
              onSelect={(driver) => {
                setDriverId(driver.driverId);
                setDriverName(driver.driverName);
                setShowDriverPopup(false);
              }}
            /> */}

            <Row className="mb-2 mx-3">
              <Col xs={12} md={6} className="mb-3">
                <Form.Label className="mb-1 fw-medium">From</Form.Label>
                <Row>
                  <Col xs={12} sm={5} className="mb-2 mb-sm-0">
                    <Form.Control
                      size="sm"
                      type="date"
                      className="p-2 custom-input"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                  </Col>
                  <Col xs={8} sm={5}>
                    <Form.Select
                      size="sm"
                      className="p-2 custom-input"
                      value={fromTime}
                      onChange={(e) => setFromTime(e.target.value)}
                    >
                      <option value="">Select time</option>
                      {timesList.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col xs={4} sm={2}>
                    <Form.Select size="sm" className="p-2 custom-input" value={fromAmPm} onChange={(e) => setFromAmPm(e.target.value)}>
                      <option>AM</option>
                      <option>PM</option>
                    </Form.Select>
                  </Col>
                </Row>
              </Col>

              <Col xs={12} md={6} className="mb-3">
                <Form.Label className="mb-1 fw-medium">To</Form.Label>
                <Row>
                  <Col xs={12} sm={5} className="mb-2 mb-sm-0">
                    <Form.Control
                      size="sm"
                      type="date"
                      className="p-2 custom-input"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                    />
                  </Col>
                  <Col xs={8} sm={5}>
                    <Form.Select
                      size="sm"
                      className="p-2 custom-input"
                      value={toTime}
                      onChange={(e) => setToTime(e.target.value)}
                    >
                      <option value="">Select time</option>
                      {timesList.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col xs={4} sm={2}>
                    <Form.Select size="sm" className="p-2 custom-input" value={toAmPm} onChange={(e) => setToAmPm(e.target.value)}>
                      <option>AM</option>
                      <option>PM</option>
                    </Form.Select>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row className="mb-2 mx-3">
              <Col xs={12} md={6}>
                <Form.Group className="mb-2">
                  <Form.Label className="mb-1 fw-medium">Pickup From</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Enter pickup location"
                    className="custom-placeholder p-2 custom-input"
                    value={pickupFrom}
                    onChange={(e) => onPickupChange(e.target.value)}
                  />
                  {pickupError && <div className="text-danger small mt-1">{pickupError}</div>}
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Label className="mb-1 fw-medium">Driver</Form.Label>
                <InputGroup>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Enter driver name"
                    className="custom-placeholder custom-input p-2"
                    value={driverName}
                    readOnly
                    onChange={(e) => onDriverChange(e.target.value)}
                  />
                  <Button
                    size="sm"
                    onClick={() => setShowDriverPopup(true)}
                    style={{ backgroundColor: "#18575A" }}
                  >
                    <BsSearch />
                  </Button>
                </InputGroup>
                {driverError && <div className="text-danger small mt-1">{driverError}</div>}
              </Col>
            </Row>

            <Row className="mb-2 mx-3">
              <Col xs={12} md={6}>
                <Form.Group className="mb-2">
                  <Form.Label className="mb-1 fw-medium">Payment mode</Form.Label>
                  <Form.Select
                    size="sm"
                    className="p-2 custom-input"
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                  >
                    <option>Cash</option>
                    <option>Debit</option>
                    <option>POS</option>
                    <option>Bank Transfer</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group className="mb-2">
                  <Form.Label className="mb-1 fw-medium">Payment Details</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={paymentDetails}
                    onChange={(e) => setPaymentDetails(e.target.value)}
                    placeholder="Enter payment details..."
                    className="custom-placeholder p-2 custom-input"
                    style={{ fontSize: "0.85rem", backgroundColor: "#ffffffff" }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-2 mx-3">
              <Col xs={12} md={6}>
                <Form.Group className="mb-2">
                  <Form.Label className="mb-1 fw-medium">Other Trip Details</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Enter details..."
                    className="custom-placeholder p-2 custom-input"
                    style={{ fontSize: "0.85rem", backgroundColor: "#ffffffff" }}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                {/* <AddDropLocation
                  values={dropLocations}
                  onChange={handleDropLocationsChange}
                /> */}

                {dropLocationError && (
                  <div className="text-danger small mt-1">{dropLocationError}</div>
                )}
              </Col>
            </Row>
            {/* Show message in create mode */}
            <Row className="mb-2 mx-3">
              <Col xs={12}>
                <div className="alert alert-info">
                  <strong>Note:</strong> You can add attachments after creating the trip.
                </div>
              </Col>
            </Row>
            <div className="d-flex justify-content-end gap-2 mt-4 me-4">
              <Button className="px-4" variant="secondary" onClick={handleReset}>
                Reset
              </Button>
              <Button
                className="px-4"
                style={{ backgroundColor: "#18575A", borderColor: "#18575A" }}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Submit"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};

export default TripCreate;