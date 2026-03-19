import './topPeliculas.css';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Pelicula {
    id: number;
    titulo: string;
    categoria: string;
    taquilla: number;
    video_local: string;
    pais_origen: string;
    mercados?: any[];
    imagen_portada: string;
    imagen_en_pelicula: string;
    calificacion_media: number;
    descripcion: string;
    comentarios?: any[];
    proximamente: boolean;
    fecha_estreno: string;
}

interface FirebasePelicula {
    [key: string]: Omit<Pelicula, 'id'>;
}

interface FirebaseResponse {
    peliculas: FirebasePelicula;
}

const MEDALLAS = ['🥇', '🥈', '🥉'];
const MEDAL_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];

function TopPeliculas() {
    const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
    const [filtro, setFiltro] = useState<number>(10);

    useEffect(() => {
        axios.get<FirebaseResponse>("https://pelis-react-upna-ru-al-default-rtdb.europe-west1.firebasedatabase.app/.json")
            .then((response) => {
                const data = response.data;
                if (data && data.peliculas) {
                    const arr: Pelicula[] = Object.entries(data.peliculas).map(([key, value]) => ({
                        id: Number(key),
                        ...value
                    }));
                    const validas = arr.filter(p => p.titulo !== undefined && !p.proximamente);
                    const ordenadas = validas.sort((a, b) => b.calificacion_media - a.calificacion_media);
                    setPeliculas(ordenadas);
                }
            })
            .catch(err => console.log('Error al cargar películas:', err));
    }, []);

    const peliculasMostradas = filtro === 0 ? peliculas : peliculas.slice(0, filtro);
    const top3 = peliculasMostradas.slice(0, 3);
    const resto = peliculasMostradas.slice(3);

    return (
        <main className="top-page">
            <Container className="py-5">

                {/* Cabecera */}
                <div className="top-page-header text-center mb-5">
                    <h1 className="top-page-title">
                        Top Películas
                    </h1>
                    <p className="top-page-subtitle">Las películas mejor valoradas por nuestra comunidad</p>

                    <div className="d-flex gap-2 justify-content-center mt-4">
                        {[5, 10, 0].map(n => (
                            <button
                                key={n}
                                className={`btn-top-filtro ${filtro === n ? 'activo' : ''}`}
                                onClick={() => setFiltro(n)}
                            >
                                {n === 0 ? 'Todas' : `Top ${n}`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Podio top 3 */}
                {top3.length > 0 && (
                    <section className="mb-5">
                        <Row className="justify-content-center g-4">
                            {top3.map((peli, idx) => (
                                <Col key={peli.id} xs={12} sm={6} md={4}>
                                    <div
                                        className="top3-card"
                                        style={{ '--medal-color': MEDAL_COLORS[idx] } as React.CSSProperties}
                                    >
                                        <div className="top3-rank-badge">{MEDALLAS[idx]}</div>
                                        <div className="top3-img-wrapper">
                                            <img src={peli.imagen_portada} alt={peli.titulo} className="top3-img" />
                                        </div>
                                        <div className="top3-info">
                                            <h4 className="top3-titulo">{peli.titulo}</h4>
                                            <span className="top3-cat">{peli.categoria}</span>
                                            <div className="top3-rating">
                                                <span className="top3-rating-num">{peli.calificacion_media}</span>
                                                <span className="top3-rating-max">/10</span>
                                            </div>
                                            <p className="top3-desc">
                                                {peli.descripcion
                                                    ? peli.descripcion.substring(0, 110) + (peli.descripcion.length > 110 ? '...' : '')
                                                    : 'Sin descripción disponible.'}
                                            </p>
                                            <Link to={`/pelicula/${peli.id}`} className="btn-top-detalles">
                                                Ver detalles →
                                            </Link>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </section>
                )}

                {/* Lista del resto */}
                {resto.length > 0 && (
                    <section className="top-lista">
                        {resto.map((peli, idx) => (
                            <div key={peli.id} className="top-lista-item">
                                <span className="top-lista-rank">#{idx + 4}</span>
                                <img src={peli.imagen_portada} alt={peli.titulo} className="top-lista-img" />
                                <div className="top-lista-info">
                                    <h5 className="top-lista-titulo">{peli.titulo}</h5>
                                    <span className="top-lista-cat">{peli.categoria}</span>
                                </div>
                                <div className="top-lista-rating">
                                    <span className="top-lista-rating-num">{peli.calificacion_media}</span>
                                    <span className="top-lista-rating-max">/10</span>
                                </div>
                                <Link to={`/pelicula/${peli.id}`} className="btn-top-lista-detalles">
                                    Ver →
                                </Link>
                            </div>
                        ))}
                    </section>
                )}

            </Container>
        </main>
    );
}

export default TopPeliculas;
