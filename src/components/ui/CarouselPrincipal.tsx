import { useState } from 'react';
import { Carousel, Row, Col, Card, CarouselItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type { Pelicula_destacada,Pelicula } from '../../domain/Pelicula';
import { useTranslation } from 'react-i18next';
import { PropsCarousel } from '../../domain/Pelicula';


// Tratamiento con multiples idiomas = SI
// Arquitectura hexagonal = SI
// Comentarios introducidos = SI


function CarouselPrincipal({ peliculas }: PropsCarousel) {

    // Extramos esto para poder saber el idioma que esta activo
    const{t,i18n} = useTranslation();

    // Para definir el idioma actual (entre los 3 que se muestran ahi)
    const lang = i18n.language as 'es' | 'en' | 'eu';

    // Aqui almacenamos que diapo del carrusel se esta mostrando 
    const [index, setIndex] = useState<number>(0);

    // Para actualizar el indice cuando el usuario cambia manualmente el carousel
    const handleSelect = (selectedIndex: number) => setIndex(selectedIndex);

    // Aqui almacenamos aquellas peliculas que se encuentran entre las favs
    const destacadas = peliculas.filter(p => p.destacada === true);

    // Este es el objeto de estilos que definimos para las tarjetas del carrusel
    const cardStyle: React.CSSProperties = {
        height: "350px",
        backgroundColor: "#1c2b29",
        border: "1px solid rgba(45,157,157,0.2)", // Borde con cierta transicion
        borderRadius: "10px",
        overflow: "hidden",
        color: "white"
    };

    // Vamos a definir lo que es la tarjeta que va a aparecer 
    const renderCard = (peli: Pelicula) => {
        // Seleccion del texto segun el idioma actual 
        const info = peli[lang] || peli['es'];
        return(
            <Col key={peli.id}>
                {/*La carta que definimos */}
                <Card style={cardStyle} className='shadow'>
                    <Row className='h-100 g-0'>
                        {/*La columna de la imagen*/}
                        <Col xs={5}>
                            <Card.Img
                                src={peli.imagen_portada}
                                alt={info.titulo}
                                style={{ height: "350px", objectFit: "cover", borderRadius: "10px 0 0 10px" }}
                            />
                        </Col>
                        {/*Columna con lo que es la info*/}
                        <Col xs={7}>
                            <Card.Body className='d-flex flex-column justify-content-center h-100' style={{ padding: '1.2rem' }}>
                                <Card.Title style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>
                                    {info.titulo}
                                </Card.Title>
                                <Card.Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                                    {info.descripcion}
                                </Card.Text>
                                
                                <Link to={`/pelicula/${peli.id}`} className="btn btn-sm btn-outline-info mt-auto fw-semibold">
                                    {t('view_more')}
                                </Link>
                            </Card.Body>
                        </Col>
                    </Row>
                </Card>
            </Col>
        )
    };

    return (
        <>
            {/* Esto solo para FORMATO MOVIL*/} {/*HECHO*/}
            <Carousel className='d-md-none' indicators={true} touch={true} variant='dark' style={{ paddingBottom: '24px' }}>
                {destacadas.map((pelicula) => (
                    <Carousel.Item key={pelicula.id}> 
                        <Row>
                            {renderCard(pelicula)}
                        </Row>
                    </Carousel.Item>
                ))}
            </Carousel>

            {/* Esto para FORMATO NORMAL*/} {/*HECHO*/}
            <Carousel className='d-none d-md-block' activeIndex={index} onSelect={handleSelect} variant='dark' style={{ paddingBottom: '24px' }}>
                <Carousel.Item>
                    <Row className='px-3 pb-3'>
                        {destacadas.slice(0, 3).map(renderCard)}
                    </Row>
                </Carousel.Item>

                {/* CUANDO HAY MAS DE 3 PELIS */}
                {destacadas.length > 3 && (
                    <Carousel.Item>
                        <Row className='px-3 pb-3'>
                            {destacadas.slice(3, 6).map(renderCard)}
                        </Row>
                    </Carousel.Item>
                )}
            </Carousel>
        </>
    );
}

export default CarouselPrincipal;
