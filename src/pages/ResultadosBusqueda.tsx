import { Link } from "react-router-dom";
import type { Pelicula } from "../domain/Pelicula";
import { Container, Row } from "react-bootstrap";
import CardPelicula from "../components/peliculas/view/CardPelicula/CardPelicula";
import { useTranslation } from 'react-i18next';

// ARQUITECTURA HEXAGONAL: NO
// TODO COMPLETADO: NO

interface ResultadosBusquedaProps{
    peliculas:Pelicula[],
    textointroducido:string
}

function ResultadosBusqueda({peliculas,textointroducido}:ResultadosBusquedaProps){
    
    const {t,i18n} = useTranslation();
    const lang = i18n.language as 'es' | 'en' | 'eu';

    const resultados = peliculas.filter(peli => {
        const tituloSegunIdioma = peli[lang]?.titulo || peli.es.titulo;
        return tituloSegunIdioma.toLowerCase().includes(textointroducido.toLowerCase());
    });
    
    let contenidoVisual;

    if (resultados.length > 0) {
        contenidoVisual = resultados.map(peli => (
            <CardPelicula key={peli.id} peli={peli} />
        ));
    } else {
        contenidoVisual = (
            <div className="text-center py-5 text-white w-100">
                <p>{t('home_no_results', { busqueda: textointroducido })}</p>
            </div>
        );
    }

    return(
        <>
            <h4 className="text-white mb-4">
                    {t('search_results_for')}: <span className="text-info">{textointroducido}</span>
            </h4>

            <Container>
                <Row className="pt-3">
                    {contenidoVisual}
                </Row>
            </Container>
        </>
    )
}
export default ResultadosBusqueda;