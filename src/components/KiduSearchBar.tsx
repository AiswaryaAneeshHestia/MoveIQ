import React, { useState } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

interface KiduSearchBarProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  width?: string;
  initial?: string;
}

const KiduSearchBar: React.FC<KiduSearchBarProps> = ({
  placeholder = "Search...",
  onSearch,
  width = "100%",
  initial = "",
}) => {
  const [value, setValue] = useState(initial);

  const handleSearch = () => {
    onSearch(value.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div style={{ width, maxWidth: "100%" }}>
      <InputGroup>
        <Form.Control
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{
            borderRight: "none",
            borderColor: "#dee2e6",
            boxShadow: "none",
            fontFamily: "Urbanist, system-ui, -apple-system",
            height: 45,
            padding: "0.75rem 1rem",
          }}
        />
        <Button
          onClick={handleSearch}
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #c0d5d6ff",
            color: "#18575A",
            paddingLeft: "0.9rem",
            paddingRight: "0.9rem",
            height: 45,
          }}
        >
          <FaSearch />
        </Button>
      </InputGroup>
    </div>
  );
};

export default KiduSearchBar;
