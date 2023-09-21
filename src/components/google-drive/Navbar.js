import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";

export default function NavbarComponent() {
   const { currentUser } = useAuth();
   const userStyle = {
    'background-color': '#36454F',
    'color': 'white',
    'border-radius': '5em',
    'width': '50px',
    'text-align': 'center',
    'margin-right': '5px',
   }
   return (
      <Navbar bg="light">
         <div className="nav-container">
            <Navbar.Brand as={Link} to="/" className="ms-4">
            <FontAwesomeIcon icon={faFolderOpen} style={{color: "#0a48b2",}} />
            DriveClone
            </Navbar.Brand>
            {currentUser && (
               <Nav>
                  <Nav.Link as={Link} to="/user" style={userStyle}>
                     {currentUser.email[0].toUpperCase()}
                  </Nav.Link>
               </Nav>
            )}
         </div>
      </Navbar>
   );
}
