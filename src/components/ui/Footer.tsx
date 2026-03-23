import { useTransition } from 'react';
import './footer.css'
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Tratamiento con multiples idiomas = SI
// Arquitectura hexagonal = SI
// Comentarios introducidos = SI

function Footer(){

    const {t} = useTranslation();

    return(
        <footer className='footer'>
            {/* El contenido principal para centrar el contenido */}
            <Container>

                {/* Creamos la fila principal donde meteremos las 3 columnas */}
                <Row className='text-start gy-4'>

                    {/* La primera de las columnas */}
                    <Col xs={12} sm={6} md={3}>
                        <h5 className='titulo_footer'>
                            <i className='bi bi-film me-2'></i>R&A Movies
                        </h5>
                        <p className='donde_estamos small'>{t('footer_slogan')}</p>
                    </Col>

                    {/* Segunda de las columnas */}
                    <Col xs={12} sm={6} md={3}>
                        <h5 className='titulo_footer'>{t('footer_location_title')}</h5>
                        <p className='donde_estamos small'>Campus de Arrosadia</p>
                        <p className='donde_estamos small'>31006 Pamplona, Navarra</p>
                        <p className='donde_estamos small'>ra_movies@gmail.com</p>
                    </Col>

                    {/* Tercera de las columnas */}
                    <Col xs={12} sm={6} md={3}>
                        <h5 className='titulo_footer'>Síguenos</h5>
                        <div>
                            <div><a href='#' className='enlaces_footer small'><i className='bi bi-instagram me-2'></i>Instagram</a></div>
                            <div><a href='#' className='enlaces_footer small'><i className='bi bi-twitter-x me-2'></i>Twitter</a></div>
                            <div><a href='#' className='enlaces_footer small'><i className='bi bi-facebook me-2'></i>Facebook</a></div>
                        </div>
                    </Col>

                    {/* */}
                    <Col xs={12} sm={6} md={3}>
                        <h5 className='titulo_footer'>{t('titulo_informacion')}</h5>
                        <div className='d-flex flex-column'>
                            <Link to='/aviso_legal' className='enlaces_footer small'>{t('footer_legal')}</Link>
                            <Link to='/contacto' className='enlaces_footer small'>{t('footer_contact')}</Link>
                            <Link to='/privacidad' className='enlaces_footer small'>{t('footer_privacy')}</Link>
                        </div>
                    </Col>
                </Row>

                {/* */}
                <p className='footer-copy text-center'>© 2026 R&A Movies. {t('footer_rights')}</p>
            </Container>
        </footer>
    )
}
export default Footer;
