import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import CustomerService from "../../services/Customer.services";
import Loader from "../../components/KiduLoader";
import KiduPrevious from "../../components/KiduPrevious";
import { KiduValidation } from "../../components/KiduValidation";
import KiduReset from "../../components/ReuseButtons/KiduReset";

const CustomerEdit: React.FC = () => {
    const navigate = useNavigate();
    const { customerId } = useParams();

    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialValues] = useState<any>({});
    const [formData, setFormData] = useState<any>({});
    const [errors, setErrors] = useState<any>({});

    const fields = [
        { name: "customerName", rules: { required: true, type: "text" } },
        { name: "dob", rules: { required: true, type: "date", label: "Registered Date" } },
        { name: "customerPhone", rules: { required: true, type: "number", minLength: 10, maxLength: 10 } },
        { name: "nationality", rules: { required: true, type: "text" } },
        { name: "customerEmail", rules: { required: true, type: "email" } },
        { name: "customerAddress", rules: { required: true, type: "text" } }
    ];

    useEffect(() => {
        const loadCustomer = async () => {
            try {
                const res = await CustomerService.getById(Number(customerId));
                if (res.isSucess && res.value) {
                    const d = res.value;
                    const loadedValues = {
                        customerName: d.customerName || "",
                        dob: d.dob ? d.dob.split("T")[0] : "",
                        customerPhone: d.customerPhone || "",
                        nationality: d.nationality || "", // use correct key
                        customerEmail: d.customerEmail || "",
                        customerAddress: d.customerAddress || ""
                    };
                    setFormData(loadedValues);
                    setInitialValues(loadedValues); // Set initial values after load
                    const errValues: any = {};
                    fields.forEach(f => { errValues[f.name] = ""; });
                    setErrors(errValues);
                } else {
                    toast.error("Failed to load customer details");
                    navigate("/dashboard/customer-list");
                }
            } catch (err: any) {
                toast.error(err.message);
                navigate("/dashboard/customer-list");
            } finally {
                setLoading(false);
            }
        };
        loadCustomer();
    }, [customerId, navigate]);

    const handleChange = (e: any) => {
        const { name, value, type } = e.target;
        const updated = type === "tel" ? value.replace(/[^0-9]/g, "") : value;
        setFormData((prev: any) => ({ ...prev, [name]: updated }));
        if (errors[name]) setErrors((prev: any) => ({ ...prev, [name]: "" }));
    };

    const validateField = (name: string, value: any) => {
        const rule = fields.find(f => f.name === name)?.rules;
        if (!rule) return true;
        const result = KiduValidation.validate(value, rule as any);
        setErrors((prev: any) => ({ ...prev, [name]: result.isValid ? "" : result.message }));
        return result.isValid;
    };

    const validateForm = () => {
        let ok = true;
        fields.forEach(f => { if (!validateField(f.name, formData[f.name])) ok = false; });
        return ok;
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const payload = {
                customerId: Number(customerId),
                customerName: formData.customerName,
                dobString: formData.dob,
                customerPhone: formData.customerPhone,
                nationalilty: formData.nationality, // map to API expected field
                customerEmail: formData.customerEmail,
                customerAddress: formData.customerAddress,
                gender: "",
                createdAt: new Date().toISOString(),
                isActive: true
            };


            const res = await CustomerService.update(Number(customerId), payload);

            if (res.isSucess) {
                toast.success("Customer updated successfully!");
                setTimeout(() => navigate("/dashboard/customer-list"), 1500);
            } else {
                toast.error(res.customMessage || res.error);
            }
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    if (loading) return <Loader type="customer details..." />;

    return (
        <>
            <Container className="px-4 mt-5 shadow-sm rounded bg-white" style={{ fontFamily: "Urbanist" }}>
                <div className="d-flex align-items-center mb-3">
                    <div className="me-2 mt-3"><KiduPrevious /></div>
                    <h4 className="fw-bold mb-0 mt-3" style={{ color: "#18575A" }}>Edit Customer</h4>
                </div>

                <hr />

                <Form onSubmit={handleSubmit} className="p-4">
                    <Row>
                        {fields.map(f => (
                            <Col md={6} className="mb-3" key={f.name}>
                                <Form.Label className="fw-semibold">{f.rules.label || f.name}</Form.Label>
                                <Form.Control
                                    type={f.rules.type === "number" ? "tel" : f.rules.type}
                                    name={f.name}
                                    value={formData[f.name]}
                                    onChange={handleChange}
                                    onBlur={() => validateField(f.name, formData[f.name])}
                                    as={f.rules.type === "text" && f.name === "customerAddress" ? "textarea" : undefined}
                                    rows={f.name === "customerAddress" ? 3 : undefined}
                                />
                                {errors[f.name] && <small className="text-danger">{errors[f.name]}</small>}
                            </Col>
                        ))}
                    </Row>

                    <div className="d-flex gap-2 justify-content-end mt-4">
                        <KiduReset initialValues={initialValues} setFormData={setFormData} />
                        <Button type="submit" style={{ backgroundColor: "#18575A", border: "none" }}>Update</Button>
                    </div>
                </Form>
            </Container>

            <Toaster position="top-right" />
        </>
    );
};

export default CustomerEdit;
