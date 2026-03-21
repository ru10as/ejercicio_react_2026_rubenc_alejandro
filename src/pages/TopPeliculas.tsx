import './topPeliculas.css';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import type { Pelicula } from '../domain/Pelicula';
import type { FirebasePelicula } from '../domain/Pelicula';
import type { FirebaseResponse } from '../domain/Pelicula';
import { PeliculaRepository } from '../infrastructure/PeliculaRepository';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

// ARQUITECTURA HEXAGONAL: SI
// TODO COMPLETADO: NO

// Hemos tomado simplemente simbolos de oro, plata y bronce 
const MEDALLAS = ['🥇', '🥈', '🥉'];

//Colores asociados
const MEDAL_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];

function TopPeliculas() {
    
    const {t,i18n} = useTranslation();
    const idiomaActual = i18n.language as 'es' | 'en' | 'eu';

    // Aqui es donde vamos a guardar las peliculas ya rankeadas por la nota
    const [peliculasRankeadas, setPeliculasRankeadas] = useState<Pelicula[]>([]); 

    // Aqui es donde guardaremos cuantas peliculas vamos a querer ver
    const [filtro, setFiltro] = useState<number>(10);

    useEffect(() => {
        // Hacemos la llamada generada en el Infrastructure
        PeliculaRepository.getTopRanking()
        .then((datos) => setPeliculasRankeadas(datos)); // La establecemos en peliculasRankeadas
    }, []);

    // Aqui es donde vamos a amplicar el filtro segun lo que se haya pulsado
    const peliculasMostradas = filtro === 0 ? peliculasRankeadas : peliculasRankeadas.slice(0, filtro);

    // Extraemos las tres primeras porque vamos a querer mostrar una especie de podio
    const top3 = peliculasMostradas.slice(0, 3);

    // Resto de pelicualas fuera del top
    const resto = peliculasMostradas.slice(3);

    return (
        <main className="top-page">
            <Container className="py-5">

                {/* Cabecera */}
                <div className="top-page-header text-center mb-5">
                    <h1 className="top-page-title">
                        {t('top_title')}
                    </h1>
                    <p className="top-page-subtitle">{t('top_subtitle')}</p>

                    <div className="d-flex gap-2 justify-content-center mt-4">
                        {[5, 10, 0].map(n => (
                            <button
                                key={n}
                                className={`btn-top-filtro ${filtro === n ? 'activo' : ''}`}
                                onClick={() => setFiltro(n)}
                            >
                                {n === 0 ? t('cat_todas') : `Top ${n}`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Podio top 3 */}
                {top3.length > 0 && (
                    <section className="mb-5">
                        <Row className="justify-content-center g-4">
                            {top3.map((peli, idx) => {
                                const info = peli[idiomaActual] ?? peli.es ?? peli.en ?? peli.eu;
                                return (
                                <Col key={peli.id} xs={12} sm={6} md={4}>
                                    <div
                                        className="top3-card"
                                        style={{ '--medal-color': MEDAL_COLORS[idx] } as React.CSSProperties}>
                                        <div className="top3-rank-badge">{MEDALLAS[idx]}</div>
                                        <div className="top3-img-wrapper">
                                            <img src={peli.imagen_portada} alt={info?.titulo} className="top3-img" />
                                        </div>
                                        <div className="top3-info">
                                            <h4 className="top3-titulo">{info?.titulo}</h4>
                                            <span className="top3-cat">{info?.categoria}</span>
                                            <div className="top3-rating">
                                                <span className="top3-rating-num">{peli.calificacion_media}</span>
                                                <span className="top3-rating-max">/10</span>
                                            </div>
                                            <p className="top3-desc">
                                                {info?.descripcion
                                                    ? info.descripcion.substring(0, 110) + (info.descripcion.length > 110 ? '...' : '')
                                                    : t('top_no_desc')}
                                            </p>
                                            <Link to={`/pelicula/${peli.id}`} className="btn-top-detalles">
                                                {t('top_view_short')} →
                                            </Link>
                                        </div>
                                    </div>
                                </Col>
                                );
                            })}
                        </Row>
                    </section>
                )}

                {/* Lista del resto */}
                {resto.length > 0 && (
                    <section className="top-lista">
                        {resto.map((peli, idx) => {
                            const info = peli[idiomaActual] ?? peli.es ?? peli.en ?? peli.eu;
                            return (
                            <div key={peli.id} className="top-lista-item">
                                <span className="top-lista-rank">#{idx + 4}</span>
                                <img src={peli.imagen_portada} alt={info?.titulo} className="top-lista-img" />
                                <div className="top-lista-info">
                                    <h5 className="top-lista-titulo">{info?.titulo}</h5>
                                    <span className="top-lista-cat">{info?.categoria}</span>
                                </div>
                                <div className="top-lista-rating">
                                    <span className="top-lista-rating-num">{peli.calificacion_media}</span>
                                    <span className="top-lista-rating-max">/10</span>
                                </div>
                                <Link to={`/pelicula/${peli.id}`} className="btn-top-lista-detalles">
                                    {t('top_view_short')} →
                                </Link>
                            </div>
                            );
                        })}
                    </section>
                )}

            </Container>
        </main>
    );
}

export default TopPeliculas;
