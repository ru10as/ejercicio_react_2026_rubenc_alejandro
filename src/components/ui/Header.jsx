import './header.css'
import { Button, Container, Nav, Navbar, NavbarBrand, NavbarCollapse, NavbarToggle } from 'react-bootstrap';
import { Link } from "react-router-dom";

function Header(){
    return (
        <>
            <Navbar style={{ background: "#2d9d9d", padding: "12px 0", border:"2px solid black"}}>
                <Container>
                    <NavbarBrand href='#home'>
                        <i className='bi bi-film text-warning me-2'></i>
                        R&A Movies</NavbarBrand>
                    <NavbarToggle />
                    <NavbarCollapse>
                        <Nav className='ms-auto'>
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/contacto">Contacto</Nav.Link>
                            <Nav.Link as={Link} to="/favoritos">Favoritos</Nav.Link>

                            <Nav className=''>
                                <Button as={Link} to="/login" className='formato_login_registro'>Login</Button>
                                <Button as={Link} to="/registro" className='formato_login_registro'>Registrarse</Button>
                            </Nav>
                        </Nav>
                    </NavbarCollapse>
                </Container>
            </Navbar>
        </>
    )
}
export default Header;