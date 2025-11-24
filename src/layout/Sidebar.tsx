import React, { useState } from "react";
import { Nav, Navbar, Container, Collapse } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { BsGridFill, BsChatDots, BsPeople, BsGear, BsPersonFill, BsChevronDown, BsCashStack, BsCarFront, } from "react-icons/bs";
import { FaFileInvoice } from "react-icons/fa6";
import { BiLogOut } from "react-icons/bi";
import AuthService from "../services/common/Auth.services";

const Sidebar: React.FC = () => {
    const [hovered, setHovered] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [vehiclesOpen, setVehiclesOpen] = useState(false);

    const menuItems = [
        { icon: <BsGridFill />, label: "Dashboard", path: "/dashboard", exact: true },
        { icon: <BsChatDots />, label: "My Trips", path: "/dashboard/trip-list" },
        { icon: <BsPeople />, label: "Customers", path: "/dashboard/customer-list" },
        { icon: <BsPersonFill />, label: "Drivers", path: "/dashboard/driver-list" },
        { icon: <FaFileInvoice />, label: "Invoices", path: "/dashboard/invoices" },
        { icon: <BsCashStack />, label: "Expenses", path: "/dashboard/expenses" },
    ];
    const vehiclesSubMenu = [
        { label: "Vehicles", path: "/dashboard/vehicles" },
        { label: "Maintenance", path: "/dashboard/vehicles/maintenance" },
    ]
    const settingsSubMenu = [
        { label: "Users", path: "/dashboard/settings/user-list" },
        { label: "Company", path: "/dashboard/settings/company-list" },
        { label: "Expense Types", path: "/dashboard/settings/expenseTypes" },
    ];

    const navigate = useNavigate();
    const handleLogout = () => {
        AuthService.logout();
        navigate("/");
    };

    return (
        <>
            {/* Sidebar for medium+ screens */}
            <div
                className="d-none d-md-flex flex-column rounded-3 align-items-center py-3 position-fixed"
                style={{
                    width: hovered ? "200px" : "70px",
                    minHeight: "100vh",
                    backgroundColor: "#18575A",
                    transition: "width 0.3s",
                    zIndex: 1000,
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {/* Profile section */}
                <div className="profile-section text-center mb-4">
                    {hovered ? (
                        <p className="mt-2 text-white fw-bold" style={{ fontSize: "14px" }}>
                            MoveIQ
                        </p>
                    ) : <p className="fw-bolder fs-6 text-white head-font"><img src="https://static.vecteezy.com/system/resources/previews/024/700/685/large_2x/r-symbol-trademark-on-transparent-background-free-png.png" alt="logo" style={{ width: "30px", height: "30px" }} /></p>}
                    <img
                        src="http://www.pngall.com/wp-content/uploads/2018/04/Businessman-Transparent.png"
                        alt="profile"
                        className="rounded-circle mb-2"
                        style={{
                            width: hovered ? "80px" : "45px",
                            height: hovered ? "80px" : "45px",
                            border: "2px solid white",
                            transition: "all 0.3s",
                        }}
                    />
                </div>
                <div
                    style={{
                        flex: 1,
                        width: "100%",
                        maxHeight: "calc(100vh - 190px)", // limit height so content can overflow (adjust 140px if you change profile area)
                        overflowY: hovered ? "auto" : "hidden",
                        overflowX: hovered ? "hidden" : "hidden",
                        scrollbarWidth: "thin", // make sure scroll is smooth and thin
                        scrollbarColor: "#c0d5d6ff transparent",
                    }}
                    /* Add a classname so we can style WebKit scrollbars if needed */
                    className="admin-sidebar-scroll"
                >
                    {/* Navigation items */}
                    <Nav className="flex-column gap-2 w-100 text-center">
                        {menuItems.map((item, index) => (
                            <div className="text-start" key={index}>
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.exact} //Only exact match for Dashboard
                                    className={({ isActive }) =>
                                        `d-flex align-items-center p-2  ${isActive ? "bg-white text-success" : "text-white"
                                        } ${hovered ? "justify-content-start ms-5 me-5" : "justify-content-center"} rounded mx-2`
                                    }
                                    style={{ fontSize: "14px", textDecoration: "none" }}
                                >
                                    {item.icon}
                                    {hovered && <span className="ms-2 rounded">{item.label}</span>}
                                </NavLink>
                            </div>
                        ))}
                        {/* Vehicles */}
                        <div
                            className={`flex-column gap-2 w-100 text-center ${hovered ? "justify-content-start ms-2 mt-2" : "justify-content-center"} rounded `}
                            style={{ fontSize: "14px", textDecoration: "none" }}
                            onClick={() => setVehiclesOpen(!vehiclesOpen)}
                        >
                            <BsCarFront className="text-white" />
                            {hovered && (
                                <>
                                    <span className="ms-2 text-white" style={{ cursor: "pointer" }}>Vehicles</span>
                                    <BsChevronDown
                                        className="ms-2 text-white"
                                        style={{ transition: "transform 0.3s", cursor: "pointer", transform: vehiclesOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                                    />
                                </>
                            )}
                        </div>

                        <Collapse in={vehiclesOpen && hovered}>
                            <div className="flex-column text-light mt-2" >
                                {vehiclesSubMenu.map((sub) => (
                                    <NavLink
                                        key={sub.path}
                                        to={sub.path}
                                        end
                                        className={({ isActive }) =>
                                            `d-block p-1 ${isActive ? "bg-white text-success rounded mx-3" : "text-white"}`
                                        }
                                        style={{ fontSize: "12px", textDecoration: "none" }}
                                    >

                                        {sub.label}
                                    </NavLink>
                                ))}
                            </div>
                        </Collapse>

                        {/* Settings */}
                        <div
                            className={`flex-column gap-2 w-100 text-center ${hovered ? "justify-content-start ms-2 mt-3" : "justify-content-center"} rounded  mt-2`}
                            style={{ fontSize: "14px", textDecoration: "none" }}
                            onClick={() => setSettingsOpen(!settingsOpen)}
                        >
                            <BsGear className="text-white" />
                            {hovered && (
                                <>
                                    <span className="ms-2 text-white" style={{ cursor: "pointer" }}>Settings</span>
                                    <BsChevronDown
                                        className="ms-2 text-white"
                                        style={{ transition: "transform 0.3s", cursor: "pointer", transform: settingsOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                                    />
                                </>
                            )}
                        </div>

                        <Collapse in={settingsOpen && hovered}>
                            <div className="flex-column text-light mt-2" >
                                {settingsSubMenu.map((subItem) => (
                                    <NavLink
                                        key={subItem.path}
                                        to={subItem.path}
                                        end
                                        className={({ isActive }) =>
                                            `d-block p-1 ${isActive ? "bg-white text-success rounded mx-3" : "text-white"}`
                                        }
                                        style={{ fontSize: "12px", textDecoration: "none" }}
                                    >

                                        {subItem.label}
                                    </NavLink>
                                ))}
                            </div>
                        </Collapse>

                        {/* Logout */}
                        <p
                            onClick={handleLogout}
                            className="d-flex align-items-center justify-content-center p-2 text-white mt-5 mx-3 rounded fw-semibold"
                            style={{ fontSize: "16px", textDecoration: "none", backgroundColor: "#1b6668ff", cursor: "pointer" }}
                        >
                            <BiLogOut />
                            {hovered && <span className="ms-2">Logout</span>}
                        </p>
                    </Nav>
                </div>

            </div>

            {/* Bottom navbar for small screens */}
            <Navbar
                fixed="bottom"
                expand="md"
                className="d-md-none"
                style={{ backgroundColor: "#18575A" }}
            >
                <Container fluid className="justify-content-around">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.exact} // Only exact match for Dashboard
                            className={({ isActive }) =>
                                `d-flex flex-column align-items-center ${isActive ? "text-warning" : "text-white"
                                }`
                            }
                            style={{ fontSize: "10px", textDecoration: "none" }}
                        >
                            {item.icon}
                            <span style={{ fontSize: "10px" }}>{item.label}</span>
                        </NavLink>
                    ))}
                </Container>
            </Navbar>

            {/* Inline minimal WebKit scrollbar styles - won't change UI */}
            <style>
                {`
          .admin-sidebar-scroll::-webkit-scrollbar {
            width: 8px;
          }
          .admin-sidebar-scroll::-webkit-scrollbar-thumb {
            background: rgba(192,213,214,0.9);
            border-radius: 6px;
          }
          .admin-sidebar-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
        `}
            </style>
        </>
    );
};

export default Sidebar;
