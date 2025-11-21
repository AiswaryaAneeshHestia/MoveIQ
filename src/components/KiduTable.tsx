import React, { useState, useMemo } from "react";
import { Table, Button, Row, Col, Container, Pagination } from "react-bootstrap";
import { FaEdit, FaEye } from "react-icons/fa";
import ExportToExcelButton from "../components/KiduExcelButton";
import KiduButton from "../components/KiduButton";
import KiduSearchBar from "../components/KiduSearchBar";

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
  onRetry
}) => {
  if (loading) return <div className="text-center py-5">Loading...</div>;

  if (error) {
    return (
      <Container fluid className="py-3 mt-5">
        <div className="alert alert-danger">{error}</div>
        <Button onClick={onRetry} style={{ backgroundColor: "#18575A", border: "none" }}>Retry</Button>
      </Container>
    );
  }

  const rowsPerPage = 10;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const reversedData = useMemo(() => [...data].reverse(), [data]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [searchTerm, setSearchTerm] = useState("");

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const filteredData = useMemo(() => {
    return reversedData.filter((item) =>
      columns.some((col) =>
        String(item[col.key] || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  }, [reversedData, searchTerm, columns]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <Container fluid className="py-3 mt-4">

      {/* 🔹 TITLE + SUBTITLE */}
      {data.length > 0 && (
        <Row className="mb-2 align-items-center">
          <Col>
            <h4 className="mb-0 fw-bold" style={{ fontFamily: "Urbanist" }}>{title}</h4>
            {subtitle && <p className="text-muted" style={{ fontFamily: "Urbanist" }}>{subtitle}</p>}
          </Col>
        </Row>
      )}

      {/* 🔍 SEARCH + ADD BUTTON BELOW title */}
      {data.length > 0 && (
        <Row className="mb-3 align-items-center">
          <Col>
            <KiduSearchBar
              placeholder="Search..."
              onSearch={(val) => {
                setSearchTerm(val);
                setCurrentPage(1);
              }}
              width="250px"
            />
          </Col>

          {showAddButton && addRoute && (
            <Col xs="auto" className="text-end">
              <KiduButton
                label={`+ ${addButtonLabel}`}
                to={addRoute}
                className="fw-bold d-flex align-items-center text-white"
                style={{ backgroundColor: "#18575A", border: "none", height: 45, width: 200 }}
              />
            </Col>
          )}
        </Row>
      )}

      <Row>
        <Col>
          {filteredData.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No matching records found.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover className="align-middle mb-0">
                <thead className="table-light text-center" style={{ fontFamily: "Urbanist" }}>
                  <tr>
                    <th>Sl No</th>

                    {columns.map(col => <th key={col.key}>{col.label}</th>)}

                    <th className="d-flex justify-content-between">
                      <div className="ms-5 mt-2">Action</div>
                      {showExport && <div className="mt-1"><ExportToExcelButton data={data} title={title} /></div>}
                    </th>
                  </tr>
                </thead>

                <tbody className="text-center" style={{ fontFamily: "Urbanist", fontSize: 15 }}>
                  {currentData.map((item, idx) => (
                    <tr key={item[idKey]}>
                      <td>{startIndex + idx + 1}</td>

                      {columns.map(col => <td key={col.key}>{item[col.key]}</td>)}

                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          {editRoute && (
                            <Button
                              size="sm"
                              style={{ backgroundColor: "transparent", border: "1px solid #18575A", color: "#18575A" }}
                              onClick={() => window.location.assign(`${editRoute}/${item[idKey]}`)}
                            >
                              <FaEdit className="me-1" /> Edit
                            </Button>
                          )}

                          {viewRoute && (
                            <Button
                              size="sm"
                              style={{ backgroundColor: "#18575A", border: "none", color: "white" }}
                              onClick={() => window.location.assign(`${viewRoute}/${item[idKey]}`)}
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

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-4 px-2">
          <span style={{ fontFamily: "Urbanist", color: "#18575A", fontWeight: 600 }}>
            Page {currentPage} of {totalPages}
          </span>

          <Pagination className="m-0">
            <Pagination.First disabled={currentPage === 1} onClick={() => handlePageChange(1)} style={{ color: "#18575A" }} />
            <Pagination.Prev disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} style={{ color: "#18575A" }} />

            {Array.from({ length: totalPages }, (_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => handlePageChange(i + 1)}
                style={{
                  backgroundColor: i + 1 === currentPage ? "#18575A" : "white",
                  borderColor: "#18575A",
                  color: i + 1 === currentPage ? "white" : "#18575A"
                }}
              >
                {i + 1}
              </Pagination.Item>
            ))}

            <Pagination.Next disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} style={{ color: "#18575A" }} />
            <Pagination.Last disabled={currentPage === totalPages} onClick={() => handlePageChange(totalPages)} style={{ color: "#18575A" }} />
          </Pagination>
        </div>
      )}
    </Container>
  );
};

export default KiduTable;
