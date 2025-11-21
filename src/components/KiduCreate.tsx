import React, { useState, useEffect } from "react";
import { Card, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { BsSearch } from "react-icons/bs";
import KiduPrevious from "./KiduPrevious";
import KiduValidation, { ValidationMessage } from "./KiduValidation";

export interface FieldShape {
  name: string;
  label: string;
  type: "text" | "number" | "textarea" | "email" | "popup" | "select" | "dropLocations" | "password" | "url";
  as?: "textarea" | "select";
  options?: string[];
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}

interface PopupHandlers {
  [key: string]: {
    value: string;
    onOpen: () => void;
  };
}

interface KiduCreateProps {
  title: string;
  fields: FieldShape[];
  onSubmit: (formData: Record<string, unknown>) => void;
  loading?: boolean;
  submitText?: string;
  children?: React.ReactNode;
  popupHandlers?: PopupHandlers;
}

const KiduCreate: React.FC<KiduCreateProps> = ({
  title,
  fields,
  onSubmit,
  loading = false,
  submitText = "Create",
  children,
  popupHandlers = {},
}) => {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const temp: Record<string, unknown> = {};
    fields.forEach(f => (temp[f.name] = ""));
    setFormData(temp);
  }, [fields]);

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    const fieldRule = fields.find(f => f.name === name);
    if (fieldRule) {
      const result = KiduValidation.validate(value, fieldRule);
      setErrors(prev => ({ ...prev, [name]: result.isValid ? "" : result.message! }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    fields.forEach(f => {
      const result = KiduValidation.validate(formData[f.name], f);
      if (!result.isValid) newErrors[f.name] = result.message!;
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.warn("Please fix the highlighted errors.");
      return;
    }

    try {
      onSubmit(formData);
    } catch {
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  const handleReset = () => {
    const resetData: Record<string, unknown> = {};
    fields.forEach(f => (resetData[f.name] = ""));
    setFormData(resetData);
    setErrors({});
  };

  return (
    <Card className="mx-2 my-3 shadow-sm rounded-3">
      <Card.Header className="d-flex align-items-center gap-3" style={{ backgroundColor: "#3B82F6", color: "white", padding: "0.25rem 0.75rem" }}>
        <KiduPrevious />
        <h5 className="mb-0 fw-bold">{title}</h5>
      </Card.Header>

      <Card.Body style={{ backgroundColor: "#f7f7f7ff", padding: "1.5rem", fontFamily: "Urbanist" }}>
        <Form onSubmit={handleSubmit}>
          <Row>
            {fields.map((field, idx) => {
              const popup = popupHandlers[field.name];
              const isPopup = field.type === "popup" && popup;
              const isTextarea = field.as === "textarea";
              const isSelect = field.as === "select" && field.options;

              return (
                <Col key={idx} xs={12} md={6} className="mb-3">
                  <Form.Label className="fw-semibold">
                    {field.label} {field.required && <span className="text-danger">*</span>}
                  </Form.Label>

                  {isPopup ? (
                    <InputGroup>
                      <Form.Control
                        type="text"
                        value={popup.value}
                        placeholder={`Select ${field.label}`}
                        readOnly
                        style={{ borderColor: errors[field.name] ? "#EF4444" : "#dee2e6" }}
                      />
                      <Button variant="outline-primary" onClick={popup.onOpen}>
                        <BsSearch />
                      </Button>
                    </InputGroup>
                  ) : isTextarea ? (
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name={field.name}
                      value={(formData[field.name] as string) ?? ""}
                      onChange={e => handleChange(field.name, e.target.value)}
                      placeholder={field.placeholder || `Enter ${field.label}`}
                      style={{ borderColor: errors[field.name] ? "#EF4444" : "#dee2e6" }}
                    />
                  ) : isSelect ? (
                    <Form.Select
                      name={field.name}
                      value={(formData[field.name] as string) ?? ""}
                      onChange={e => handleChange(field.name, e.target.value)}
                      style={{ borderColor: errors[field.name] ? "#EF4444" : "#dee2e6" }}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options!.map((opt, i) => (
                        <option key={i} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </Form.Select>
                  ) : (
                    <Form.Control
                      type={field.type}
                      name={field.name}
                      value={(formData[field.name] as string) ?? ""}
                      onChange={e => handleChange(field.name, e.target.value)}
                      placeholder={field.placeholder || `Enter ${field.label}`}
                      style={{ borderColor: errors[field.name] ? "#EF4444" : "#dee2e6" }}
                    />
                  )}
                  <ValidationMessage message={errors[field.name]} />
                </Col>
              );
            })}
          </Row>

          {children}

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="outline-secondary" onClick={handleReset}>
              Reset
            </Button>
            <Button type="submit" style={{ backgroundColor: "#3B82F6", border: "none", minWidth: "120px" }} disabled={loading}>
              {loading ? "Saving..." : submitText}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default KiduCreate;
