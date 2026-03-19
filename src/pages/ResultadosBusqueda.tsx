import { Link } from "react-router-dom";
import type { Pelicula } from "../domain/Pelicula";
import { Container, Row } from "react-bootstrap";
import CardPelicula from "../components/peliculas/view/CardPelicula/CardPelicula";

interface ResultadosBusquedaProps{
    peliculas:Pelicula[],
    textointroducido:string
}

function ResultadosBusqueda({peliculas,textointroducido}:ResultadosBusquedaProps){
    const resultados = peliculas.filter(peli => peli.titulo.toLowerCase().includes(textointroducido.toLowerCase()));
    return(
        <Container>
            <Row className="pt-3">
                {resultados.map((peli) => (
                    <CardPelicula key={peli.id} peli={peli}></CardPelicula>
                ))}
            </Row>
        </Container>
    )
}
export default ResultadosBusqueda;