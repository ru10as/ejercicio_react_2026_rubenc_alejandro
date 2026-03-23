import { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthContext from "../store/AuthContext";
import { PeliculaRepository } from "../infrastructure/PeliculaRepository";
import type { PeliFav } from "../domain/Pelicula";
import MensajeModal from "../components/ui/MensajeModal";
import { useTranslation } from 'react-i18next';

// ESTRUCTURA HEXAGONAL = SI
// TODO INDICADO CON MENSAJES = SI
// IDIOMAS = SI

// ------------------------------------------------------------------------
function Favoritos(){
    // ------------------------------------------------------ 
    const {t} = useTranslation();
    // Definimos donde vamos a guardar el conjunto de Peliculas favoritas del usuario
    const [misFavs, setMisFavs] = useState<PeliFav[]>([]); 

    // Almacenamos la informacion que se ha obtenido una vez el usuario ha introducido
    const authCtx = useContext(AuthContext);

    // Extraemos el codigo unico del usuario
    const userId = authCtx.userID;

    // Otenemos el token
    const token = authCtx.idToken;
    
    // Para indicar si vamos a mostrar el mensaje de Modal
    const [mostrarModal, setMostrarModal] = useState(false);

    // Para establecer el tipo de titulo en el Modal (segun si hemos añadido comentario, puntuacion, etc..)
    const [tituloModal, setTituloModal] = useState("");

    // Para indicar el tipo de mensaje que aparece en el modal
    const [mensajeModal, setMensajeModal] = useState("");

    // Para indicar el tipo de modal
    const [tipoModal, setTipoModal] = useState<'success' | 'error'>('success'); 

    // Todo lo que se debe establecer al mandar el aviso
    const lanzamientoAviso = (titulo:string, mensaje:string, tipo: 'success' | 'error') => {
        setTituloModal(titulo);
        setMensajeModal(mensaje);
        setTipoModal(tipo);
        setMostrarModal(true);
    }
    // ------------------------------------------------------


    // ------------------------------------------------------
    // Aqui lo que vamos a hacer es dispararlo cuando iniciamos o al cambiar las credenciales
    useEffect(() => {
        // Cargamos de forma asicrona las favoritas
        const cargarFavoritos = async () => {

            // Comprobamos que este log
            if(userId && token){
                try{
                    // Tomamos el conjunto de favs
                    const lista = await PeliculaRepository.getFavoritos(userId,token);
                    setMisFavs(lista);    
                }
                catch (err){
                    lanzamientoAviso(t('fav_error_load_title'), t('fav_error_load_msg'), "error");
                }
            }
        };

        cargarFavoritos();

    },[userId,token]);
    // ------------------------------------------------------


    // ------------------------------------------------------
    // Aqui lo que vamos es a tratar la posibilidad de eliminar de los favoritos
    const eliminarFavoritoHandler = async (peliId: string) => {
        // Si no hay sesion activa, fuera
        if(!userId || !token)return;

        try{
            // La funcion la hemos definido en la parte de infrastructure
            await PeliculaRepository.deleteFavorito(userId, peliId, token);

            // Filtramos la lista anterior para quedarnos con la que no es la que hemos eliminado
            setMisFavs((listaAnterior) => listaAnterior.filter(p => p.id !== peliId));

            // lanzamos aviso
            lanzamientoAviso(t('fav_removed_title'), t('fav_removed_msg'), "success");
        }
        catch(error:any){
            console.error("Error al eliminar el favorito", error);
            lanzamientoAviso(t('fav_error_delete_title'), t('fav_error_delete_msg'), "error");
        }
    }

    // Si no detectamos el id de usuario, le indicamos que el acceso es restringido
    if (!userId) {
        return (
            <Container className="text-center my-5 py-5">
                <h1 className="text-white mb-4 fw-bold">{t('favorites_title_page')}</h1>
                <div className="alert alert-dark border-warning text-white bg-dark p-5 shadow-lg">
                    <h3 className="mb-3">{t('auth_required_title', 'Acceso restringido')}</h3>
                    <p className="mb-4">
                        {t('auth_required_favs_msg', 'Debes iniciar sesion para gestionar tu lista de peliculas favoritas.')}
                    </p>
                    <Link to="/login">
                        <Button variant="primary" size="lg" className="px-5 shadow">
                            {t('nav_login', 'Iniciar Sesion')}
                        </Button>
                    </Link>
                </div>
            </Container>
        );
    }


    return (
        <Container>
            <h1 className="text-white mb-0 fw-bold text-center my-5 mb-5">{t('favorites_title_page')}</h1>
            
            {/*Las columnas donde vamos a ir metiendo los favoritos*/}
            <Row>
                {misFavs.map((peli) => (
                    
                    <Col xs={12} sm={6} md={4} lg={3} className="mb-4">{/* Podemos ver aqui el formato para el movil */}
                        {/* Aqui la tarjeta para la peli*/}
                        <div className="card h-100 bg-secundary border-0 shadow">
                            {/* Lo que es la imagen */}
                            <img 
                                src={peli.imagen_portada} 
                                alt={peli.titulo} 
                                style={{ height: '350px', objectFit: 'cover' }}>
                            </img>

                            {/*Para lo que son las dos acciones*/}
                            <div className="card-body d-flex flex-column">
                                <h5 className="text-center">{peli.titulo}</h5>
                                <Row>
                                    {/*El enlace para ver mas info de la peli*/}
                                    <Col>
                                        <Link to={`/pelicula/${peli.pelicula_id}`}>
                                            <Button variant="primary" className="w-100 btn-sm">
                                                {t('fav_btn_details')}
                                            </Button>
                                        </Link>
                                    </Col>

                                    {/*Para poder borrar de favoritos*/}
                                    <Col>
                                        <Button variant="outline-danger" size="sm" onClick={() => eliminarFavoritoHandler(peli.id)}>
                                            {t('fav_btn_remove')}
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