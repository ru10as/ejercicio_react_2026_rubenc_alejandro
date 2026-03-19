import { Row,Col } from "react-bootstrap";
import type { Pelicula } from "../../../../domain/Pelicula";
import { Link } from "react-router-dom";

interface CardPeliculaprops {
    peli: Pelicula; // Hay q pasar obligatoriamente una peli (Hay q seguir el formato de Pelicula)
}

function CardPelicula({peli}:CardPeliculaprops){
    return (
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
    );
}
export default CardPelicula;

