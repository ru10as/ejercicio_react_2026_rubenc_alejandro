import { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../../store/AuthContext";
import { PeliculaRepository } from "../infrastructure/PeliculaRepository";
import { PeliFav } from "../domain/Pelicula";
import MensajeModal from "../../ui/MensajeModal";

// ------------------------------------------------------------------------
function Favoritos(){

    // ------------------------------------------------------
    const [misFavs, setMisFavs] = useState<PeliFav[]>([]);  // Definimos donde vamos a guardar el conjunto de Peliculas favoritas del usuario
    const authCtx = useContext(AuthContext);                // Almacenamos la informacion que se ha obtenido una vez el usuario ha introducido
    const userId = authCtx.userID;                          // Extraemos el codigo unico del usuario
    const token = authCtx.idToken;                          // 
    
    const [mostrarModal, setMostrarModal] = useState(false);                    // Para indicar si vamos a mostrar el mensaje de Modal
    const [tituloModal, setTituloModal] = useState("");                         // Para establecer el tipo de titulo en el Modal (segun si hemos añadido comentario, puntuacion, etc..)
    const [mensajeModal, setMensajeModal] = useState("");                       // Para indicar el tipo de mensaje que aparece en el modal
    const [tipoModal, setTipoModal] = useState<'success' | 'error'>('success'); // 
    const lanzamientoAviso = (titulo:string, mensaje:string, tipo: 'success' | 'error') => {
        setTituloModal(titulo);
        setMensajeModal(mensaje);
        setTipoModal(tipo);
        setMostrarModal(true);
    }
    // ------------------------------------------------------

    // ----------------------------------------------------------------------------------------------------------------
    
    useEffect(() => {
        const cargarFavoritos = async () => {
            if(userId && token){
                try{
                    const lista = await PeliculaRepository.getFavoritos(userId,token);
                    setMisFavs(lista);    
                }
                catch (err){
                    lanzamientoAviso("Error de carga","No pudimos cargar tus favoritos","success")
                }
            }
        };

        cargarFavoritos();

    },[userId,token]);



    const eliminarFavoritoHandler = async (peliId: string) => {
        if(!userId || !token)return;

        try{
            await PeliculaRepository.deleteFavorito(userId, peliId, token);
            setMisFavs((listaAnterior) => listaAnterior.filter(p => p.id !== peliId));
            lanzamientoAviso("Pelicula eliminada","Pelicula eliminada de tus favoritas","success");
        }
        catch(error:any){
            console.error("Error al eliminar el favorito", error);
            //alert("No se ha podido eliminar la pelicula de los favoritos"); // Para pruebas
            lanzamientoAviso("Error","No se ha podido eliminar la pelicula","success");
        }
    }
    
    return (
        <Container>
            <h1 className="text-white mb-4">Mis Favoritos</h1>
            
            <Row>
                {misFavs.map((peli) => (
                    <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
                        <div className="card h-100 bg-secundary border-0 shadow">
                            <img 
                                src={peli.imagen_portada} 
                                alt={peli.titulo} 
                                style={{ height: '350px', objectFit: 'cover' }}>
                            </img>
                            <div className="card-body d-flex flex-column">
                                <h5 className="">{peli.titulo}</h5>
                                <p className="small mb-2 text-info">{peli.categoria}</p>
                                <Row>
                                    <Col>
                                        <Link to={`/pelicula/${peli.id}`}>
                                            <Button>
                                                Ver detalles
                                            </Button>
                                        </Link>
                                    </Col>

                                    <Col>
                                        <Button variant="outline-danger" size="sm" onClick={() => eliminarFavoritoHandler(peli.id)}>
                                            Eliminar de favoritos
                                        </Button>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
            <MensajeModal 
                show={mostrarModal}
                onHide={() => setMostrarModal(false)}
                titulo={tituloModal}
                mensaje={mensajeModal}
                tipo={tipoModal}
            />
        </Container>
    )
}
export default Favoritos;