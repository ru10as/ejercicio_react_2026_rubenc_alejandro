import './footer.css'
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Footer(){
    return(
        <footer className='footer'>
            <Container>
                <Row className='text-start gy-4'>
                    <Col xs={12} sm={6} md={3}>
                        <h5 className='titulo_footer'>
                            <i className='bi bi-film me-2'></i>R&A Movies
                        </h5>
                        <p className='donde_estamos small'>Tu cine, a cualquier hora.</p>
                    </Col>
                    <Col xs={12} sm={6} md={3}>
                        <h5 className='titulo_footer'>Dónde estamos</h5>
                        <p className='donde_estamos small'>Campus de Arrosadia</p>
                        <p className='donde_estamos small'>31006 Pamplona, Navarra</p>
                        <p className='donde_estamos small'>ra_movies@gmail.com</p>
                    </Col>
                    <Col xs={12} sm={6} md={3}>
                        <h5 className='titulo_footer'>Síguenos</h5>
                        <div>
                            <div><a href='#' className='enlaces_footer small'><i className='bi bi-instagram me-2'></i>Instagram</a></div>
                            <div><a href='#' className='enlaces_footer small'><i className='bi bi-twitter-x me-2'></i>Twitter</a></div>
                            <div><a href='#' className='enlaces_footer small'><i className='bi bi-facebook me-2'></i>Facebook</a></div>
                        </div>
                    </Col>
                    <Col xs={12} sm={6} md={3}>
                        <h5 className='titulo_footer'>Información</h5>
                        <div className='d-flex flex-column'>
                            <Link to='/aviso_legal' className='enlaces_footer small'>Aviso Legal</Link>
                            <Link to='/contacto' className='enlaces_footer small'>Contacto</Link>
                            <Link to='/privacidad' className='enlaces_footer small'>Privacidad</Link>
                        </div>
                    </Col>
                </Row>
                <p className='footer-copy text-center'>© 2026 R&A Movies. Todos los derechos reservados.</p>
            </Container>
        </footer>
    )
}
export default Footer;
