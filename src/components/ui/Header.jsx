import './header.css'
import { Nav } from 'react-bootstrap';
import { Link } from "react-router-dom";

function Header(){
    return (
        <>
            <h1 className='formato_titulo'>R&A Movies</h1>
            <Nav activeKey="/" style={{padding:"10px", height:"60px", backgroundColor:"rgba(31, 108, 108, 1)"}}>
                <Nav.Item className="color_opciones">
                    <Nav.Link href="/home">
                        <i className='bi bi-film text-warning'></i>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/home" className='color_opciones'>
                        Home
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-1" className='color_opciones'>
                        Home
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="Contacto" className='color_opciones'>
                        Contacto
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="aviso_legal" className='color_opciones'>
                        Aviso legal
                    </Nav.Link>
                </Nav.Item>
            </Nav>
        </>

    )
}
export default Header;