import { Link } from "react-router-dom";
import type { Pelicula } from "../domain/Pelicula";
import { Container, Row } from "react-bootstrap";
import CardPelicula from "../components/peliculas/view/CardPelicula/CardPelicula";
import { useTranslation } from 'react-i18next';
import { PeliculaRepository } from "../infrastructure/PeliculaRepository";
import { ResultadosBusquedaProps } from "../domain/Busqueda";
import { useEffect, useState } from "react";

// ESTRUCTURA HEXAGONAL = SI
// TODO INDICADO CON MENSAJES = SI
// IDIOMAS = SI

function ResultadosBusqueda({peliculas,textointroducido}:ResultadosBusquedaProps){
    
    // Para establecer el sistema de idiomas 
    const {t,i18n} = useTranslation();

    // Para detectar el idioma dentro de esos tres posibles
    const lang = i18n.language as 'es' | 'en' | 'eu';

    // Filtramos segun el titulo comparando con lo introducido por escrito (en el buscador)
    const resultados = peliculas.filter(peli => {
        const tituloSegunIdioma = peli[lang]?.titulo || peli.es.titulo;
        return tituloSegunIdioma.toLowerCase().includes(textointroducido.toLowerCase());
    });

    // Guardamos la lista de ids de los favoritos
    const [idsFavoritos, setIdsFavoritos] = useState<number[]>([]);
    

    // ---------------------------------------------------------------------------------
    // Lo cargamos al inicio
    useEffect(() => {
        const cargarFavoritos = async () => {
            // Recuperamos las credenciales
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');
            
            // Comprobamos que este log (para pasar a tomar sus favoritos)
            if (userId && token) {
                const favs = await PeliculaRepository.getFavoritoById(userId, token);
                setIdsFavoritos(favs);
            }
        };
        cargarFavoritos();
    }, []);
    // ---------------------------------------------------------------------------------
    
    // este contenido de un tipo u otro 
    let contenidoVisual;

    // Si hay resultados (coincidencia de busqueda), vamos a sacar las coincidentes 
    if (resultados.length > 0) {
        contenidoVisual = resultados.map(peli => {
            const esFavorita = idsFavoritos.includes(Number(peli.id));
            return <CardPelicula key={peli.id} peli={peli} isFavorite={esFavorita}/>;
        });
    } // Aqui abajo, indicamos que no ha habido coincidencias en la busqueda 
    else {
        contenidoVisual = (
            <div className="text-center py-5 text-white w-100">
                <p>{t('home_no_results', { busqueda: textointroducido })}</p>
            </div>
        );
    }

    return(
        <>
            {/*Titulo (Resultados de busqueda de: ...*/}
            <h4 className="text-white mb-4">
                    {t('search_results_for')}: <span className="text-info">{textointroducido}</span>
            </h4>

            {/*Aqui donde van a aparecer las imagenes*/}
            <Container>
                <Row className="pt-3">
                    {contenidoVisual}
                </Row>
            </Container>
        </>
    )
}
export default ResultadosBusqueda;