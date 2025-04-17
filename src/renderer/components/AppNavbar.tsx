import React, { useContext } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import logo from "./../../hellthrower.png";
import { LoadoutContext } from "../pages/LoadoutContext.tsx";

const AppNavbar = () => {
    const loadoutContext = useContext(LoadoutContext);
    if (loadoutContext === undefined) return <p>Something went wrong!</p>;

    let loadoutNavs: any[] = [];

    if (loadoutContext.loadouts !== undefined) {
        loadoutNavs = loadoutContext.loadouts.map((el) => {
            return (
                <LinkContainer key={el.id} to={`/loadout/${el.id}`}>
                    <NavDropdown.Item>
                        {el.name}
                    </NavDropdown.Item>
                </LinkContainer>
            );
        });
    }
    if (loadoutNavs.length != 0) {
        loadoutNavs.push(
            (
                <NavDropdown.Divider key="divider" />
            ),
        );
    }

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand>
                    <img src={logo} height={40}></img>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <LinkContainer to="/activate">
                            <Nav.Link>Activate</Nav.Link>
                        </LinkContainer>
                        <NavDropdown title="Loadouts" id="nav-dropdown">
                            {loadoutNavs}
                            <LinkContainer to="/loadout/new">
                                <NavDropdown.Item>
                                    New loadout
                                </NavDropdown.Item>
                            </LinkContainer>
                        </NavDropdown>
                        <LinkContainer to="/stratagems">
                            <Nav.Link>Stratagems</Nav.Link>
                        </LinkContainer>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;
