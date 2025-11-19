// ============================================
// KiduTable.tsx - FINAL FIXED VERSION
// ============================================
import React, { useState, useMemo, useEffect, useRef } from "react";
import { Table, Container, Row, Col, Button, Pagination } from "react-bootstrap";
import { FaEdit, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import KiduSearchBar from "./KiduSearchBar";
import KiduButton from "./KiduButton";
import KiduDownload from "./KiduDownload";
import KiduPopupButton from "./KiduPopupButton";

interface Column {
  key: string;
  label: string;
}

interface KiduTableProps {
  columns: Column[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  addButtonLabel?: string;
  showActions?: boolean;
  showSearch?: boolean;
  onAddClick?: () => void;
  viewRoute?: string;
  editRoute?: string;
  idKey?: string;
  isServerSide?: boolean;
  onSearchChange?: (searchTerm: string) => void;
  onPageChange?: (page: number) => void;
  totalRecords?: number;
  currentServerPage?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRowClick?: (item: any) => void;
  AddModalComponent?: React.ComponentType<{
    show: boolean;
    handleClose: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onAdded: (newItem: any) => void;
  }>;
  title?: string;
}

const KiduTable: React.FC<KiduTableProps> = ({
  columns,
  data,
  addButtonLabel,
  showActions = true,
  showSearch = true,
  viewRoute,
  editRoute,
  idKey = "id",
  isServerSide = false,
  onSearchChange,
  onPageChange,
  totalRecords,
  currentServerPage,
  onRowClick,
  AddModalComponent,
  title,
  onAddClick,
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(currentServerPage || 1);
  const rowsPerPage = 10;
  const tableRef = useRef<HTMLDivElement>(null);

  // Reverse data only once with stable reference (client-side only)
  const reversedData = useMemo(() => {
    return isServerSide ? data : [...data].reverse();
  }, [data, isServerSide]);

  //  Filter logic with memoization (client-side only)
  const filteredData = useMemo(() => {
    if (isServerSide) return data;
    return reversedData.filter((item) =>
      columns.some((col) =>
        String(item[col.key] || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  }, [reversedData, columns, searchTerm, isServerSide, data]);

  //  Pagination logic
  const totalPages = isServerSide
    ? Math.ceil((totalRecords || 0) / rowsPerPage)
    : Math.ceil(filteredData.length / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = isServerSide
    ? data
    : filteredData.slice(startIndex, startIndex + rowsPerPage);

  // Reset to page 1 only when search term changes or data changes (client-side only)
  useEffect(() => {
    if (!isServerSide) {
      setCurrentPage(1);
    }
  }, [searchTerm, data.length, isServerSide]);

  // Sync with server page when in server-side mode
  useEffect(() => {
    if (isServerSide && currentServerPage) {
      setCurrentPage(currentServerPage);
    }
  }, [currentServerPage, isServerSide]);

  // Ensure current page is valid after filtering (client-side only)
  useEffect(() => {
    if (!isServerSide && currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages, isServerSide]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);

      // Call parent callback for server-side pagination
      if (isServerSide && onPageChange) {
        onPageChange(page);
      }

      // Scroll to table top smoothly
      if (tableRef.current) {
        tableRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleSearch = (val: string) => {
    setSearchTerm(val);

    //  FIXED: Call parent callback whenever provided (for both server-side AND popup)
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  return (
    <Container fluid className="p-1 mt-3" style={{ fontFamily: "Urbanist" }}>
      {/*  Search Bar + Add Button */}
      {(showSearch || addButtonLabel) && (
        <Row className="mb-3 px-3 align-items-center justify-content-between">
          {showSearch && (
            <Col xs={12} md={6} className="p-0">
              <KiduSearchBar
                onSearch={handleSearch}
                placeholder="Search records..."
              />
            </Col>
          )}
          {addButtonLabel && (
            <Col
              xs="12"
              md="auto"
              className="d-flex justify-content-md-end justify-content-start p-0 mt-2 mt-md-0"
            >
              <KiduButton label={addButtonLabel} />
            </Col>
          )}
        </Row>
      )}

      {/* Table */}
      <div ref={tableRef} className="table-responsive shadow-sm rounded-4 bg-white">
        <Table
          striped
          bordered
          hover
          responsive
          className="align-middle mb-0"
          style={{ border: "2px solid #dee2e6" }}
        >
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="bg-light text-uppercase fw-semibold"
                  style={{ border: "2px solid #dee2e6" }}
                >
                  {col.label}
                </th>
              ))}
              {showActions && (
                <th className="text-center bg-light">
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <span>ACTION</span>
                    {data.length > 0 && (
                      <KiduDownload
                        data={data}
                        filename={`table.csv`}
                        style={{
                          width: "36px",
                          height: "36px",
                          padding: "6px",
                        }}
                      />
                    )}
                  </div>
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item, index) => {
                const recordId = item[idKey];
                return (
                  <tr
                    key={index}
                    style={{
                      cursor: onRowClick ? "pointer" : "default",
                    }}
                    onClick={() => onRowClick && onRowClick(item)}
                  >
                    {columns.map((col) => (
                      <td key={col.key} style={{ border: "2px solid #dee2e6" }}>
                        {item[col.key] ?? "-"}
                      </td>
                    ))}
                    {showActions && (
                      <td
                        className="text-center"
                        style={{ border: "2px solid #dee2e6" }}
                        onClick={(e) => e.stopPropagation()} // prevent triggering row click on buttons
                      >
                        <div className="d-flex justify-content-center gap-2 flex-wrap">
                          {viewRoute && (
                            <Button
                              size="sm"
                              onClick={() =>
                                recordId &&
                                navigate(
                                  viewRoute.replace(":id", recordId.toString())
                                )
                              }
                              style={{
                                backgroundColor: "transparent",
                                border: "1px solid #18575A",
                                color: "#18575A",
                              }}
                            >
                              <FaEye className="me-1" /> View
                            </Button>
                          )}

                          {editRoute && (
                            <Button
                              size="sm"
                              onClick={() =>
                                recordId &&
                                navigate(
                                  editRoute.replace(":id", recordId.toString())
                                )
                              }
                              style={{
                                background:
                                  "linear-gradient(90deg, #18575A 0%, #1d575aff 100%)",
                                border: "none",
                                color: "white",
                              }}
                            >
                              <FaEdit className="me-1" /> Edit
                            </Button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (showActions ? 1 : 0)}
                  className="text-center py-5"
                  style={{ border: "2px solid #dee2e6" }}
                >
                  <div className="d-flex flex-column justify-content-center align-items-center">
                    <p className="text-muted mb-3">No matching records found</p>
                    {AddModalComponent && (
                      <KiduPopupButton
                        label={`Add ${title ? title.replace("Select ", "") : ""}`}
                        onClick={() => onAddClick?.()}
                      />
                    )}

                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Centered Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center mt-4">
          <Pagination>
            <Pagination.First
              disabled={currentPage === 1}
              onClick={() => handlePageChange(1)}
            />
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            />

            {Array.from({ length: totalPages }, (_, idx) => (
              <Pagination.Item
                key={idx + 1}
                active={idx + 1 === currentPage}
                onClick={() => handlePageChange(idx + 1)}
              >
                {idx + 1}
              </Pagination.Item>
            ))}

            <Pagination.Next
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            />
            <Pagination.Last
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(totalPages)}
            />
          </Pagination>
        </div>
      )}
    </Container>
  );
};

export default KiduTable;
