import './header.css'
import { Button, Container, Nav, Navbar, NavbarBrand, NavbarCollapse, NavbarToggle } from 'react-bootstrap';
import { Link,useNavigate } from "react-router-dom";
import AuthContext from '../../store/AuthContext';
import { useContext } from 'react';
import Desplegable_user from './Desplegable_user';

function Header(){
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();
    let contenidoDerecha;


    if (!authCtx.login){
        contenidoDerecha = (
            <>
                <Link to="/login">
                    <Button className='formato_login_registro'>Login</Button>
                </Link>
                <Link to="/registro">
                    <Button className='formato_login_registro'>Registrarse</Button>
                </Link> 
            </>
        )
    }
    else{
        contenidoDerecha = (
            <>
                
                    
                <Desplegable_user></Desplegable_user>
                
                {/* <Button
                    variant='danger' 
                    className='fw-bold' 
                    onClick={() => {
                        authCtx.logoutAction();
                        navigate('/');
                    }}>
                    Cerrar sesion
                </Button> */}
            </>
        )
    }

    return (
        <>
            <Navbar style={{ background: "#2d9d9d", padding: "12px 0", border:"2px solid black"}}>
                <Container>
                    <NavbarBrand as={Link} to="/">
                        <i className='bi bi-film text-warning me-2'></i>
                        R&A Movies</NavbarBrand>
                    <NavbarToggle />
                    <NavbarCollapse>
                        <Nav className='ms-auto'>
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/contacto">Contacto</Nav.Link>
                            
                            {authCtx.login && (
                                <Nav.Link as={Link} to="/favoritos">Favoritos</Nav.Link>
                            )}

                            <Nav className=''>
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