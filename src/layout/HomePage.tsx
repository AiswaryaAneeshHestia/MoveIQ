import React, { useState, useEffect } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { FaArrowTrendDown, FaPlus } from "react-icons/fa6";
import ProgressBar from "../layout/ProgressBar";
import Charts from "../layout/Charts";
import { useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import TripService from "../services/Trip.services";

// 🔄 Replace hot-toast with toastify
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Loader from "../components/KiduLoader";

interface CardData {
  title: string;
  value: number;
  change: number;
  color: string;
  route: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        setLoading(true);
        const response = await TripService.getTripDashboard();
        console.log(response);

        if (response?.isSuccess && response?.value) {
          setCards(response.value);
        } else {
          toast.error("Failed to load dashboard data.");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Error fetching dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCardData();
  }, []);

  console.log(cards);

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error("Please enter a Trip ID to search.");
      return;
    }

    try {
      const response = await TripService.getById(Number(searchTerm.trim()));
      console.log(response);

      if (response.isSucess && response.value) {
        const trip = response.value;
        const status = trip.tripStatus;

        switch (status) {
          case "Scheduled":
            navigate(`/admin-dashboard/scheduled/${trip.tripOrderId}`);
            break;
          case "Completed":
            navigate(`/admin-dashboard/completed/${trip.tripOrderId}`);
            break;
          case "Canceled":
            navigate(`/admin-dashboard/Cancelled/${trip.tripOrderId}`);
            break;
          default:
            navigate(`/admin-dashboard/today-trips/${trip.tripOrderId}`);
        }

        toast.success(
          `Trip ${trip.tripOrderId} found! Opening ${status} trips...`
        );
      } else {
        toast.error("No trip found with this ID.");
      }
    } catch (error) {
      console.error("Error fetching trip by ID:", error);
      toast.error("Error fetching trip details.");
    }
  };

  return (
    <>
      <div className="d-flex flex-column p-3 mt-5 mt-md-2">
        {/* Search + Button */}
        <div className="d-flex justify-content-between flex-column flex-md-row align-items-stretch gap-2 mt-5">
          <div className="d-flex flex-column flex-md-row align-items-stretch w-100 gap-1">
            <input
              type="text"
              placeholder="Search here....."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control custom-search-input p-3"
              style={{
                minWidth: "250px",
                flex: "1",
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
              <BsSearch
                style={{
                  color: "#18575A",
                  width: "50px",
                }}
              />
            </Button>
          </div>

          <Button
            className="fw-bold d-flex justify-content-center align-items-center text-white "
            style={{
              backgroundColor: "#18575A",
              width: "200px",
              height: "45px",
              border: "none",
            }}
            onClick={() => navigate("/admin-dashboard/new-trip-form")}
          >
            <FaPlus className="me-2 fw-bold" />{" "}
            <p className="head-font mt-3">Add New Trip</p>
          </Button>
        </div>

        {/* Cards */}
        <Container fluid className="mt-5 px-0">
          <Row className="g-2 justify-content-start mb-2">
            <h6
              className="fw-medium mb-3 text-start head-font"
              style={{ color: "gray" }}
            >
              Overview
            </h6>

            {loading ? (
              <div className="d-flex justify-content-center align-items-center w-100 mt-3">
                <Loader type="..." />;
              </div>
            ) : (
              cards.map((card, idx) => (
                <Col
                  xs={6}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={2}
                  key={idx}
                  className="d-flex"
                >
                  <Card
                    onClick={() => handleCardClick(card.route)}
                    className="shadow-sm w-100 me-3 overview-card"
                    style={{
                      backgroundColor: card.color,
                      color: "white",
                      height: "90px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    <Card.Body className="p-2 d-flex flex-column justify-content-between">
                      <p
                        className="mb-1 fw-bold text-start head-font"
                        style={{ fontSize: "0.95rem" }}
                      >
                        {card.title}
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <p
                          className="mb-0 sub-font"
                          style={{ fontSize: "0.75rem" }}
                        >
                          {card.value}
                        </p>
                        <p
                          className="mb-0 d-flex align-items-center"
                          style={{ fontSize: "0.75rem" }}
                        >
                          {card.change > 0 ? `+${card.change}` : card.change}{" "}
                          <FaArrowTrendDown className="ms-1" />
                        </p>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>

          <Charts />

          <Row>
            <ProgressBar />
          </Row>
        </Container>
      </div>

      {/* 🔄 Replaced Toaster with ToastContainer */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default HomePage;
