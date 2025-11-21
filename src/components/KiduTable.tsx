import React from "react";
import { Table, Button, Row, Col, Container } from "react-bootstrap";
import { FaEdit, FaEye } from "react-icons/fa";
import ExportToExcelButton from "../components/KiduExcelButton";

interface Column {
  key: string;
  label: string;
}

interface KiduTableProps {
  title?: string;
  subtitle?: string;
  columns: Column[];
  data: any[];
  idKey?: string;
  addButtonLabel?: string;
  addRoute?: string;
  viewRoute?: string;
  editRoute?: string;
  showAddButton?: boolean;
  showExport?: boolean;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const KiduTable: React.FC<KiduTableProps> = ({
  title = "Table",
  subtitle = "",
  columns,
  data,
  idKey = "id",
  addButtonLabel = "Add New",
  addRoute,
  viewRoute,
  editRoute,
  showAddButton = true,
  showExport = true,
  loading = false,
  error = null,
  onRetry,
}) => {
  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  if (error) {
    return (
      <Container fluid className="py-3 mt-5">
        <div className="alert alert-danger">{error}</div>
        <Button
          onClick={onRetry}
          style={{ backgroundColor: "#18575A", border: "none" }}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container fluid className="py-3 mt-4">
      {/* Header */}
      {data.length > 0 && (
        <Row className="mb-3 align-items-center">
          <Col>
            <h4 className="mb-0 fw-bold" style={{ fontFamily: "Urbanist" }}>
              {title}
            </h4>
            {subtitle && (
              <p className="text-muted" style={{ fontFamily: "Urbanist" }}>
                {subtitle}
              </p>
            )}
          </Col>

          {showAddButton && addRoute && (
            <Col xs="auto" className="text-end">
              <Button
                className="fw-bold d-flex align-items-center text-white"
                style={{
                  backgroundColor: "#18575A",
                  border: "none",
                  height: 45,
                  width: 200,
                }}
                onClick={() => window.location.assign(addRoute)}
              >
                + {addButtonLabel}
              </Button>
            </Col>
          )}
        </Row>
      )}

      {/* Table */}
      <Row>
        <Col>
          {data.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No records found.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover className="align-middle mb-0">
                <thead
                  className="table-light text-center"
                  style={{ fontFamily: "Urbanist" }}
                >
                  <tr>
                    <th>Sl No</th>

                    {columns.map((col) => (
                      <th key={col.key}>{col.label}</th>
                    ))}

                    <th className="d-flex justify-content-between">
                      <div className="ms-5 mt-2">Action</div>

                      {showExport && (
                        <div className="mt-1">
                          <ExportToExcelButton data={data} title={title} />
                        </div>
                      )}
                    </th>
                  </tr>
                </thead>

                <tbody
                  className="text-center"
                  style={{ fontFamily: "Urbanist", fontSize: 15 }}
                >
                  {[...data].reverse().map((item, idx) => (
                    <tr key={item[idKey]}>
                      <td>{idx + 1}</td>

                      {columns.map((col) => (
                        <td key={col.key}>{item[col.key]}</td>
                      ))}

                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          {editRoute && (
                            <Button
                              size="sm"
                              style={{
                                backgroundColor: "transparent",
                                border: "1px solid #18575A",
                                color: "#18575A",
                              }}
                              onClick={() =>
                                window.location.assign(
                                  `${editRoute}/${item[idKey]}`
                                )
                              }
                            >
                              <FaEdit className="me-1" /> Edit
                            </Button>
                          )}

                          {viewRoute && (
                            <Button
                              size="sm"
                              style={{
                                backgroundColor: "#18575A",
                                border: "none",
                                color: "white",
                              }}
                              onClick={() =>
                                window.location.assign(
                                  `${viewRoute}/${item[idKey]}`
                                )
                              }
                            >
                              <FaEye className="me-1" /> View
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default KiduTable;
