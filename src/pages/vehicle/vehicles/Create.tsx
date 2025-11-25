import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import KiduValidation from "../../../components/KiduValidation";
import VehicleService from "../../../services/vehicle/Vehicles.services";
import KiduPrevious from "../../../components/KiduPrevious";
import KiduReset from "../../../components/ReuseButtons/KiduReset";

const CreateVehicle: React.FC = () => {
    const navigate = useNavigate();
    // Dropdown Options
    const yearOptions = Array.from({ length: 26 }, (_, i) => ({
        value: (2000 + i).toString(),
        label: (2000 + i).toString(),
    }));
    const statusOptions = ["Operational", "Non-Operational", "Scrap"].map(
        (s) => ({ value: s, label: s })
    );
    // FIELD DEFINITIONS
    const fields = [
        { name: "registrationNumber", rules: { required: true, type: "text" } },
        { name: "make", rules: { required: true, type: "text" } },
        { name: "model", rules: { required: true, type: "text" } },
        { name: "year", rules: { required: true, type: "select" } },
        { name: "chassisNumber", rules: { required: true, type: "text" } },
        { name: "engineNumber", rules: { required: true, type: "text" } },
        { name: "vehicleType", rules: { required: true, type: "text" } },
        { name: "registrationExpiry", rules: { required: true, type: "date" } },
        { name: "currentStatus", rules: { required: true, type: "select" } },
        { name: "location", rules: { required: true, type: "text" } },
    ];
    // Form Initial Values & Errors
    const initialValues: any = {};
    const initialErrors: any = {};
    fields.forEach((f) => {
        initialValues[f.name] = "";
        initialErrors[f.name] = "";
    });

    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState(initialErrors);

    // Handle Input Changes
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));

        if (errors[name]) setErrors((prev: any) => ({ ...prev, [name]: "" }));
    };

    // Validate single field
    const validateField = (name: string, value: any) => {
        const rule = fields.find((f) => f.name === name)?.rules;
        if (!rule) return true;
        const result = KiduValidation.validate(value, rule as any);
        setErrors((prev: any) => ({
            ...prev,
            [name]: result.isValid ? "" : result.message,
        }));
        return result.isValid;
    };

    // Validate all fields before submit
    const validateForm = () => {
        let ok = true;
        fields.forEach((f) => {
            if (!validateField(f.name, formData[f.name])) ok = false;
        });
        return ok;
    };

    // Submit handler
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const vehicleData = {
                vehicleId: 0,
                ...formData,
                createdDate: new Date().toISOString(),
                createdBy: "Admin",
                updatedDate: new Date().toISOString(),
                updatedBy: "Admin",
            };

            const response = await VehicleService.create(vehicleData);
            if (response.isSucess) {
                toast.success("Vehicle added successfully!");
                setTimeout(() => navigate("/dashboard/vehicle/vehicle-list"), 1500);
            } else {
                toast.error(response.customMessage || response.error);
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to add vehicle");
        }
    };

    return (
        <>
            <Container
                className="px-4 mt-5 shadow-sm rounded"
                style={{ backgroundColor: "white", fontFamily: "Urbanist" }}
            >
                {/* HEADER */}
                <div className="d-flex align-items-center mb-3">
                    <div className="me-2 mt-3">
                        <KiduPrevious />
                    </div>
                    <h4 className="fw-bold mb-0 mt-3" style={{ color: "#18575A" }}>
                        Add New Vehicle
                    </h4>
                </div>

                <hr />

                <Form onSubmit={handleSubmit} className="p-4">
                    <Row>
                        {/* Registration Number */}
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-semibold">Registration Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="registrationNumber"
                                placeholder="Enter registration number"
                                value={formData.registrationNumber}
                                onChange={handleChange}
                                onBlur={() =>
                                    validateField("registrationNumber", formData.registrationNumber)
                                }
                            />
                            {errors.registrationNumber && (
                                <small className="text-danger">{errors.registrationNumber}</small>
                            )}
                        </Col>

                        {/* Make */}
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-semibold">Make</Form.Label>
                            <Form.Control
                                type="text"
                                name="make"
                                placeholder="Enter make"
                                value={formData.make}
                                onChange={handleChange}
                                onBlur={() => validateField("make", formData.make)}
                            />
                            {errors.make && (
                                <small className="text-danger">{errors.make}</small>
                            )}
                        </Col>

                        {/* Model */}
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-semibold">Model</Form.Label>
                            <Form.Control
                                type="text"
                                name="model"
                                placeholder="Enter model"
                                value={formData.model}
                                onChange={handleChange}
                                onBlur={() => validateField("model", formData.model)}
                            />
                            {errors.model && (
                                <small className="text-danger">{errors.model}</small>
                            )}
                        </Col>

                        {/* Year (Dropdown) */}
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-semibold">Year</Form.Label>
                            <Form.Select
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                onBlur={() => validateField("year", formData.year)}
                            >
                                <option value="">Select Year</option>
                                {yearOptions.map((y, i) => (
                                    <option key={i} value={y.value}>
                                        {y.label}
                                    </option>
                                ))}
                            </Form.Select>
                            {errors.year && <small className="text-danger">{errors.year}</small>}
                        </Col>

                        {/* Chassis Number */}
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-semibold">Chassis Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="chassisNumber"
                                placeholder="Enter chassis number"
                                value={formData.chassisNumber}
                                onChange={handleChange}
                                onBlur={() =>
                                    validateField("chassisNumber", formData.chassisNumber)
                                }
                            />
                            {errors.chassisNumber && (
                                <small className="text-danger">{errors.chassisNumber}</small>
                            )}
                        </Col>

                        {/* Engine Number */}
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-semibold">Engine Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="engineNumber"
                                placeholder="Enter engine number"
                                value={formData.engineNumber}
                                onChange={handleChange}
                                onBlur={() =>
                                    validateField("engineNumber", formData.engineNumber)
                                }
                            />
                            {errors.engineNumber && (
                                <small className="text-danger">{errors.engineNumber}</small>
                            )}
                        </Col>

                        {/* Vehicle Type */}
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-semibold">Vehicle Type</Form.Label>
                            <Form.Control
                                type="text"
                                name="vehicleType"
                                placeholder="Enter vehicle type"
                                value={formData.vehicleType}
                                onChange={handleChange}
                                onBlur={() =>
                                    validateField("vehicleType", formData.vehicleType)
                                }
                            />
                            {errors.vehicleType && (
                                <small className="text-danger">{errors.vehicleType}</small>
                            )}
                        </Col>

                        {/* Registration Expiry */}
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-semibold">Registration Expiry</Form.Label>
                            <Form.Control
                                type="date"
                                name="registrationExpiry"
                                value={formData.registrationExpiry}
                                onChange={handleChange}
                                onBlur={() =>
                                    validateField(
                                        "registrationExpiry",
                                        formData.registrationExpiry
                                    )
                                }
                            />
                            {errors.registrationExpiry && (
                                <small className="text-danger">
                                    {errors.registrationExpiry}
                                </small>
                            )}
                        </Col>

                        {/* Status Dropdown */}
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-semibold">Current Status</Form.Label>
                            <Form.Select
                                name="currentStatus"
                                value={formData.currentStatus}
                                onChange={handleChange}
                                onBlur={() =>
                                    validateField("currentStatus", formData.currentStatus)
                                }
                            >
                                <option value="">Select Status</option>
                                {statusOptions.map((s, i) => (
                                    <option key={i} value={s.value}>
                                        {s.label}
                                    </option>
                                ))}
                            </Form.Select>
                            {errors.currentStatus && (
                                <small className="text-danger">{errors.currentStatus}</small>
                            )}
                        </Col>

                        {/* Location */}
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-semibold">Location</Form.Label>
                            <Form.Control
                                type="text"
                                name="location"
                                placeholder="Enter location"
                                value={formData.location}
                                onChange={handleChange}
                                onBlur={() => validateField("location", formData.location)}
                            />
                            {errors.location && (
                                <small className="text-danger">{errors.location}</small>
                            )}
                        </Col>
                    </Row>

                    {/* Buttons */}
                    <div className="d-flex gap-2 justify-content-end mt-4 mb-3">
                        <KiduReset initialValues={initialValues} setFormData={setFormData} />
                        <Button type="submit" style={{ backgroundColor: "#18575A", border: "none" }}>
                            Submit
                        </Button>
                    </div>
                </Form>
            </Container>

            <Toaster position="top-right" />
        </>
    );
};

export default CreateVehicle;
