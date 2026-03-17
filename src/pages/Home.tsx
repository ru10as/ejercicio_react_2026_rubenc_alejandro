import CarouselPrincipal from "../components/ui/CarouselPrincipal";
import './home.css';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link } from "react-router-dom";
//import axios from "axios";
import { useContext, useEffect, useState } from "react";
import type { Pelicula } from "../domain/Pelicula";
//import type { FirebasePelicula } from "../domain/Pelicula";
//import type { FirebaseResponse } from "../domain/Pelicula";
//import type { PeliFav } from "../domain/Pelicula";
import { PeliculaRepository } from "../infrastructure/PeliculaRepository";
import AuthContext from "../store/AuthContext";
//import MensajeModal from "../components/ui/MensajeModal";

// Nuevo introducido


function Home(){
    const [categoriaActual, setCategoriaActual] = useState<string>('Todas');
    const categorias: string[] = ['Todas', 'Accion', 'Drama', 'Terror', 'Animacion', 'Fantasia'];
    const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
    const [seccionActiva, setSeccionActiva] = useState<string>('cartelera');
    const [favoritosIds, setFavoritosIds] = useState<number[]>([]);
    const authCtx = useContext(AuthContext);
    const userId = authCtx.userID;
    const token = authCtx.idToken;

    useEffect(() => {   
        PeliculaRepository.getAll().then((data) => {
            setPeliculas(data);
        });

        if (userId && token){
            PeliculaRepository.getFavoritoById(userId,token).then((data) => {
                setFavoritosIds(data);
            })
        }
    }, [userId,token]);

    const peliculasCartelera = peliculas.filter(p => !p.proximamente && p.fecha_estreno.includes('2026'));
    const peliculasProximamente = peliculas.filter(p => p.proximamente);
    const peliculasCatalogo = peliculas.filter(p => !p.proximamente && !p.fecha_estreno.includes('2026'));

    const pelisFiltradas = peliculasCatalogo.filter((peli: Pelicula) => {
        if (categoriaActual === 'Todas') return true;
        return peli.categoria === categoriaActual;
    })

    const renderTarjetasPelicula = (lista: Pelicula[]) => (
        <Row>
            {lista.map((peli) => {
                
                const esFavorita = favoritosIds.includes(peli.id);

                return (
                    <Col key={peli.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                    <div className="card h-100 movie-card border-0 shadow">
                        <div style={{position:"relative"}}>
                            {esFavorita && (
                                <div className="favorito-ribbon">
                                    <i className="bi bi-star-fill"></i>
                                </div>
                            )}
                            <img
                                src={peli.imagen_portada}
                                alt={peli.titulo}
                                style={{ height: '320px', objectFit: 'cover' }}
                            />
                        </div>
                        <div className="card-body d-flex flex-column">
                            <h5>{peli.titulo}</h5>
                            <p className="small mb-3" style={{ color: '#2d9d9d' }}>{peli.categoria}</p>
                            <Link to={`/pelicula/${peli.id}`} className="btn btn-sm btn-outline-info mt-auto fw-semibold">
                                Ver detalles
                            </Link>
                        </div>
                    </div>
                </Col>
                )}
            )}
        </Row>
    )

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
