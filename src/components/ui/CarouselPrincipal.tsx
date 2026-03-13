import { useState } from 'react';
import { Carousel, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface PeliculaFirebase {
    id: number;
    titulo: string;
    [key: string]: any;
}

interface Props {
    peliculas: PeliculaFirebase[];
}

interface Pelicula_destacada {
    titulo: string;
    imagen: string;
    descripcion: string;
}

const PELICULAS_DESTACADAS: Pelicula_destacada[] = [
    {
        titulo: "Cumbres borrascosas",
        imagen: "/portadas_peliculas/cumbres_borroscosas.webp",
        descripcion: "Margot Robbie y Jacob Elordi protagonizan esta salvaje adaptación del clásico de Emily Brontë."
    },
    {
        titulo: "Avengers: Doomsday",
        imagen: "/portadas_peliculas/imagen_avengers_doomsday.jpg",
        descripcion: "El regreso de Robert Downey Jr. al UCM como el temible Doctor Doom. El destino del multiverso está en juego."
    },
    {
        titulo: "Peaky Blinders: The inmortal man",
        imagen: "/portadas_peliculas/peaky_blinders_the_immortal_man.jpg",
        descripcion: "Tommy Shelby vuelve para un último capítulo épico en la gran pantalla. Por orden de los Peaky Blinders."
    },
    {
        titulo: "Greenland 2",
        imagen: "/portadas_peliculas/imagen_greenland_2.jpg",
        descripcion: "La familia Garrity debe abandonar la seguridad del búnker para enfrentarse a un mundo congelado y hostil."
    },
    {
        titulo: "Crime 101",
        imagen: "/portadas_peliculas/imagen_crime_101.jpg",
        descripcion: "Un thriller de robos de alto voltaje con Chris Hemsworth y Mark Ruffalo en un duelo de ingenio."
    }
];

function CarouselPrincipal({ peliculas }: Props) {
    const [index, setIndex] = useState<number>(0);
    const handleSelect = (selectedIndex: number) => setIndex(selectedIndex);

    // Cruza cada película destacada con su ID real en Firebase por nombre de archivo de imagen
    const getFilename = (path: string) => path.split('/').pop()?.split('.')[0] ?? '';
    const destacadasConId = PELICULAS_DESTACADAS.map(dest => {
        const match = peliculas.find(
            p => getFilename(p.imagen_portada) === getFilename(dest.imagen)
        );
        return { ...dest, id: match?.id ?? null };
    });

    const cardStyle: React.CSSProperties = {
        height: "350px",
        backgroundColor: "#1c2b29",
        border: "1px solid rgba(45,157,157,0.2)",
        borderRadius: "10px",
        overflow: "hidden",
        color: "white"
    };


    const renderCard = (pelicula: typeof destacadasConId[0]) => (
        <Col key={pelicula.titulo}>
            <Card style={cardStyle} className='shadow'>
                <Row className='h-100 g-0'>
                    <Col xs={5}>
                        <Card.Img
                            src={pelicula.imagen}
                            alt={pelicula.titulo}
                            style={{ height: "350px", objectFit: "cover", borderRadius: "10px 0 0 10px" }}
                        />
                    </Col>
                    <Col xs={7}>
                        <Card.Body className='d-flex flex-column justify-content-center h-100' style={{ padding: '1.2rem' }}>
                            <Card.Title style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>{pelicula.titulo}</Card.Title>
                            <Card.Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', lineHeight: '1.5' }}>{pelicula.descripcion}</Card.Text>
                            {pelicula.id !== null
                                ? <Link to={`/pelicula/${pelicula.id}`} className="btn btn-sm btn-outline-info mt-auto fw-semibold">Ver más</Link>
                                : <span className="btn btn-sm btn-outline-info mt-auto fw-semibold disabled opacity-50">Ver más</span>
                            }
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </Col>
    );

    return (
        <Carousel activeIndex={index} onSelect={handleSelect} variant='dark' style={{ paddingBottom: '24px' }}>
            <Carousel.Item>
                <Row className='px-3 pb-3'>
                    {destacadasConId.slice(0, 3).map(renderCard)}
                </Row>
            </Carousel.Item>
            <Carousel.Item>
                <Row className='px-3 pb-3'>
                    {destacadasConId.slice(3, 6).map(renderCard)}
                </Row>
            </Carousel.Item>
        </Carousel>
    );
}

export default CarouselPrincipal;
