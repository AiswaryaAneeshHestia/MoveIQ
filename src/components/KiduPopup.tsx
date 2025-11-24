import React, { useState, useEffect, useMemo } from "react";
import { Modal, Spinner } from "react-bootstrap";
import HttpService from "../services/common/HttpService";
import KiduTable from "./KiduTable";
import KiduSearchBar from "./KiduSearchBar";
import type { CustomResponse } from "../types/common/ApiTypes";

interface KiduPopupProps<T> {
  show: boolean;
  handleClose: () => void;
  title: string;
  fetchEndpoint: string;
  columns: { key: keyof T; label: string }[];
  onSelect?: (item: T) => void;
  AddModalComponent?: React.ComponentType<{
    show: boolean;
    handleClose: () => void;
    onAdded: (newItem: T) => void;
  }>;
  searchKeys?: (keyof T)[];
}

function KiduPopup<T extends Record<string, any>>({
  show,
  handleClose,
  title,
  fetchEndpoint,
  columns,
  onSelect,
  AddModalComponent,
  searchKeys
}: KiduPopupProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
  if (!show) return;

  // asynchronously reset query and set loading
  setTimeout(() => {
    setQuery("");
    setLoading(true);
  }, 0);

  HttpService.callApi<CustomResponse<T[]>>(fetchEndpoint, "GET")
    .then(res => {
      if (Array.isArray(res)) setData(res);
      else if (res.isSuccess && Array.isArray(res.value)) setData(res.value);
      else if (res.value?.data && Array.isArray(res.value.data)) setData(res.value.data);
    })
    .finally(() => setLoading(false));
}, [show, fetchEndpoint]);

  const filteredData = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text || !searchKeys?.length) return data;
    return data.filter(item =>
      searchKeys.some(key =>
        item[key]?.toString().toLowerCase().includes(text)
      )
    );
  }, [query, data, searchKeys]);

  const handleSelect = (item: T) => {
    onSelect?.(item);
    handleClose();
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg" centered className="head-font">
        <Modal.Header closeButton style={{ backgroundColor:"#f8f9fa" }}>
          <Modal.Title className="fs-6 fw-semibold text-dark">{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ minHeight:"300px" }}>
          {loading ? (
            <div className="text-center my-4">
              <Spinner animation="border" size="sm" /> Loading...
            </div>
          ) : (
            <>
              <div className="mb-3 px-2">
                <KiduSearchBar onSearch={setQuery} placeholder="Search records..." />
              </div>

              <KiduTable
                columns={columns.map(c => ({ key:String(c.key), label:c.label }))}
                data={filteredData}
                onRowClick={handleSelect}
                // AddModalComponent={AddModalComponent}
                title={title}
                // onAddClick={() => setShowAddModal(true)}
              />
            </>
          )}
        </Modal.Body>
      </Modal>

      {AddModalComponent && (
        <AddModalComponent
          show={showAddModal}
          handleClose={() => setShowAddModal(false)}
          onAdded={newItem => {
            setData(prev => [...prev, newItem]);
            setShowAddModal(false);
          }}
        />
      )}
    </>
  );
}

export default KiduPopup;
