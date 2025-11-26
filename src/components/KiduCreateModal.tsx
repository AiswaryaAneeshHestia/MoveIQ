import { useState } from "react";
import { Modal, Button, Spinner, Form } from "react-bootstrap";
import toast from "react-hot-toast";
import HttpService from "../services/common/HttpService";
import { KiduValidation } from "../components/KiduValidation";

interface Field {
  name: string;
  label: string;
  type: "text" | "number" | "textarea";
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}

interface KiduCreateModalProps<T> {
  show: boolean;
  handleClose: () => void;
  title: string;
  fields: Field[];
  endpoint: string;
  onCreated: (newItem: T) => void;
}

function KiduCreateModal<T>({
  show,
  handleClose,
  title,
  fields,
  endpoint,
  onCreated
}: KiduCreateModalProps<T>) {
  const [formData, setFormData] = useState<Record<string, string | number>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    for (const field of fields) {
      const rules = {
        type: field.type,
        required: field.required,
        minLength: field.minLength,
        maxLength: field.maxLength,
        pattern: field.pattern,
        label: field.label
      };

      const result = KiduValidation.validate(formData[field.name], rules);

      if (!result.isValid) {
        toast.error(result.message || "Invalid input", {
          style: { background: "#ffe5e5", color: "#b91c1c" }
        });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const res = await HttpService.callApi<T>(endpoint, "POST", formData);

      toast.success("Created successfully!", {
        style: { background: "#18575A", color: "white" }
      });

      onCreated(res as T);
      handleClose();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to add item",
        { style: { background: "#ffe5e5", color: "#b91c1c" } }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton style={{ background: "#f8f9fa" }}>
        <Modal.Title className="fs-6 fw-semibold text-dark">{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          {fields.map(field => {
            const labelText = field.required ? `${field.label} *` : field.label;

            return (
              <Form.Group key={field.name} className="mb-3">
                <Form.Label>{labelText}</Form.Label>

                {field.type === "textarea" ? (
                  <Form.Control
                    as="textarea"
                    rows={3}
                    required={field.required}
                    value={formData[field.name] || ""}
                    onChange={e => handleChange(field.name, e.target.value)}
                  />
                ) : (
                  <Form.Control
                    type={field.type}
                    required={field.required}
                    value={formData[field.name] || ""}
                    onChange={e => handleChange(field.name, e.target.value)}
                  />
                )}
              </Form.Group>
            );
          })}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>

        <Button
          style={{ backgroundColor: "#18575A", border: "none" }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner size="sm" animation="border" className="me-2" /> Saving...
            </>
          ) : (
            "Save"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default KiduCreateModal;
