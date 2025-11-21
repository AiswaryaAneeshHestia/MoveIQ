import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface KiduButtonProps {
  label: string;
  to?: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const KiduButton: React.FC<KiduButtonProps> = ({ label, to, onClick, className = "", style }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) return onClick();
    if (to) return navigate(to);
  };

  return (
    <Button
      className={`fw-bold text-white ${className}`}
      style={{
        backgroundColor: "#18575A",
        border: "none",
        borderRadius: 6,
        height: 45,
        padding: "0 16px",
        ...style,
      }}
      onClick={handleClick}
    >
      {label}
    </Button>
  );
};

export default KiduButton;
