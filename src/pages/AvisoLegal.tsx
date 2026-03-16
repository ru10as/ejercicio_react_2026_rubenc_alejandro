import { Container, Row, Col } from 'react-bootstrap';

// Nuevo introducido

function AvisoLegal() {
    return (
        <Container>
            <Row>
                <Col>
                    <h1 className='mb-4 text-dark mt-4'>Aviso Legal</h1>

                    <section className='mb-4'>
                        <h3 className='text-uppercase fw-bold text-secondary'>1. Datos Identificativos</h3>
                        <p>
                            Este sitio web es un proyecto academico desarrollado por los estudiantes Ruben Cameo y Alejandro Guerra. El portal ha sido creado con fines exclusivamente educativos para la asignatura de desarrollo web.
                        </p>
                    </section>
                    

                    <section className='mb-4'>
                        <h3 className='text-uppercase fw-bold text-secondary'>2. Propiedad Intelactual</h3>
                        <p>
                            Todo el contenido visual (carteles de peliculas, trailers y sinopsis) es propiedad de sus respectivos autores y productoras cinematograficas. 
                            Su uso en esta plataforma se realiza bajo el concepto de uso legitimo con fines docentes. 
                        </p>
                    </section>

                    <section className='mb-4'>
                        <h3 className='text-uppercase fw-bold text-secondary'>3. Contenido Multimedia</h3>
                        <p>
                            Los autores no se hacen responsables de la exactitud de los datos proporcionados por servicios externos, ni la disponibilidad 
                            continua del servicio, al tratarse de un entorno de pruebas. 
                        </p>
                    </section>

                    <section>

                    </section>
                </Col>
            </Row>
        </Container>
    );
}

export default AvisoLegal;