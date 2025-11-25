// src/components/Company/EditCompany.tsx
import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import CompanyService from "../../../services/settings/Company.services";
import type { Company } from "../../../types/settings/Company.types";
import KiduValidation from "../../../components/KiduValidation";
import KiduLoader from "../../../components/KiduLoader";
import KiduPrevious from "../../../components/KiduPrevious";
import KiduReset from "../../../components/ReuseButtons/KiduReset";

const CompanyEdit: React.FC = () => {
  const navigate = useNavigate();
  const {companyId } = useParams();

  const [loading, setLoading] = useState<boolean>(true);
  const [initialValues, setInitialValues] = useState<any>({});
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});

  const fields = [
    { name: "comapanyName", rules: { required: true, type: "text", label: "Company Name" } },
    { name: "website", rules: { required: true, type: "text", label: "Website" } },
    { name: "contactNumber", rules: { required: true, type: "text", label: "Contact Number" } },
    { name: "email", rules: { required: true, type: "email", label: "Email" } },
    { name: "taxNumber", rules: { required: true, type: "text", label: "Tax Number" } },
    { name: "addressLine1", rules: { required: true, type: "text", label: "Address Line 1" } },
    { name: "addressLine2", rules: { required: false, type: "text", label: "Address Line 2" } },
    { name: "city", rules: { required: true, type: "text", label: "City" } },
    { name: "state", rules: { required: true, type: "text", label: "State" } },
    { name: "country", rules: { required: true, type: "text", label: "Country" } },
    { name: "zipCode", rules: { required: true, type: "text", label: "Zip Code" } },
    { name: "invoicePrefix", rules: { required: false, type: "text", label: "Invoice Prefix" } },
    { name: "companyLogo", rules: { required: false, type: "text", label: "Company Logo" } },
  ];

  useEffect(() => {
    const loadCompany = async () => {
      try {
        setLoading(true);
        if (!companyId) {
          toast.error("Invalid company id");
          navigate("/dashboard/settings/company-list");
          return;
        }
        const res = await CompanyService.getById(Number(companyId));
        if (res && res.isSucess && res.value) {
          const d: Company = res.value;
          // Map loaded values (keep original keys - note original had comapanyName typo)
          const loadedValues = {
            companyId: d.companyId ?? 0,
            comapanyName: d.comapanyName ?? "",   // keeping existing key as in your original code
            website: d.website ?? "",
            contactNumber: d.contactNumber ?? "",
            email: d.email ?? "",
            taxNumber: d.taxNumber ?? "",
            addressLine1: d.addressLine1 ?? "",
            addressLine2: d.addressLine2 ?? "",
            city: d.city ?? "",
            state: d.state ?? "",
            country: d.country ?? "",
            zipCode: d.zipCode ?? "",
            invoicePrefix: d.invoicePrefix ?? "",
            companyLogo: d.companyLogo ?? "",
            // created/updated metadata if present
            // createdDate: d.createdDate ?? d.createAt ?? null,
            // createdBy: d.createdBy ?? null,
            // updatedDate: d.updatedDate ?? null,
            // updatedBy: d.updatedBy ?? null,
            // don't expose isActive/isDeleted in UI per your request
          };
          setFormData(loadedValues);
          setInitialValues(loadedValues);

          const errValues: any = {};
          fields.forEach((f) => { errValues[f.name] = ""; });
          setErrors(errValues);
        } else {
          toast.error(res?.customMessage || "Company not found");
          navigate("/dashboard/settings/company-list");
        }
      } catch (err: any) {
        console.error("Error fetching company:", err);
        toast.error(err?.message || "Failed to fetch company details");
        navigate("/dashboard/settings/company-list");
      } finally {
        setLoading(false);
      }
    };

    loadCompany();
  }, [companyId, navigate]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev: any) => ({ ...prev, [name]: newValue }));
    if (errors[name]) setErrors((prev: any) => ({ ...prev, [name]: "" }));
  };

  const validateField = (name: string, value: any) => {
    const rule = fields.find((f) => f.name === name)?.rules;
    if (!rule) return true;
    const result = KiduValidation.validate(value, rule as any);
    setErrors((prev: any) => ({ ...prev, [name]: result.isValid ? "" : result.message }));
    return result.isValid;
  };

  const validateForm = () => {
    let ok = true;
    fields.forEach((f) => {
      // skip optional fields
      if (!f.rules.required) {
        if (f.rules.type === "email" && formData[f.name]) {
          if (!validateField(f.name, formData[f.name])) ok = false;
        }
        return;
      }
      if (!validateField(f.name, formData[f.name])) ok = false;
    });
    return ok;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // parse logged user once
    const loggedUser = JSON.parse(localStorage.getItem("user") || "{}") as any;
    const updatedBy = loggedUser?.userEmail || loggedUser?.userName || "User";

    try {
      const companyData: Company | any = {
        companyId: Number(formData.companyId || 0),
        comapanyName: formData.comapanyName,
        website: formData.website,
        contactNumber: formData.contactNumber,
        email: formData.email,
        taxNumber: formData.taxNumber,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2 || "",
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zipCode: formData.zipCode,
        invoicePrefix: formData.invoicePrefix || "",
        companyLogo: formData.companyLogo || "",
        // preserve created metadata if available
        createdDate: formData.createdDate || undefined,
        createdBy: formData.createdBy || undefined,
        // update metadata
        updatedDate: new Date().toISOString(),
        updatedBy: updatedBy,
      };

      const res = await CompanyService.update(Number(companyId), companyData);
      if (res && res.isSucess) {
        toast.success("Company updated successfully!");
        setTimeout(() => {
          navigate("/dashboard/settings/company-list");
        }, 1500);
      } else {
        toast.error(res?.customMessage || res?.error || "Failed to update company");
      }
    } catch (err: any) {
      console.error("Error updating company:", err);
      toast.error(err?.message || "Something went wrong while updating company");
    }
  };

  if (loading) return <KiduLoader type="company details..." />;

  return (
    <>
      <Container className="px-4 mt-5 shadow-sm rounded bg-white" style={{ fontFamily: "Urbanist" }}>
        <div className="d-flex align-items-center mb-3">
          <div className="me-2 mt-3"><KiduPrevious /></div>
          <h4 className="fw-bold mb-0 mt-3" style={{ color: "#18575A" }}>Edit Company</h4>
        </div>

        <hr />

        <Form onSubmit={handleSubmit} className="p-4">
          <Row>
            {/* Company ID (disabled) */}
            <Col xs={12} md={6} className="mb-3 mt-2">
              <Form.Label className="fw-semibold text-muted">Company ID</Form.Label>
              <Form.Control type="number" value={formData.companyId} disabled className="text-danger" />
            </Col>

            {/* Company Name */}
            <Col xs={12} md={6} className="mb-3 mt-2">
              <Form.Label className="fw-semibold text-muted">{fields[0].rules.label}</Form.Label>
              <Form.Control
                type="text"
                name={fields[0].name}
                value={formData[fields[0].name] || ""}
                onChange={handleChange}
                onBlur={() => validateField(fields[0].name, formData[fields[0].name])}
                isInvalid={!!errors[fields[0].name]}
              />
              <Form.Control.Feedback type="invalid">{errors[fields[0].name]}</Form.Control.Feedback>
            </Col>

            {/* Website */}
            <Col xs={12} md={6} className="mb-3 mt-2">
              <Form.Label className="fw-semibold text-muted">{fields[1].rules.label}</Form.Label>
              <Form.Control
                type="text"
                name={fields[1].name}
                value={formData[fields[1].name] || ""}
                onChange={handleChange}
                onBlur={() => validateField(fields[1].name, formData[fields[1].name])}
                isInvalid={!!errors[fields[1].name]}
              />
              <Form.Control.Feedback type="invalid">{errors[fields[1].name]}</Form.Control.Feedback>
            </Col>

            {/* Contact Number */}
            <Col xs={12} md={6} className="mb-3 mt-2">
              <Form.Label className="fw-semibold text-muted">{fields[2].rules.label}</Form.Label>
              <Form.Control
                type="text"
                name={fields[2].name}
                value={formData[fields[2].name] || ""}
                onChange={handleChange}
                onBlur={() => validateField(fields[2].name, formData[fields[2].name])}
                isInvalid={!!errors[fields[2].name]}
              />
              <Form.Control.Feedback type="invalid">{errors[fields[2].name]}</Form.Control.Feedback>
            </Col>

            {/* Email */}
            <Col xs={12} md={6} className="mb-3 mt-2">
              <Form.Label className="fw-semibold text-muted">{fields[3].rules.label}</Form.Label>
              <Form.Control
                type="email"
                name={fields[3].name}
                value={formData[fields[3].name] || ""}
                onChange={handleChange}
                onBlur={() => validateField(fields[3].name, formData[fields[3].name])}
                isInvalid={!!errors[fields[3].name]}
              />
              <Form.Control.Feedback type="invalid">{errors[fields[3].name]}</Form.Control.Feedback>
            </Col>

            {/* Tax Number */}
            <Col xs={12} md={6} className="mb-3 mt-2">
              <Form.Label className="fw-semibold text-muted">{fields[4].rules.label}</Form.Label>
              <Form.Control
                type="text"
                name={fields[4].name}
                value={formData[fields[4].name] || ""}
                onChange={handleChange}
                onBlur={() => validateField(fields[4].name, formData[fields[4].name])}
                isInvalid={!!errors[fields[4].name]}
              />
              <Form.Control.Feedback type="invalid">{errors[fields[4].name]}</Form.Control.Feedback>
            </Col>

            {/* Address Line 1 */}
            <Col xs={12} md={6} className="mb-3 mt-2">
              <Form.Label className="fw-semibold text-muted">{fields[5].rules.label}</Form.Label>
              <Form.Control
                type="text"
                name={fields[5].name}
                value={formData[fields[5].name] || ""}
                onChange={handleChange}
                onBlur={() => validateField(fields[5].name, formData[fields[5].name])}
                isInvalid={!!errors[fields[5].name]}
              />
              <Form.Control.Feedback type="invalid">{errors[fields[5].name]}</Form.Control.Feedback>
            </Col>

            {/* Address Line 2 (optional) */}
            <Col xs={12} md={6} className="mb-3 mt-2">
              <Form.Label className="fw-semibold text-muted">{fields[6].rules.label}</Form.Label>
              <Form.Control
                type="text"
                name={fields[6].name}
                value={formData[fields[6].name] || ""}
                onChange={handleChange}
              />
            </Col>

            {/* City */}
            <Col xs={12} md={6} className="mb-3 mt-2">
              <Form.Label className="fw-semibold text-muted">{fields[7].rules.label}</Form.Label>
              <Form.Control
                type="text"
                name={fields[7].name}
                value={formData[fields[7].name] || ""}
                onChange={handleChange}
                onBlur={() => validateField(fields[7].name, formData[fields[7].name])}
                isInvalid={!!errors[fields[7].name]}
              />
              <Form.Control.Feedback type="invalid">{errors[fields[7].name]}</Form.Control.Feedback>
            </Col>

            {/* State */}
            <Col xs={12} md={6} className="mb-3 mt-2">
              <Form.Label className="fw-semibold text-muted">{fields[8].rules.label}</Form.Label>
              <Form.Control
                type="text"
                name={fields[8].name}
                value={formData[fields[8].name] || ""}
                onChange={handleChange}
                onBlur={() => validateField(fields[8].name, formData[fields[8].name])}
                isInvalid={!!errors[fields[8].name]}
              />
              <Form.Control.Feedback type="invalid">{errors[fields[8].name]}</Form.Control.Feedback>
            </Col>

            {/* Country */}
            <Col xs={12} md={6} className="mb-3 mt-2">
              <Form.Label className="fw-semibold text-muted">{fields[9].rules.label}</Form.Label>
              <Form.Control
                type="text"
                name={fields[9].name}
                value={formData[fields[9].name] || ""}
                onChange={handleChange}
                onBlur={() => validateField(fields[9].name, formData[fields[9].name])}
                isInvalid={!!errors[fields[9].name]}
              />
              <Form.Control.Feedback type="invalid">{errors[fields[9].name]}</Form.Control.Feedback>
            </Col>

            {/* Zip Code */}
            <Col xs={12} md={6} className="mb-3 mt-2">
              <Form.Label className="fw-semibold text-muted">{fields[10].rules.label}</Form.Label>
              <Form.Control
                type="text"
                name={fields[10].name}
                value={formData[fields[10].name] || ""}
                onChange={handleChange}
                onBlur={() => validateField(fields[10].name, formData[fields[10].name])}
                isInvalid={!!errors[fields[10].name]}
              />
              <Form.Control.Feedback type="invalid">{errors[fields[10].name]}</Form.Control.Feedback>
            </Col>

            {/* Invoice Prefix (optional) */}
            <Col xs={12} md={6} className="mb-3 mt-2">
              <Form.Label className="fw-semibold text-muted">{fields[11].rules.label}</Form.Label>
              <Form.Control
                type="text"
                name={fields[11].name}
                value={formData[fields[11].name] || ""}
                onChange={handleChange}
              />
            </Col>

            {/* Company Logo (optional) */}
            <Col xs={12} md={6} className="mb-3 mt-2">
              <Form.Label className="fw-semibold text-muted">{fields[12].rules.label}</Form.Label>
              <Form.Control
                type="text"
                name={fields[12].name}
                value={formData[fields[12].name] || ""}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <div className="d-flex gap-2 justify-content-end mt-4">
            <KiduReset initialValues={initialValues} setFormData={setFormData} />
            <Button type="submit" style={{ backgroundColor: "#18575A", border: "none" }}>
              Update
            </Button>
          </div>
        </Form>
      </Container>

      <Toaster position="top-right" />
    </>
  );
};

export default CompanyEdit;
