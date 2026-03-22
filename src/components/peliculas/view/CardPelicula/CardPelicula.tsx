import { Col } from "react-bootstrap";
import type { Pelicula } from "../../../../domain/Pelicula";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import './cardpelicula.css';
import { CardPeliculaprops } from "../../../../domain/Pelicula";

// Tratamiento con multiples idiomas = SI
// Arquitectura hexagonal = SI
// Comentarios introducidos = SI


function CardPelicula({ peli, isFavorite }: CardPeliculaprops) {
    
    // Introducimos esto para el idioma 
    const { t, i18n } = useTranslation();

    // Obtenemos loq es el idioma actual (alguna de estas 3)
    const lang = i18n.language as 'es' | 'en' | 'eu';

    // Si no hay leng, lo ponemos en castellano 
    const datosIntroducidos = peli[lang] || peli['es'];

    return (
        <Col xs={12} sm={6} md={4} lg={3} className="mb-4 netflix-col">
            <div className="netflix-card" style={{ position: 'relative' }}>
                
                {/* TRIANGULO DE ARRIBA PARA LOS FAVORITOS */}
                {isFavorite && (
                    <div className="favorito-ribbon">
                        <i className="bi bi-star-fill"></i>
                    </div>
                )}

                {/* Lo que es la imagen que aparece */}
                <img
                    src={peli.imagen_portada}
                    alt={datosIntroducidos.titulo}
                    className="netflix-card-img"
                />
                
                {/* Para mostrar lo que es el nombre de la peli y genero y asi */}
                <div className="netflix-title-bar">
                    <h5 className="netflix-title-bar-text">{datosIntroducidos.titulo}</h5>
                    <span className="netflix-title-bar-cat">{datosIntroducidos.categoria}</span>
                </div>

                {/* Lo que va a aparece cunado ponemos el raton por encima */}
                <div className="netflix-hover-overlay">
                    <div className="netflix-overlay-content">
                        <h5 className="netflix-overlay-title">{datosIntroducidos.titulo}</h5>
                        <p className="netflix-overlay-desc">
                            {datosIntroducidos.descripcion?.substring(0, 100)}...
                        </p>
                        <div className="netflix-overlay-meta">
                            <span>⭐ {peli.calificacion_media}/10</span>
                        </div>
                        <Link to={`/pelicula/${peli.id}`} className="netflix-btn-detalles">
                            {t('view_details')} →
                        </Link>
                    </div>
                </div>
            </div>
        </Col>
    );
}
export default CardPelicula;