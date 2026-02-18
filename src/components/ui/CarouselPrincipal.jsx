import { useState } from 'react';
import { Carousel, Row, Col, Card, Button } from 'react-bootstrap';

function CarouselPrincipal(){
    const Peliculas_destacadas = [
        {
            id:1,
            titulo:"Cumbres borrascosas",
            imagen:"/portadas_peliculas/cumbres_borroscosas.webp",
            descripcion:"Margot Robbie y Jacob Elordi protagonizan esta salvaje adaptación del clásico de Emily Brontë."
        },
        {
            id:2,
            titulo:"Avengers: Doomsday",
            imagen:"/portadas_peliculas/imagen_avengers_doomsday.jpg",
            descripcion:"El regreso de Robert Downey Jr. al UCM como el temible Doctor Doom. El destino del multiverso está en juego."
        },
        {
            id:3,
            titulo:"Peaky Blinders: The inmortal man",
            imagen:"/portadas_peliculas/peaky_blinders_the_immortal_man.jpg",
            descripcion:"Tommy Shelby vuelve para un último capítulo épico en la gran pantalla. Por orden de los Peaky Blinders."
        },
        {
            id:4,
            titulo:"Greenland 2",
            imagen:"/portadas_peliculas/imagen_greenland_2.jpg",
            descripcion:"La familia Garrity debe abandonar la seguridad del búnker para enfrentarse a un mundo congelado y hostil."
        },
        {
            id:5,
            titulo:"Crime 101",
            imagen:"/portadas_peliculas/imagen_crime_101.jpg",
            descripcion:"Un thriller de robos de alto voltaje con Chris Hemsworth y Mark Ruffalo en un duelo de ingenio."
        }
    ]

    const [index,setIndex] = useState(0);
    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    }

    return(

    <Carousel activeIndex={index} onSelect={handleSelect}>
        <Carousel.Item>
            <Row>
                {Peliculas_destacadas.slice(0,3).map((pelicula) => (
                    <Col key={pelicula.id}>
                        <Card className='shadow-sm' style={{height:"350px"}}>
                            <Row>
                                <Col>
                                    <Card.Img className='img-fluid' src={pelicula.imagen} alt={pelicula.titulo} style={{height:"350px", width:"230px"}}/>
                                </Col>
                                <Col>
                                    <Card.Body>
                                        <Card.Title>{pelicula.titulo}</Card.Title>
                                        <Card.Text>{pelicula.descripcion}</Card.Text>
                                        <Button variant='primary'>Ver mas</Button>
                                    </Card.Body>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                ))}
                
            </Row>
        </Carousel.Item>

        <Carousel.Item>
            <Row>
                {Peliculas_destacadas.slice(3,6).map((pelicula) => (
                    <Col key={pelicula.id}>
                        <Card className='shadow-sm' style={{height:"400px"}}>
                            <Row>
                                <Col>
                                    <Card.Img className='img-fluid' src={pelicula.imagen} alt={pelicula.titulo} style={{height:"350px", width:"230px"}}/>
                                </Col>
                                <Col>
                                    <Card.Body>
                                        <Card.Title>{pelicula.titulo}</Card.Title>
                                        <Card.Text>{pelicula.descripcion}</Card.Text>
                                        <Button variant='primary'>Ver mas</Button>
                                    </Card.Body>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                ))}
                
            </Row>
        </Carousel.Item>
    </Carousel>
  );
}

export default CarouselPrincipal;