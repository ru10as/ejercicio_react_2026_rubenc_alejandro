import './header.css'
import { Container, Nav, Navbar, NavbarBrand, NavbarCollapse, NavbarToggle } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import AuthContext from '../../store/AuthContext';
import { useContext } from 'react';

function Header(){
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();
    let contenidoDerecha;

    if (!authCtx.login){
        contenidoDerecha = (
            <>
                <Link to="/login" className='btn btn-sm btn-outline-info fw-semibold mx-1'>Login</Link>
                <Link to="/registro" className='btn btn-sm btn-outline-info fw-semibold mx-1'>Registrarse</Link>
            </>
        )
    }
    else{
        contenidoDerecha = (
            <button
                className='btn btn-sm btn-outline-danger fw-semibold mx-1'
                onClick={() => {
                    authCtx.logoutAction();
                    navigate('/');
                }}>
                Cerrar sesión
            </button>
        )
    }

    return (
        <>
            <Navbar className="header-nav" sticky="top" style={{ padding: "10px 0" }}>
                <Container>
                    <NavbarBrand as={Link} to="/" className="brand-name">
                        <i className='bi bi-film me-2' style={{ color: '#2d9d9d' }}></i>
                        R&A Movies
                    </NavbarBrand>
                    <NavbarToggle aria-controls="main-nav" style={{ borderColor: '#2d9d9d' }} />
                    <NavbarCollapse id="main-nav">
                        <Nav className='ms-auto align-items-center'>
                            <Nav.Link as={Link} to="/" className="nav-link-custom">Home</Nav.Link>
                            <Nav.Link as={Link} to="/contacto" className="nav-link-custom">Contacto</Nav.Link>
                            <Nav.Link as={Link} to="/top-peliculas" className="nav-link-custom">Top</Nav.Link>
                            {authCtx.login && (
                                <Nav.Link as={Link} to="/favoritos" className="nav-link-custom">Favoritos</Nav.Link>
                            )}
                            <Nav className='ms-2'>
                                {contenidoDerecha}
                            </Nav>
                        </Nav>
                    </NavbarCollapse>
                </Container>
            </Navbar>
        </>
    )
}
export default Header;
