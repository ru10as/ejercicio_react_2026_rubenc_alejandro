import CarouselPrincipal from "../components/ui/CarouselPrincipal";
import './home.css';
import '../components/peliculas/view/home.css';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import CardPelicula from "../components/peliculas/view/CardPelicula/CardPelicula";
import type { Pelicula } from "../domain/Pelicula";
import type { FirebasePelicula } from "../domain/Pelicula";
import type { FirebaseResponse } from "../domain/Pelicula";
import ResultadosBusqueda from "./ResultadosBusqueda";

/* interface Pelicula {
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
} */

/* interface FirebasePelicula {
  [key: string]: Omit<Pelicula, "id">;
} */

/* interface FirebaseResponse {
  peliculas: FirebasePelicula;
} */

interface HomeProps{
    textobuscado:string;
}

function Home({textobuscado}:HomeProps){
    // 
    const [categoriaActual, setCategoriaActual] = useState<string>('Todas');

    //
    const categorias: string[] = ['Todas', 'Accion', 'Drama', 'Terror', 'Animacion', 'Fantasia'];

    //
    const [peliculas, setPeliculas] = useState<Pelicula[]>([]);

    //
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


    let contenido;

    //
    const peliculasCartelera = peliculas.filter(p => !p.proximamente && p.fecha_estreno.includes('2026'));

    //
    const peliculasProximamente = peliculas.filter(p => p.proximamente);

    //
    const peliculasCatalogo = peliculas.filter(p => !p.proximamente && !p.fecha_estreno.includes('2026'));

    //
    const pelisFiltradas = peliculasCatalogo.filter((peli: Pelicula) => {
        if (categoriaActual === 'Todas') return true;
        return peli.categoria === categoriaActual;
    })

    //
    const renderTarjetasPelicula = (lista: Pelicula[]) => (
        <Row>
            {lista.map((peli) => (
                <CardPelicula peli={peli} key={peli.id}>

                </CardPelicula>
            ))}
        </Row>
    );

    if (textobuscado.length > 0){
        contenido = (
            <ResultadosBusqueda peliculas={peliculas} textointroducido={textobuscado}>
            </ResultadosBusqueda>
        );
    }
    else{
        contenido = (
            <>
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
            </>
        );
    }

    return(
        <div>
            <main style={{backgroundColor:"#171616ff", minHeight:"100vh"}}>
                {contenido}
            </main>
        </div>
    )
}
export default Home;
