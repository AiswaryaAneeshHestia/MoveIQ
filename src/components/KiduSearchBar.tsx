import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";

interface KiduSearchBarProps {
  placeholder?: string;
  onSearch: (value: string) => void;
}

const KiduSearchBar: React.FC<KiduSearchBarProps> = ({
  placeholder = "Search here.....",
  onSearch,
}) => {
  const [value, setValue] = useState("");

  const handleSearch = () => {
    onSearch(value.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="d-flex flex-column flex-md-row align-items-stretch w-100 gap-1">
      <Form.Control
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyPress={handleKeyPress}
        className="form-control custom-search-input p-3 text-dark"
        style={{
          minWidth: "250px",
          flex: 1,
          height: "45px",
          fontSize: "1rem",
        }}
      />

      <Button
        className="fw-bold d-flex justify-content-center align-items-center"
        style={{
          backgroundColor: "#ffffffff",
          border: "1px solid #c0d5d6ff",
          width: "50px",
        }}
        onClick={handleSearch}
      >
        <BsSearch style={{ color: "#18575A", width: "50px" }} />
      </Button>
    </div>
  );
};

export default KiduSearchBar;
