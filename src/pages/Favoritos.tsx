import { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthContext from "../store/AuthContext";
import { PeliculaRepository } from "../infrastructure/PeliculaRepository";
import type { PeliFav } from "../domain/Pelicula";
import MensajeModal from "../components/ui/MensajeModal";
import { useTranslation } from 'react-i18next';

// ARQUITECTURA HEXAGONAL: CUMPLIDA
// TODO COMPLETADO: SI

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

    //
    const token = authCtx.idToken;
    
    // Para indicar si vamos a mostrar el mensaje de Modal
    const [mostrarModal, setMostrarModal] = useState(false);

    // Para establecer el tipo de titulo en el Modal (segun si hemos añadido comentario, puntuacion, etc..)
    const [tituloModal, setTituloModal] = useState("");

    // Para indicar el tipo de mensaje que aparece en el modal
    const [mensajeModal, setMensajeModal] = useState("");

    // 
    const [tipoModal, setTipoModal] = useState<'success' | 'error'>('success'); 

    //
    const lanzamientoAviso = (titulo:string, mensaje:string, tipo: 'success' | 'error') => {
        setTituloModal(titulo);
        setMensajeModal(mensaje);
        setTipoModal(tipo);
        setMostrarModal(true);
    }
    // ------------------------------------------------------

    // ------------------------------------------------------
    useEffect(() => {
        // 
        const cargarFavoritos = async () => {
            if(userId && token){
                try{
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
    const eliminarFavoritoHandler = async (peliId: string) => {
        if(!userId || !token)return;

        try{
            await PeliculaRepository.deleteFavorito(userId, peliId, token);
            setMisFavs((listaAnterior) => listaAnterior.filter(p => p.id !== peliId));
            lanzamientoAviso(t('fav_removed_title'), t('fav_removed_msg'), "success");
        }
        catch(error:any){
            console.error("Error al eliminar el favorito", error);
            lanzamientoAviso(t('fav_error_delete_title'), t('fav_error_delete_msg'), "error");
        }
    }
    // ------------------------------------------------------
    
    if (!userId) {
        return (
            <Container className="text-center my-5 py-5">
                <h1 className="text-white mb-4 fw-bold">{t('favorites_title_page')}</h1>
                <div className="alert alert-dark border-warning text-white bg-dark p-5 shadow-lg">
                    <h3 className="mb-3">{t('auth_required_title', 'Acceso restringido')}</h3>
                    <p className="mb-4">
                        {t('auth_required_favs_msg', 'Debes iniciar sesión para gestionar tu lista de películas favoritas.')}
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
                                <h5 className="text-center">{peli.titulo}</h5>
                                <Row>
                                    <Col>
                                        <Link to={`/pelicula/${peli.pelicula_id}`}>
                                            <Button variant="primary" className="w-100 btn-sm">
                                                {t('fav_btn_details')}
                                            </Button>
                                        </Link>
                                    </Col>

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