import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import KiduValidation from "../../../components/KiduValidation";
import CompanyService from "../../../services/settings/Company.services";
import KiduPrevious from "../../../components/KiduPrevious";
import KiduReset from "../../../components/ReuseButtons/KiduReset";

const CreateCompany: React.FC = () => {
    const navigate = useNavigate();

    // ------------------ FIELD RULES --------------------
    const fields = [
        { name: "comapanyName", rules: { required: true, type: "text" } },
        { name: "website", rules: { required: true, type: "text" } },
        { name: "contactNumber", rules: { required: true, type: "number", minLength: 10, maxLength: 10 } },
        { name: "email", rules: { required: true, type: "email" } },
        { name: "taxNumber", rules: { required: true, type: "text" } },
        { name: "addressLine1", rules: { required: true, type: "text" } },
        { name: "addressLine2", rules: { required: false, type: "text" } },
        { name: "city", rules: { required: true, type: "text" } },
        { name: "state", rules: { required: true, type: "text" } },
        { name: "country", rules: { required: true, type: "text" } },
        { name: "zipCode", rules: { required: true, type: "number" } },
        { name: "invoicePrefix", rules: { required: false, type: "text" } },
        { name: "companyLogo", rules: { required: false, type: "text" } }
    ];

    // ---------------- INITIAL STATES -------------------
    const initialValues: any = {};
    const initialErrors: any = {};

    fields.forEach(f => {
        initialValues[f.name] = "";
        initialErrors[f.name] = "";
    });

    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState(initialErrors);

    // ---------------- HANDLE CHANGE --------------------
    const handleChange = (e: any) => {
        const { name, value, type } = e.target;
        const updated =
            type === "tel" || type === "number"
                ? value.replace(/[^0-9]/g, "") // allow only numbers
                : value;

        setFormData((prev: any) => ({ ...prev, [name]: updated }));

        if (errors[name]) {
            setErrors((prev: any) => ({ ...prev, [name]: "" }));
        }
    };

    // ---------------- VALIDATE FIELD -------------------
    const validateField = (name: string, value: any) => {
        const rule = fields.find(f => f.name === name)?.rules;
        if (!rule) return true;

        const result = KiduValidation.validate(value, rule as any);

        setErrors((prev: any) => ({
            ...prev,
            [name]: result.isValid ? "" : result.message
        }));

        return result.isValid;
    };

    // ---------------- VALIDATE FULL FORM ----------------
    const validateForm = () => {
        let ok = true;

        fields.forEach(field => {
            if (!validateField(field.name, formData[field.name])) {
                ok = false;
            }
        });

        return ok;
    };

    // ---------------- HANDLE SUBMIT ---------------------
    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!validateForm()) return;

        const companyData = {
            ...formData,
            companyId: 0,
            isActive: true,
            isDeleted: false
        };

        try {
            const res = await CompanyService.create(companyData);

            if (res.isSucess) {
                toast.success("Company created successfully!");

                setTimeout(() => {
                    navigate("/dashboard/settings/company-list");
                }, 1500);
            } else {
                toast.error(res.customMessage || res.error || "Failed to create company");
            }
        } catch (err: any) {
            toast.error(err.message || "Something went wrong");
        }
    };

    // ----------------------------------------------------

    return (
        <>
            <Container
                className="px-4 mt-5 shadow-sm rounded"
                style={{ backgroundColor: "white", fontFamily: "Urbanist" }}
            >
                <div className="d-flex align-items-center mb-3">
                    <div className="me-2 mt-3">
                        <KiduPrevious />
                    </div>
                    <h4 className="fw-bold mb-0 mt-3" style={{ color: "#18575A" }}>
                        Add New Company
                    </h4>
                </div>

                <hr />

                <Form onSubmit={handleSubmit} className="p-4">
                    <Row>
                        {/* Company Name */}
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-semibold">Company Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="comapanyName"
                                value={formData.comapanyName}
                                placeholder="Enter company name"
                                onChange={handleChange}
                                onBlur={() => validateField("comapanyName", formData.comapanyName)}
                            />
                            {errors.comapanyName && (
                                <small className="text-danger">{errors.comapanyName}</small>
                            )}
                        </Col>

                        {/* Website */}
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-semibold">Website</Form.Label>
                            <Form.Control
                                type="text"
                                name="website"
                                value={formData.website}
                                placeholder="Enter website link"
                                onChange={handleChange}
                                onBlur={() => validateField("website", formData.website)}
                            />
                            {errors.website && (
                                <small className="text-danger">{errors.website}</small>
                            )}
                        </Col>

                        {/* Contact Number */}
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-semibold">Contact Number</Form.Label>
                            <Form.Control
                                type="tel"
                                name="contactNumber"
                                value={formData.contactNumber}
                                placeholder="Enter contact number"
                                onChange={handleChange}
                                onBlur={() =>
                                    validateField("contactNumber", formData.contactNumber)
                                }
                            />
                            {errors.contactNumber && (
                                <small className="text-danger">{errors.contactNumber}</small>
                            )}
                        </Col>

                        {/* Email */}
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-semibold">Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                placeholder="Enter email"
                                onChange={handleChange}
                                onBlur={() => validateField("email", formData.email)}
                            />
                            {errors.email && <small className="text-danger">{errors.email}</small>}
                        </Col>

                        {/* Tax Number */}
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-semibold">Tax Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="taxNumber"
                                value={formData.taxNumber}
                                placeholder="Enter tax number"
                                onChange={handleChange}
                                onBlur={() => validateField("taxNumber", formData.taxNumber)}
                            />
                            {errors.taxNumber && (
                                <small className="text-danger">{errors.taxNumber}</small>
                            )}
                        </Col>

                        {/* Address Line 1 */}
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-semibold">Address Line 1</Form.Label>
                            <Form.Control
                                type="text"
                                name="addressLine1"
                                value={formData.addressLine1}
                                placeholder="Enter address line 1"
                                onChange={handleChange}
                                onBlur={() =>
                                    validateField("addressLine1", formData.addressLine1)
                                }
                            />
                            {errors.addressLine1 && (
                                <small className="text-danger">{errors.addressLine1}</small>
                            )}
                        </Col>

                        {/* Address Line 2 */}
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-semibold">Address Line 2</Form.Label>
                            <Form.Control
                                type="text"
                                name="addressLine2"
                                value={formData.addressLine2}
                                placeholder="Enter address line 2"
                                onChange={handleChange}
                                onBlur={() =>
                                    validateField("addressLine2", formData.addressLine2)
                                }
                            />
                            {errors.addressLine2 && (
                                <small className="text-danger">{errors.addressLine2}</small>
                            )}
                        </Col>

                        {/* City */}
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-semibold">City</Form.Label>
                            <Form.Control
                                type="text"
                                name="city"
                                value={formData.city}
                                placeholder="Enter city"
                                onChange={handleChange}
                                onBlur={() => validateField("city", formData.city)}
                            />
                            {errors.city && <small className="text-danger">{errors.city}</small>}
                        </Col>

                        {/* State */}
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-semibold">State</Form.Label>
                            <Form.Control
                                type="text"
                                name="state"
                                value={formData.state}
                                placeholder="Enter state"
                                onChange={handleChange}
                                onBlur={() => validateField("state", formData.state)}
                            />
                            {errors.state && <small className="text-danger">{errors.state}</small>}
                        </Col>

                        {/* Country */}
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-semibold">Country</Form.Label>
                            <Form.Control
                                type="text"
                                name="country"
                                value={formData.country}
                                placeholder="Enter country"
                                onChange={handleChange}
                                onBlur={() => validateField("country", formData.country)}
                            />
                            {errors.country && (
                                <small className="text-danger">{errors.country}</small>
                            )}
                        </Col>

                        {/* Zip Code */}
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-semibold">Zip Code</Form.Label>
                            <Form.Control
                                type="tel"
                                name="zipCode"
                                value={formData.zipCode}
                                placeholder="Enter zip code"
                                onChange={handleChange}
                                onBlur={() => validateField("zipCode", formData.zipCode)}
                            />
                            {errors.zipCode && (
                                <small className="text-danger">{errors.zipCode}</small>
                            )}
                        </Col>

                        {/* Invoice Prefix */}
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-semibold">Invoice Prefix</Form.Label>
                            <Form.Control
                                type="text"
                                name="invoicePrefix"
                                value={formData.invoicePrefix}
                                placeholder="Enter invoice prefix"
                                onChange={handleChange}
                                onBlur={() =>
                                    validateField("invoicePrefix", formData.invoicePrefix)
                                }
                            />
                        </Col>

                        {/* Company Logo */}
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-semibold">Company Logo URL</Form.Label>
                            <Form.Control
                                type="text"
                                name="companyLogo"
                                value={formData.companyLogo}
                                placeholder="Enter logo URL"
                                onChange={handleChange}
                                onBlur={() => validateField("companyLogo", formData.companyLogo)}
                            />
                        </Col>
                    </Row>

                    <div className="d-flex gap-2 justify-content-end mt-4">
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

export default CreateCompany;
