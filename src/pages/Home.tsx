import CarouselPrincipal from "../components/ui/CarouselPrincipal";
import './home.css';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import type { Pelicula } from "../domain/Pelicula";
import { PeliculaRepository } from "../infrastructure/PeliculaRepository";
import AuthContext from "../store/AuthContext";



function Home(){ 
    // Aqui lo que vamos a guardar es la categoria de la pelicula con la que estemos tratando (por defecto estableceremos la categoria de TODAS)
    const [categoriaActual, setCategoriaActual] = useState<string>('Todas');     

    // definimos el conjunto de posibles categorias que puede haber (array con strings)
    const categorias: string[] = ['Todas', 'Accion', 'Drama', 'Terror', 'Animacion', 'Fantasia'];

    // Aqui es donde vamos a almacenar todas las peliculas disponibles en este instante
    const [peliculas, setPeliculas] = useState<Pelicula[]>([]);

    // Aqui es donde vamos a guardar el campo que haya seleccionado el usuario (de los de abajo )
    const [seccionActiva, setSeccionActiva] = useState<string>('cartelera');

    // Aqui es donde vamos a almacenar el conjunto de peliculas favoritas pero indicadas por su id
    const [favoritosIds, setFavoritosIds] = useState<number[]>([]);

    //tomamos el contexto actual global
    const authCtx = useContext(AuthContext);

    // de este contexto, tomamos el userId (identificativo de dicho usuario)
    const userId = authCtx.userID;

    // Tomamos el token de dicho usuario
    const token = authCtx.idToken;

    useEffect(() => { // En este caso vamos a controlar que suece cuando se modifica o el userId o el token (por tanto, el usuario)
        PeliculaRepository.getAll().then((data) => {    // Primero tomamos todas las pelis con el getAll 
            setPeliculas(data);                         // Las almacenamos en peliculas
        });

        if (userId && token){// En el caso de que haya un usuario dentro (de los registrados vaya)
            PeliculaRepository.getFavoritoById(userId,token).then((data) => {   // Tomamos sus peliculas favoritas y las guardamos
                setFavoritosIds(data);
            })
        }
    }, [userId,token]);

    // Filtramos las peliculas quedandonos con las que ya han salido pero que han salido hace poco (en el 2026)
    const peliculasCartelera = peliculas.filter(p => !p.proximamente && p.fecha_estreno.includes('2026'));

    // Aqui nos quedamos con las pelis que aun no han salido pero que van a salir proximamente
    const peliculasProximamente = peliculas.filter(p => p.proximamente);

    // Aqui basicamente nos quedamos con las pelis que no son ni proximas ni muy recientes
    const peliculasCatalogo = peliculas.filter(p => !p.proximamente && !p.fecha_estreno.includes('2026'));

    // Aqui vamos a filtrar dentro del conjunto de peliculas del catalogo, por la subcategoria por asi decir
    const pelisFiltradas = peliculasCatalogo.filter((peli: Pelicula) => {   // Pillamos el conjunto de peliculas 
        if (categoriaActual === 'Todas') return true;                       // Si la categoria es todas, permitimos el paso
        return peli.categoria === categoriaActual;                          // Y sino, mostramos solo las que pertenezcan a dicha categoria
    })

    const renderTarjetasPelicula = (lista: Pelicula[]) => (
        <Row>
            {lista.map((peli) => { 
                // Esto lo vamos a hacer para luego poder aplicar el indicativo de que es favorita (la estrellita con el triangulo verde) 
                const esFavorita = favoritosIds.includes(peli.id); 
                
                return (
                    <Col key={peli.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                        <div className="card h-100 movie-card border-0 shadow" style={{width:'100%', alignItems:'center'}}>
                            <div style={{position:"relative",height:'420px',}}>
                                {esFavorita && (
                                    <div className="favorito-ribbon">
                                        <i className="bi bi-star-fill"></i>
                                    </div>
                                )}
                                <img
                                    src={peli.imagen_portada}
                                    alt={peli.titulo} 
                                    style={{ height: '400px', objectFit: 'cover', width:'250px', display:'block'}}
                                />
                            </div>
                            <div className="card-body d-flex flex-column">
                                <h5>{peli.titulo}</h5>
                                <p className="small mb-3 text-center" style={{ color: '#2d9d9d' }}>{peli.categoria}</p>
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
