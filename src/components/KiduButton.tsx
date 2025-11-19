import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface KiduButtonProps {
  label: string;
  to?: string;
  className?: string;
  style?: React.CSSProperties;
}

const KiduButton: React.FC<KiduButtonProps> = ({ label, to, className, style }) => {
  const navigate = useNavigate();

  // Auto route mapping based on label text
  const getRouteFromLabel = (label: string): string | undefined => {
    const lower = label.toLowerCase();

    // 🔹 Sales & Purchases
    if (lower.includes("sale")) return "/sales-create";
    if (lower.includes("purchase")) return "/purchase-create";

    // 🔹 Inventory / Items
    if (lower.includes("inventory") || lower.includes("item")) return "/inventory-create";

    // 🔹 Customer
    if (lower.includes("customer")) return "/customers-create";

    // 🔹 Quotation / Reports
    if (lower.includes("quotation") || lower.includes("quote")) return "/quotation-create";
    if (lower.includes("report")) return "/report-create";

    // 🔹 Settings section
    if (lower.includes("category")) return "/category-create";
    if (lower.includes("company")) return "/company-create";
    if (lower.includes("manufacturer")) return "/manufacturer-create";
    if (lower.includes("product")) return "/product-create";
    if (lower.includes("user")) return "/user-create";

    return undefined; // fallback if no match
  };

  const handleClick = () => {
    const route = to || getRouteFromLabel(label);
    if (route) navigate(route);
    else console.warn(`⚠️ No route found for label: ${label}`);
  };

  return (
    <Button
      className={`fw-bold text-white ${className || ""}`}
      style={{
        background: "linear-gradient(90deg, #18575A)",
        border: "none",
        borderRadius: "6px", 
        padding: "8px 16px", 
        display: "inline-block",
        ...style,
      }}
      onClick={handleClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(79,70,229,0.4)";
        e.currentTarget.style.filter = "brightness(1.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.filter = "brightness(1)";
      }}
    >
      + {label}
    </Button>
  );
};

export default KiduButton;
