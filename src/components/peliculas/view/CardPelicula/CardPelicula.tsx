import { Row,Col } from "react-bootstrap";
import type { Pelicula } from "../../../../domain/Pelicula";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import i18next from "i18next";

interface CardPeliculaprops {
    peli: Pelicula; // Hay q pasar obligatoriamente una peli (Hay q seguir el formato de Pelicula)
}

function CardPelicula({peli}:CardPeliculaprops){

    const {t,i18n} = useTranslation();
    const lang = i18n.language as 'es' | 'en' | 'eu'; // Lo que vamos a obtener aqui es el idioma que se ha elegido
    const datosIntroducidos = peli[lang] || peli['es']; // Si hay algun problema, se pondra en castellano


    return (
        <Col key={peli.id} xs={12} sm={6} md={4} lg={3} className="mb-4 netflix-col">
            <div className="netflix-card">
                <img
                    src={peli.imagen_portada}
                    alt={datosIntroducidos.titulo}
                    className="netflix-card-img"
                />
                <div className="netflix-title-bar">
                    <h5 className="netflix-title-bar-text">{datosIntroducidos.titulo}</h5>
                    <span className="netflix-title-bar-cat">{datosIntroducidos.categoria}</span>
                </div>
                <div className="netflix-hover-overlay">
                    <div className="netflix-overlay-content">
                        <h5 className="netflix-overlay-title">{datosIntroducidos.titulo}</h5>
                        <span className="netflix-overlay-cat">{datosIntroducidos.categoria}</span>
                        <p className="netflix-overlay-desc">
                            {datosIntroducidos.descripcion
                                ? datosIntroducidos.descripcion.substring(0, 130) + (datosIntroducidos.descripcion.length > 130 ? '...' : '')
                                : t('no_description')}
                        </p>
                        <div className="netflix-overlay-meta">
                            <span>⭐ {(peli.calificacion_media / 2).toFixed(1)}/5</span>
                            <span>{peli.pais_origen}</span>
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

