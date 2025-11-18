import React from "react";
import { Button } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

interface KiduSearchbarProps {
  onSearch?: (query: string) => void;
}

const KiduSearchbar: React.FC<KiduSearchbarProps> = ({ onSearch }) => {
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-between flex-column flex-md-row align-items-stretch gap-2 mt-5">
      <div className="d-flex flex-column flex-md-row align-items-stretch w-100 gap-1">
        <input
          type="text"
          placeholder="Search here....."
          className="form-control custom-search-input p-3"
          style={{
            minWidth: "250px",
            flex: "1",
            height: "45px",
            fontSize: "1rem",
          }}
          onChange={(e) => onSearch && onSearch(e.target.value)}
        />
        <Button
          className="fw-bold d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: "#ffffffff",
            border: "1px solid #c0d5d6ff",
            width: "50px",
          }}
        >
          <BsSearch style={{ color: "#18575A", width: "50px" }} />
        </Button>
      </div>

      <Button
        className="fw-bold d-flex justify-content-center align-items-center text-white"
        style={{
          backgroundColor: "#18575A",
          width: "200px",
          height: "45px",
          border: "none",
        }}
        onClick={() => navigate("/admin-dashboard/new-trip-form")}
      >
        <FaPlus className="me-2 fw-bold" /> <p className="head-font mt-3">Add New Trip</p>
      </Button>
    </div>
  );
};

export default KiduSearchbar;
