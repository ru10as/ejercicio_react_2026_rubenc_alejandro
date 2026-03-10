import CarouselPrincipal from "../components/ui/CarouselPrincipal";
import './home.css';
import { Container, Row, Col, Button, Nav } from 'react-bootstrap';
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

interface Pelicula {
    id: number; // Vamos a cambiar este id de number a string   
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

    // Probando
    const [peliculas, setPeliculas] = useState<Pelicula[]>([])
    const [seccionActiva, setSeccionActiva] = useState<string>('cartelera')

    // ---------------------------------------------------------------------------------------------------------
    useEffect(() => {
        axios.get<FirebaseResponse>("https://pelis-react-upna-ru-al-default-rtdb.europe-west1.firebasedatabase.app/.json")
        .then((response) => {
            const data = response.data;
            if (data && data.peliculas) {
                const peliculasArray: Pelicula[] = Object.entries(data.peliculas).map(
                ([key, value]) => ({ // Key con el nombre del nodo en firebase (1,2, etc) y value con toda la info de la peli
                id: Number(key),
                ...value
                })
                );
                // setPeliculas(peliculasArray);

                const peliculasValidas = peliculasArray.filter(peli => peli.titulo !== undefined); // Vamos a hacer esto para evitar problemas de indices
                setPeliculas(peliculasValidas);
            }else{
                setPeliculas([]);
            }
        })
        .catch((error) => 
        console.log("Error al obtener los datos",error))
    }, [])
    // ----------------------------------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------------------------------
    const peliculasCartelera = peliculas.filter(p => !p.proximamente && p.fecha_estreno.includes('2026'));
    const peliculasProximamente = peliculas.filter(p => p.proximamente);
    const peliculasCatalogo = peliculas.filter(p => !p.proximamente && !p.fecha_estreno.includes('2026'));
    // ----------------------------------------------------------------------------------------------------------


    // ------------------------------------------------------------------
    const pelisFiltradas = peliculasCatalogo.filter((peli: Pelicula) => {
        if (categoriaActual === 'Todas'){
            return true;
        }
        return peli.categoria === categoriaActual;
    })
    // ------------------------------------------------------------------

    

    return(
        <div>
            <main style={{backgroundColor:"#171616ff", minHeight:"100vh"}}>
                <div className="py-4 bg-dark text-white text-center">
                    <h1 className='text-center my-5 fw-bold text-uppercase' style={{ color: '#409f9f' }}>
                        Principales Carteleras
                    </h1>
                    <CarouselPrincipal />
                </div>

                <Container className="my-5" style={{backgroundColor:"#3e6e65", color:"white"}}>
                    
                    <section className="text-center">
                        <h3 className="pt-3 pb-3">Conjunto de peliculas</h3>
                        <Container>
                            <Nav variant="tabs" activeKey={seccionActiva} onSelect={(k) => setSeccionActiva(k)}>
                            <Nav.Item>
                                <Nav.Link eventKey="cartelera">Cartelera</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="proximamente">Proximamente</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="cat_completo">Catalogo completo</Nav.Link>
                            </Nav.Item>
                            </Nav>
                            {/* <Row>
                                <Col>
                                    <Button onClick={() => setSeccionActiva('cartelera')}>Cartelera</Button>
                                </Col>

                                <Col>
                                    <Button onClick={() => setSeccionActiva('proximamente')}>Proximamente</Button>
                                </Col>

                                <Col>
                                    <Button onClick={() => setSeccionActiva('cat_completo')}>Catalogo completo</Button>
                                </Col>
                            </Row> */}
                        </Container>
                    </section>

                    <Container>
                        {seccionActiva === 'cartelera' && (
                            <>
                                <section className="text-center">
                                    <h3 className="pt-3 pb-3">Cartelera</h3>
                                    <Row>
                                       {peliculasCartelera.map((peli) => (
                                            <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
                                                <div className="card h-100 bg-secundary border-0 shadow">
                                                    <img src={peli.imagen_portada} alt={peli.titulo} style={{ height: '350px', objectFit: 'cover' }}>
                                                    </img>
                                                    <div className="card-body d-flex flex-column">
                                                        <h5 className="">{peli.titulo}</h5>
                                                        <p className="small mb-2 text-info">{peli.categoria}</p>
                                                        <Link to={`/pelicula/${peli.id}`}>
                                                            <Button>
                                                                Ver detalles
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </Col>
                                        ))} 
                                    </Row>
                                </section>
                            </>
                        )}

                        {seccionActiva === 'proximamente' && (
                            <>
                                <section className="text-center">
                                    <h3 className="pt-3 pb-3">Proximas peliculas</h3>
                                    <Row>
                                        {peliculasProximamente.map((peli) => (
                                            <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
                                                <div className="card h-100 bg-secundary border-0 shadow">
                                                    <img src={peli.imagen_portada} alt={peli.titulo} style={{ height: '350px', objectFit: 'cover' }}>
                                                    </img>
                                                    <div className="card-body d-flex flex-column">
                                                        <h5 className="">{peli.titulo}</h5>
                                                        <p className="small mb-2 text-info">{peli.categoria}</p>
                                                        <Link to={`/pelicula/${peli.id}`}>
                                                            <Button>
                                                                Ver detalles
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </Col>
                                        ))} 
                                    </Row>
                                </section>
                            </>
                        )}

                        {seccionActiva === 'cat_completo' && (
                            <>
                            <section className="mt-3 text-center">
                                <h3 className="pt-3 pb-3">Conjunto completo de peliculas</h3>
                                
                                <div className="d-flex flex-wrap gap-2 justify-content-center">
                                    {categorias.map(cat => (
                                        <Button className="rounded-fill shadow-sm" style={{backgroundColor:"#86ca9bff",border: "2px solid #86ca9b"}} key={cat} onClick={()=>setCategoriaActual(cat)}>{cat}</Button>
                                    )
                                    )}
                                </div>
                            
                            </section>

                            <section className="pb-5">
                                <h3 style={{margin:"20px"}} className="text-center">Peliculas de {categoriaActual}</h3>
                                <Row>
                                    {pelisFiltradas.map((peli) => (
                                        <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
                                            <div className="card h-100 bg-secundary border-0 shadow">
                                                <img src={peli.imagen_portada} alt={peli.titulo} style={{ height: '350px', objectFit: 'cover' }}>
                                                </img>
                                                <div className="card-body d-flex flex-column">
                                                    <h5 className="">{peli.titulo}</h5>
                                                    <p className="small mb-2 text-info">{peli.categoria}</p>
                                                    <Link to={`/pelicula/${peli.id}`}>
                                                        <Button>
                                                            Ver detalles
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
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