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
        { name: "comapanyName", rules: { required: true, type: "text",label: "Company Name" } },
        { name: "website", rules: { required: true, type: "text",label: "Website" } },
        { name: "contactNumber", rules: { required: true, type: "number",label: "Contact Number", minLength: 10, maxLength: 10 } },
        { name: "email", rules: { required: true, type: "email" , label: "Email" } },
        { name: "taxNumber", rules: { required: true, type: "text", label: "Tax Number" } },
        { name: "addressLine1", rules: { required: true, type: "text", label: "Address Line 1" } },
        { name: "addressLine2", rules: { required: false, type: "text",label: "Address Line 2" } },
        { name: "city", rules: { required: true, type: "text", label: "City" } },
        { name: "state", rules: { required: true, type: "text", label: "State" } },
        { name: "country", rules: { required: true, type: "text",label: "Country" } },
        { name: "zipCode", rules: { required: true, type: "number", label: "Zip Code" } },
        { name: "invoicePrefix", rules: { required: false, type: "text" , label: "Invoice Prefix" } },
        { name: "companyLogo", rules: { required: false, type: "text" , label: "Company Logo URL" } }
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

        try {

            const companyData = {
            ...formData,
            companyId: 0,
            isActive: true,
            isDeleted: false
        };
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
                            <Form.Label className="fw-semibold">{fields[0].rules.label || "Company Name"} {fields[0].rules.required ? <span className="text-danger">*</span> : ""}</Form.Label>
                            <Form.Control
                                type="text"
                                name={fields[0].name}
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
                            <Form.Label className="fw-semibold">{fields[1].rules.label || "Website"} {fields[1].rules.required ? <span className="text-danger">*</span> : ""}</Form.Label>
                            <Form.Control
                                type="text"
                                name={fields[1].name}
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
                            <Form.Label className="fw-semibold">{fields[2].rules.label || "Contact Number"} {fields[2].rules.required ? <span className="text-danger">*</span> : ""}</Form.Label>
                            <Form.Control
                                type="tel"
                                name={fields[2].name}
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
                            <Form.Label className="fw-semibold">{fields[3].rules.label || "Email"} {fields[3].rules.required ? <span className="text-danger">*</span> : ""}</Form.Label>
                            <Form.Control
                                type="email"
                                name={fields[3].name}
                                value={formData.email}
                                placeholder="Enter email"
                                onChange={handleChange}
                                onBlur={() => validateField("email", formData.email)}
                            />
                            {errors.email && <small className="text-danger">{errors.email}</small>}
                        </Col>

                        {/* Tax Number */}
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-semibold">{fields[4].rules.label || "Tax Number"} {fields[4].rules.required ? <span className="text-danger">*</span> : ""}</Form.Label>
                            <Form.Control
                                type="text"
                                name={fields[4].name}
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
                            <Form.Label className="fw-semibold">{fields[5].rules.label || "Address Line 1"} {fields[5].rules.required ? <span className="text-danger">*</span> : ""}</Form.Label>
                            <Form.Control
                                type="text"
                                name={fields[5].name}
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
                            <Form.Label className="fw-semibold">{fields[6].rules.label || "Address Line 2"} {fields[6].rules.required ? <span className="text-danger">*</span> : ""}</Form.Label>
                            <Form.Control
                                type="text"
                                name={fields[6].name}
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
                            <Form.Label className="fw-semibold">{fields[7].rules.label || "City"} {fields[7].rules.required ? <span className="text-danger">*</span> : ""}</Form.Label>
                            <Form.Control
                                type="text"
                                name={fields[7].name}
                                value={formData.city}
                                placeholder="Enter city"
                                onChange={handleChange}
                                onBlur={() => validateField("city", formData.city)}
                            />
                            {errors.city && <small className="text-danger">{errors.city}</small>}
                        </Col>

                        {/* State */}
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-semibold">{fields[8].rules.label || "State"} {fields[8].rules.required ? <span className="text-danger">*</span> : ""}</Form.Label>
                            <Form.Control
                                type="text"
                                name={fields[8].name}
                                value={formData.state}
                                placeholder="Enter state"
                                onChange={handleChange}
                                onBlur={() => validateField("state", formData.state)}
                            />
                            {errors.state && <small className="text-danger">{errors.state}</small>}
                        </Col>

                        {/* Country */}
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-semibold">{fields[9].rules.label || "Country"} {fields[9].rules.required ? <span className="text-danger">*</span> : ""}</Form.Label>
                            <Form.Control
                                type="text"
                                name={fields[9].name}
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
                            <Form.Label className="fw-semibold">{fields[10].rules.label || "Zip Code"} {fields[10].rules.required ? <span className="text-danger">*</span> : ""}</Form.Label>
                            <Form.Control
                                type="tel"
                                name={fields[10].name}
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
                            <Form.Label className="fw-semibold">{fields[11].rules.label || "Invoice Prefix"} {fields[11].rules.required ? <span className="text-danger">*</span> : ""}</Form.Label>
                            <Form.Control
                                type="text"
                                name={fields[11].name}
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
                            <Form.Label className="fw-semibold">{fields[12].rules.label || "Company Logo URL"} {fields[12].rules.required ? <span className="text-danger">*</span> : ""}</Form.Label>
                            <Form.Control
                                type="text"
                                name={fields[12].name}
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
