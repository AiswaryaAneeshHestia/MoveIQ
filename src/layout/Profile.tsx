import React, { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { Card, Button, Form, Row, Col } from "react-bootstrap";
import { BsUpload } from "react-icons/bs";
import { toast } from "react-toastify";

const Profile: React.FC = () => {
  const [username, setUsername] = useState("User");
  const [password] = useState("********"); // cannot be edited
  const [preview, setPreview] = useState<string>(
    "http://www.pngall.com/wp-content/uploads/2018/04/Businessman-Transparent.png"
  );
  // Load username from localStorage (same as Navbar)
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        if (parsedUser?.userName) {
          setUsername(parsedUser.userName);
        }
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
    }
  }, []);
  // Handle new image selection
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  // Save handler
  const handleSave = () => {
    toast.success("Profile updated successfully!");
  };

  return (
    <div
      className="d-flex  p-3 px-md-4 head-font"
      style={{ minHeight: "100vh" }}
    >
      <Card
        className="shadow-sm border-0 w-100"
        style={{
          borderRadius: "10px",
          maxWidth: "700px",
          backgroundColor: "#f8f9fa",
        }}
      >
        <Card.Body>
          {/* Profile Picture */}
          <div className="d-flex flex-column align-items-center mb-4">
            <div
              className="position-relative"
              style={{ width: "120px", height: "120px" }}
            >
              <img
                src={preview}
                alt="Profile"
                className="rounded-circle border border-2"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderColor: "#18575A",
                }}
              />
              <label
                htmlFor="profileUpload"
                className="position-absolute bottom-0 end-0 bg-white rounded-circle px-2 py-1 shadow"
                style={{ cursor: "pointer" }}
              >
                <BsUpload color="#18575A" />
              </label>
              <input
                type="file"
                id="profileUpload"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </div>
            <p className="mt-2 mb-0 fw-medium">{username}</p>
            <small className="text-muted">User</small>
          </div>
          {/* Form Fields */}
          <Form>
            <Row className="mb-3">
              <Form.Group as={Col} md={12} controlId="username">
                <Form.Label className="fw-semibold">Username</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  style={{ borderRadius: "6px" }}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md={12} controlId="password">
                <Form.Label className="fw-semibold">Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  disabled
                  style={{
                    borderRadius: "6px",
                    backgroundColor: "#e9ecef",
                    cursor: "not-allowed",
                  }}
                />
                <Form.Text className="text-muted">
                  Password cannot be changed here.
                </Form.Text>
              </Form.Group>
            </Row>
            {/* Save Button */}
            <div className="text-center mt-4">
              <Button
                onClick={handleSave}
                className="fw-semibold px-4"
                style={{
                  backgroundColor: "#18575A",
                  border: "none",
                  borderRadius: "6px",
                }}
              >
                Save Changes
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Profile;
