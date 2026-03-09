import './footer.css'
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Footer(){
    return(
        <footer className='footer'>
            <Container>
                <Row>
                    <Col>
                        <h5 className='titulo_footer'>R&A Movies</h5>
                    </Col>
                    <Col>
                        <h5 className='titulo_footer'>Donde estamos</h5> 
                        <div>
                            <p className='donde_estamos text-secondary small'>Campus de Arrosadia</p>
                            <p className='donde_estamos text-secondary small'>31006 Pamplona, Navarra</p>
                            <p className='donde_estamos text-secondary small'>ra_movies@gmail.com</p>
                        </div>
                    </Col>
                    <Col>
                        <h5 className='titulo_footer'>Siguenos</h5>
                        <div>
                            <div><a href='#' className='enlaces_footer text-secondary small'><i className='bi bi-instagram me-2'></i>Instagram</a></div>
                            <div><a href='#' className='enlaces_footer text-secondary small'><i className='bi bi-twitter-x me-2'></i>Twitter</a></div>
                            <div><a href='#' className='enlaces_footer text-secondary small'><i className='bi bi-facebook me-2'></i>Facebook</a></div>
                        </div>
                    </Col>
                    <Col>
                        <h5 className='titulo_footer'>Informacion</h5>
                        <div className='d-flex flex-column'>
                            <Link to='/aviso_legal' className='text-decoration-none text-secondary small'>Aviso Legal</Link>
                            <Link to='/contacto' className='text-decoration-none text-secondary small'>Contacto</Link>
                            <Link to='/privacidad' className='text-decoration-none text-secondary small'>Privacidad</Link>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}
export default Footer;