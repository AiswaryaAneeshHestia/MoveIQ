import React from "react";
import { Button } from "react-bootstrap";

interface Props {
  initialValues: any;
  setFormData: (data: any) => void;
}

const KiduReset: React.FC<Props> = ({ initialValues, setFormData }) => {
  const handleReset = () => {
    setFormData(initialValues);
  };

  return <Button variant="outline-secondary" onClick={handleReset}>Reset</Button>;
};

export default KiduReset;
