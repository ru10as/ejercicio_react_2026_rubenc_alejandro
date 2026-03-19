import CarouselPrincipal from "../components/ui/CarouselPrincipal";
import './home.css';
import '../components/peliculas/view/home.css';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

interface Pelicula {
    id: number;
    titulo:string,
    categoria:string,
    taquilla:number,
    video_local:string,
    pais_origen:string,
    mercados?: any[],
    imagen_portada:string,
    imagen_en_pelicula:string,
    calificacion_media:number,
    descripcion:string,
    comentarios?: any[],
    proximamente: boolean;
    fecha_estreno:string
}

interface FirebasePelicula {
  [key: string]: Omit<Pelicula, "id">;
}

interface FirebaseResponse {
  peliculas: FirebasePelicula;
}

function Home(){
    const [categoriaActual, setCategoriaActual] = useState<string>('Todas');
    const categorias: string[] = ['Todas', 'Accion', 'Drama', 'Terror', 'Animacion', 'Fantasia'];

    const [peliculas, setPeliculas] = useState<Pelicula[]>([])
    const [seccionActiva, setSeccionActiva] = useState<string>('cartelera')

    useEffect(() => {
        axios.get<FirebaseResponse>("https://pelis-react-upna-ru-al-default-rtdb.europe-west1.firebasedatabase.app/.json")
        .then((response) => {
            const data = response.data;
            if (data && data.peliculas) {
                const peliculasArray: Pelicula[] = Object.entries(data.peliculas).map(
                ([key, value]) => ({
                id: Number(key),
                ...value
                })
                );
                const peliculasValidas = peliculasArray.filter(peli => peli.titulo !== undefined);
                setPeliculas(peliculasValidas);
            }else{
                setPeliculas([]);
            }
        })
        .catch((error) =>
        console.log("Error al obtener los datos",error))
    }, [])

    const peliculasCartelera = peliculas.filter(p => !p.proximamente && p.fecha_estreno.includes('2026'));
    const peliculasProximamente = peliculas.filter(p => p.proximamente);
    const peliculasCatalogo = peliculas.filter(p => !p.proximamente && !p.fecha_estreno.includes('2026'));

    const pelisFiltradas = peliculasCatalogo.filter((peli: Pelicula) => {
        if (categoriaActual === 'Todas') return true;
        return peli.categoria === categoriaActual;
    })

    const renderTarjetasPelicula = (lista: Pelicula[]) => (
        <Row>
            {lista.map((peli) => (
                <Col key={peli.id} xs={12} sm={6} md={4} lg={3} className="mb-4 netflix-col">
                    <div className="netflix-card">
                        <img
                            src={peli.imagen_portada}
                            alt={peli.titulo}
                            className="netflix-card-img"
                        />
                        <div className="netflix-title-bar">
                            <h5 className="netflix-title-bar-text">{peli.titulo}</h5>
                            <span className="netflix-title-bar-cat">{peli.categoria}</span>
                        </div>
                        <div className="netflix-hover-overlay">
                            <div className="netflix-overlay-content">
                                <h5 className="netflix-overlay-title">{peli.titulo}</h5>
                                <span className="netflix-overlay-cat">{peli.categoria}</span>
                                <p className="netflix-overlay-desc">
                                    {peli.descripcion
                                        ? peli.descripcion.substring(0, 130) + (peli.descripcion.length > 130 ? '...' : '')
                                        : 'Sin descripción disponible.'}
                                </p>
                                <div className="netflix-overlay-meta">
                                    <span>⭐ {peli.calificacion_media}/10</span>
                                    <span>{peli.pais_origen}</span>
                                </div>
                                <Link to={`/pelicula/${peli.id}`} className="netflix-btn-detalles">
                                    Ver detalles →
                                </Link>
                            </div>
                        </div>
                    </div>
                </Col>
            ))}
        </Row>
    );

    return(
        <div>
            <main style={{backgroundColor:"#171616ff", minHeight:"100vh"}}>
                <div className="py-4 bg-dark text-white text-center">
                    <h1 className='text-center my-5 fw-bold seccion-titulo'>
                        Principales Carteleras
                    </h1>
                    <CarouselPrincipal peliculas={peliculas} />
                </div>

                <Container className="my-5 py-4 px-4 seccion-peliculas" style={{ color: "white" }}>

                    <section className="text-center mb-3">
                        <h3 className="pt-2 pb-3" style={{ color: 'white', fontWeight: 700 }}>Conjunto de películas</h3>
                        <Nav
                            variant="tabs"
                            activeKey={seccionActiva}
                            onSelect={(k) => setSeccionActiva(k!)}
                            className="nav-tabs-custom justify-content-center"
                        >
                            <Nav.Item>
                                <Nav.Link eventKey="cartelera">Cartelera</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="proximamente">Próximamente</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="cat_completo">Catálogo completo</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </section>

                    <Container>
                        {seccionActiva === 'cartelera' && (
                            <section className="text-center">
                                <h3 className="pt-3 pb-3">Cartelera</h3>
                                {renderTarjetasPelicula(peliculasCartelera)}
                            </section>
                        )}

                        {seccionActiva === 'proximamente' && (
                            <section className="text-center">
                                <h3 className="pt-3 pb-3">Próximas películas</h3>
                                {renderTarjetasPelicula(peliculasProximamente)}
                            </section>
                        )}

                        {seccionActiva === 'cat_completo' && (
                            <>
                                <section className="mt-3 text-center">
                                    <h3 className="pt-3 pb-3">Catálogo completo</h3>
                                    <div className="d-flex flex-wrap gap-2 justify-content-center mb-4">
                                        {categorias.map(cat => (
                                            <button
                                                key={cat}
                                                className={`btn-categoria ${categoriaActual === cat ? 'activo' : ''}`}
                                                onClick={() => setCategoriaActual(cat)}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                <section className="pb-5">
                                    <h3 style={{ margin: "20px" }} className="text-center">Películas de {categoriaActual}</h3>
                                    {renderTarjetasPelicula(pelisFiltradas)}
                                </section>
                            </>
                        )}
                    </Container>
                </Container>
            </main>
        </div>
    )
}
export default Home;
