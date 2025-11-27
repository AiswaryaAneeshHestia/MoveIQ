// src/components/OtherComponents/KmModal.tsx

import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import toast from "react-hot-toast";
import type { Vehicle } from "../../../types/vehicle/Vehicles.types";
import VehicleService from "../../../services/vehicle/Vehicles.services";

interface KmModalProps {
    show: boolean;
    onHide: () => void;
    onSave: (data: {
        vehicleId: number;
        timeIn: string;
        timeOut: string;
        blackTopKm: number;
        gradedKm: number;
        totalKm: number;
    }) => void;
    tripId?: number;
    driverId?: number;
    editData?: {
        tripKiloMeterId: number;
        vehicleId: number;
        tripStartTimeString: string;
        tripEndingTimeString: string;
        tripStartReading: number;
        tripEndReading: number;
    } | null;
}

const KmModal: React.FC<KmModalProps> = ({ show, onHide, onSave, editData }) => {
    const [vehicleId, setVehicleId] = useState<number>(0);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loadingVehicles, setLoadingVehicles] = useState(false);
    const [timeIn, setTimeIn] = useState("");
    const [timeOut, setTimeOut] = useState("");
    const [timeInAmPm, setTimeInAmPm] = useState("AM");
    const [timeOutAmPm, setTimeOutAmPm] = useState("AM");
    const [blackTopKm, setBlackTopKm] = useState<number>(0);
    const [gradedKm, setGradedKm] = useState<number>(0);
    const [totalKm, setTotalKm] = useState<number>(0);

    useEffect(() => {
        setTotalKm((blackTopKm || 0) + (gradedKm || 0));
    }, [blackTopKm, gradedKm]);

    useEffect(() => {
        if (show) {
            fetchVehicles();
        }
    }, [show]);

    useEffect(() => {
        if (editData && show) {
            setVehicleId(editData.vehicleId);
            setBlackTopKm(editData.tripStartReading);
            setGradedKm(editData.tripEndReading);
            
            // Parse time in
            const timeInParts = parseTimeString(editData.tripStartTimeString);
            if (timeInParts) {
                setTimeIn(timeInParts.time);
                setTimeInAmPm(timeInParts.ampm);
            }
            
            // Parse time out
            const timeOutParts = parseTimeString(editData.tripEndingTimeString);
            if (timeOutParts) {
                setTimeOut(timeOutParts.time);
                setTimeOutAmPm(timeOutParts.ampm);
            }
        } else {
            resetForm();
        }
    }, [editData, show]);

    const parseTimeString = (timeString: string): { time: string; ampm: string } | null => {
        // Expected format: "04 Nov 2025 11:31 AM"
        const parts = timeString.split(' ');
        if (parts.length >= 5) {
            const time = parts[3]; // "11:31"
            const ampm = parts[4]; // "AM" or "PM"
            return { time, ampm };
        }
        return null;
    };

    const fetchVehicles = async () => {
        try {
            setLoadingVehicles(true);
            const response = await VehicleService.getAll();
            if (response.isSucess && response.value) {
                setVehicles(response.value);
            }
        } catch (error) {
            console.error("Error fetching vehicles:", error);
            toast.error("Failed to load vehicles");
        } finally {
            setLoadingVehicles(false);
        }
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

    const convertTo24HourISO = (time: string, ampm: string): string => {
        if (!time) return new Date().toISOString();
        
        const [hours, minutes] = time.split(":");
        let hour = parseInt(hours);
        
        if (ampm === "PM" && hour !== 12) {
            hour += 12;
        }
        if (ampm === "AM" && hour === 12) {
            hour = 0;
        }
        
        const now = new Date();
        now.setHours(hour, parseInt(minutes), 0, 0);
        return now.toISOString();
    };

    const resetForm = () => {
        setVehicleId(0);
        setTimeIn("");
        setTimeOut("");
        setTimeInAmPm("AM");
        setTimeOutAmPm("AM");
        setBlackTopKm(0);
        setGradedKm(0);
        setTotalKm(0);
    };

    const handleSubmit = () => {
        if (!vehicleId || !timeIn || !timeOut || totalKm <= 0) {
            toast.error("Please fill all fields correctly!");
            return;
        }

        const timeInISO = convertTo24HourISO(timeIn, timeInAmPm);
        const timeOutISO = convertTo24HourISO(timeOut, timeOutAmPm);

        onSave({
            vehicleId,
            timeIn: timeInISO,
            timeOut: timeOutISO,
            blackTopKm,
            gradedKm,
            totalKm,
        });
        
        toast.success(`Kilometer details ${editData ? 'updated' : 'saved'} successfully`);
        resetForm();
        onHide();
    };

    const handleClose = () => {
        resetForm();
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} centered backdrop="static"  width={20}>
            <Modal.Header closeButton style={{ backgroundColor: "#18575A", color: "white" }}>
                <Modal.Title className="fs-5">
                    {editData ? "Edit Kilometer Details" : "Add Kilometer Details"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body style={{ fontFamily: "Urbanist" }}>
                <Form>
                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Vehicle <span className="text-danger">*</span></Form.Label>
                                <Form.Select
                                    size="sm"
                                    className="p-2"
                                    value={vehicleId}
                                    onChange={(e) => setVehicleId(Number(e.target.value))}
                                    disabled={loadingVehicles}
                                >
                                    <option value={0}>Select Vehicle</option>
                                    {vehicles.map((vehicle) => (
                                        <option key={vehicle.vehicleId} value={vehicle.vehicleId}>
                                            {vehicle.vehicleType} - {vehicle.registrationNumber}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Time In <span className="text-danger">*</span></Form.Label>
                                <Row>
                                    <Col xs={7}>
                                        <Form.Select
                                            size="sm"
                                            className="p-2"
                                            value={timeIn}
                                            onChange={(e) => setTimeIn(e.target.value)}
                                        >
                                            <option value="">Select time</option>
                                            {timesList.map((t) => (
                                                <option key={t} value={t}>
                                                    {t}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                    <Col xs={5}>
                                        <Form.Select
                                            size="sm"
                                            className="p-2"
                                            value={timeInAmPm}
                                            onChange={(e) => setTimeInAmPm(e.target.value)}
                                        >
                                            <option>AM</option>
                                            <option>PM</option>
                                        </Form.Select>
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Time Out <span className="text-danger">*</span></Form.Label>
                                <Row>
                                    <Col xs={7}>
                                        <Form.Select
                                            size="sm"
                                            className="p-2"
                                            value={timeOut}
                                            onChange={(e) => setTimeOut(e.target.value)}
                                        >
                                            <option value="">Select time</option>
                                            {timesList.map((t) => (
                                                <option key={t} value={t}>
                                                    {t}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                    <Col xs={5}>
                                        <Form.Select
                                            size="sm"
                                            className="p-2"
                                            value={timeOutAmPm}
                                            onChange={(e) => setTimeOutAmPm(e.target.value)}
                                        >
                                            <option>AM</option>
                                            <option>PM</option>
                                        </Form.Select>
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Black Top <span className="fw-semibold">K.M </span><span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="number"
                                    value={blackTopKm}
                                    onChange={(e) => setBlackTopKm(Number(e.target.value))}
                                    min={0}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Graded Roads <span className="fw-semibold">K.M</span> <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="number"
                                    value={gradedKm}
                                    onChange={(e) => setGradedKm(Number(e.target.value))}
                                    min={0}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Total K.M</Form.Label>
                                <Form.Control 
                                    type="number" 
                                    value={totalKm} 
                                    readOnly 
                                    style={{ backgroundColor: "#f0f0f0" }}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button 
                    style={{ backgroundColor: "#18575A", border: "none" }} 
                    onClick={handleSubmit}
                >
                    {editData ? "Update Details" : "Save Details"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default KmModal;