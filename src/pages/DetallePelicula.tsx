import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Badge, Form } from 'react-bootstrap';

import AuthContext from '../store/AuthContext';
import './detallepelicula.css';
import { renderEstrellas } from '../utils/uiHelpers';
import type { Pelicula } from '../domain/Pelicula';
import { PeliculaRepository } from '../infrastructure/PeliculaRepository';
import MensajeModal from '../components/ui/MensajeModal';
import ModoCine from '../components/peliculas/view/ModoCine/ModoCine';
import { useTranslation } from 'react-i18next';

// ARQUITECTURA HEXAGONAL: CUMPLIDA
// TODO COMPLETADO: SI

// --- COMPONENTE PRINCIPAL ---
function DetallePelicula() {
    
    // ------------------------------------------------------------------
    // Esto para gestionar las traducciones
    const {t} = useTranslation();

    // Aqui extraemos el id de la url que estmamos poniendo
    const { id } = useParams<{ id: string }>();
    
    // Tomamos el contexto del usuario que se encuentra dentro en este momento
    const authCtx = useContext(AuthContext);
    
    // Aqui vamos a guardar el objeto completo de la pelicula
    const [peli, setPeli] = useState<Pelicula | null>(null);
    
    // Aqui guardamos el comentario de texto que puede escribir el usuario
    const [comentarioTexto, setComentarioTexto] = useState("");
    
    // Aqui guardamos todos los comentarios sobre esta peli que han hecho los usuarios
    const [listaComentarios, setListaComentarios] = useState<any>(null)
    
    // Vamos a guardar la nota a la pelicula que le da el usuario
    const [notaSeleccionada, setNotaSeleccionada] = useState(5);
    
    // Media final que vamos a calcular con el conjunto de notas
    const [mediaPeli, setMediaPeli] = useState<number>(0);
    
    // Aqui es donde vamos a transformar lo que es la lista de comentarios a array adecuado
    const arrayDeComentarios = listaComentarios ? Object.values(listaComentarios) : [];

    // Vamos a recorrer ahora el conjunto de comentarios de dicha peli y vamos a comprobar si este usuario ha realizado o no un comentario
    const [yaHasComentado, setYaHasComentado] = useState(false);

    // Para indicar si la pelicula que estamos viendo es o no es favorita
    const [esFavorita, setEsFavorita] = useState(false);

    // Para indicar si el usuario ha entrado en modo cine (se va a poner a ver la peli)
    const [modoCine, setModoCine] = useState(false);

    // Vamos a comprobar si este usuario que esta dentro ya ha puntuado (No dejamos puntuar dos veces a la misma peli)
    const [yaHasPuntuado, setYaHasPuntuado] = useState(false);
    
    // Para indicar si vamos a mostrar el mensaje de Modal
    const [mostrarModal, setMostrarModal] = useState(false);
    
    // Para establecer el tipo de titulo en el Modal (segun si hemos añadido comentario, puntuacion, etc..)
    const [tituloModal, setTituloModal] = useState("");
    
    // Para indicar el tipo de mensaje que aparece en el modal
    const [mensajeModal, setMensajeModal] = useState("");
    
    // Para indicar el tipo de modal, si es success o si es de tipo error
    const [tipoModal, setTipoModal] = useState<'success' | 'error'>('success');
    
    // Para cuando lancemos el aviso 
    const lanzamientoAviso = (titulo:string, mensaje:string, tipo: 'success' | 'error') => {
        setTituloModal(titulo);
        setMensajeModal(mensaje);
        setTipoModal(tipo);
        setMostrarModal(true);
    }
    // --------------------------------------------------------------

    

    // --------------------------------------------------------------
    const cargarDatosIniciales = async () => {
        // Si no hemos podido tomar la id de la peli, nos salimos
        if (!id) return;

        // Aqui vamos a hacer las 4 peticiones a la vez
        const resultados = await Promise.all([
            // Esta funcion lo que devuelve es los datos propios de la peli identificada por su id
            PeliculaRepository.getById(id),
            // Esta funcion lo que devuelve es el conjunto de comentarios que los usuarios han escrito sobre la peli con ese id
            PeliculaRepository.getComentarios(id),
            // Esta funcion lo que devuelve es el conjunto de puntuaciones de esta peli identificada por su id
            PeliculaRepository.getPuntuaciones(id),
            // Usamos el async para esperar a la llamada a la base de datos
            (async () => {
                // Revisamos si el usuario esta logueado
                if (authCtx.userID && authCtx.idToken){ 
                    // Tomamos la pelicula fav por su ID
                    return await PeliculaRepository.getFavoritoById(authCtx.userID,authCtx.idToken);
                }
                return [];
            })()
        ])

        setPeli(resultados[0]);             // Guardamos la pelicula
        setListaComentarios(resultados[1]); // Guardamos la lista de comentarios
        procesarPuntuaciones(resultados[2]);// Guardamos el conjunto de puntuaciones devueltas
        const listaIdsFavoritos = resultados[3]; // Almacenamos el conjunto de numeros de ids asociadas a las pelic favs

        // Esto de aqui para comprobar si la peli con la que estamos es una favorita para dicho usuario
        if(listaIdsFavoritos.includes(Number(id))){
            setEsFavorita(true);
        }
        else{
            setEsFavorita(false);
        }
    }
    // --------------------------------------------------------------


    // --------------------------------------------------------------
    // Esta funcion la vamos a implementar para sacar la nota media (estrellas) y ver si el usuario voto para no dejarle votar de nuevo
    const procesarPuntuaciones = (data: any[]) => {
        // Comprobamos si es el caso en que no hay aun votacion de nadie (para ponerle media de 0)
        if (!data || data.length === 0) {
            setMediaPeli(0);
            return;
        }

        // Aqui es donde hacemos el proceso para tomar la suma total (previa a hacer el promedio)
        let suma = 0;
        for (let i = 0; i < data.length; i++) {
            suma = suma + Number(data[i].nota);
        }

        // Hacemos el promediado
        const promedio = (suma / data.length).toFixed(1);
        setMediaPeli(Number(promedio));

        // Si el usuario esta logueado, buscamos si este ya ha puntuado
        if (authCtx.userID) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].usuario_id === authCtx.userID) {
                    setYaHasPuntuado(true);
                    break;
                }
            }
        }
    };
    // --------------------------------------------------------------


    // --------------------------------------------------------------------------------
    // Aqui es donde vamos a enviar el comentario desde que lo escribe hasta la base de datos
    const enviarComentario = async () => {
        
        if (yaHasComentado || !comentarioTexto.trim()) {
            return;
        }

        const nuevoComentario = {               // Definimos el nuevo comentario que va a introducir este usuario
            pelicula_id:peli?.id,               // Vamos a vincular el comentario a esta pelicula
            texto:comentarioTexto,              // Almacenamos el comentario de texto
            usuario_id:authCtx.userID,          // Almacenamos con el comentario el usuario id que esta ahora dentro
            nombre_usuario: authCtx.userName || "Usuario",
            fecha:new Date().toLocaleString()   // Guardamos el momento en el que lo ha escrito 
        }

        // Empleamos la funcion generada para guardar el comentario en Firebase (esta en la carpeta de infrastructure)
        await PeliculaRepository.saveComentario(nuevoComentario);
        

        // Sacamos lo que es el aviso indicandole que se ha almacenado correctamente
        lanzamientoAviso(t('movie_detail_modal_comm_title'), t('movie_detail_modal_comm_msg'), "success");
        
        // Obtenemos la lista actualizada con el nuevo comentario del usuario
        const nuevosComentarios = await PeliculaRepository.getComentarios(id!);

        // Lo establecemos en el conjunto de comentarios
        setListaComentarios(nuevosComentarios);

        // Limpiamos la parte de la caja de comentarios
        setComentarioTexto("");
    };
    // --------------------------------------------------------------------------------



    // --------------------------------------------------------------------------------
    // Esta funcino la vamos a utilizar para almacenar la puntuacion que envie el usuario
    const enviarNota = async () => {
        
        // Para el caso de que el usuario este ya haya puntuado o q la pelicula no haya cargado, salimos
        if (!peli || yaHasPuntuado){
            return
        }
        
        // Creamos el paquete para la nueva puntuacion que se va a introducir
        const nuevaPuntuacion = {
            pelicula_id:peli?.id,       // El id de la peli
            nota:notaSeleccionada,      // La nota seleccionada
            usuario_id:authCtx.userID,  // el id de dicho usuario
        }

        // Utilizamos la funcion generada en infrastructure para guardar la puntuacion
        await PeliculaRepository.savePuntuacion(nuevaPuntuacion);

        // Enviamos el mensaje indicando que se ha guardado la puntuacion
        lanzamientoAviso(t('movie_detail_modal_rate_title'), t('movie_detail_modal_rate_msg'), "success");

        // Almacenamos que ya ha puntuado dicho usuario
        setYaHasPuntuado(true);

        // Cargamos de nuevo los datos para actualizar
        cargarDatosIniciales();
    }
    // --------------------------------------------------------------------------------



    // --------------------------------------------------------------------------------
    // Generamos la funcion para añadir a favoritos
    const añadirAfavoritos = async () => {
        
        // Generamos el paquete para añadir dicha peli en favoritas
        const nuevoFavorito = {
            pelicula_id: Number(id),              
            usuario_id:authCtx.userID,          
            titulo: peli?.titulo,                
            imagen_portada:peli?.imagen_portada, 
            categoria:peli?.categoria       

        }

        // Utilizamos la funcion generada en infrastructure para guardar en los favoritos de dicho usuario
        await PeliculaRepository.saveFavoritos(authCtx.userID!, nuevoFavorito);
        
        // Indicamos que esta peli esta entre los favoritos
        setEsFavorita(true);

        // Lanzamos el mensaje
        lanzamientoAviso(t('movie_detail_modal_fav_title'), t('movie_detail_modal_fav_msg'), "success");
    }
    // --------------------------------------------------------------------------------
    

    // -----------------------------------------
    useEffect(() => {

        if (!listaComentarios || !authCtx.userID) return;

        const comentariosArray = Object.values(listaComentarios);

        const haComentado = comentariosArray.some((comentario: any) => {
            return comentario.usuario_id === authCtx.userID;
        });

        setYaHasComentado(haComentado);

    }, [listaComentarios, authCtx.userID]);
    // -----------------------------------------


    // --------------------------------------------------------------------------------
    useEffect(() => {
        // Primero ponemos en el recargo la pelicula a null para que se vea lo de Cargando...
        setPeli(null);

        // Si no esta el id por lo que sea, detenemos la ejecucion
        if(!id)return;

        // Cargamos los detalles mediante las 4 funciones
        cargarDatosIniciales();
    },[id, authCtx.login]); // Esto se volvera a ejecutar si cambiamos de peli(id) o si cambiamos de usuario o se cierra sesion
    // --------------------------------------------------------------------------------


    // --------------------------------------------------------------------------------
    // Para el caso de que la peli no exista 
    if (!peli) {
        return (
            <div className="bg-dark text-white min-vh-100 d-flex align-items-center justify-content-center">
                <p>{t('movie_detail_loading')}</p>
            </div>
        );
    }
    // --------------------------------------------------------------------------------

    let variantBoton = "warning";               // 
    let textoBoton = t('movie_detail_add_fav'); // 
    let iconoBoton = "bi-plus-lg";              // 
    let estaBloqueado = false;                  // 

    if (esFavorita){                                // 
        variantBoton = "outline-warning";           // 
        textoBoton = t('movie_detail_already_fav'); // 
        iconoBoton = "bi-check-lg";                 // 
        estaBloqueado = true;                       // 
    }


    // --------------------------------------------------------------------------------
    let botonesAccion;
    if (authCtx.login){
        botonesAccion = (
            <>
                <Button onClick={() => setModoCine(true)}>
                    <i className='bi bi-play-fill me-2'></i>{t('movie_detail_btn_watch')}
                </Button>
                <Button onClick={añadirAfavoritos} variant={variantBoton} disabled={estaBloqueado} className='fw-bold'>
                    {/* <i className='bi bi-plus-lg me-2'></i>AÑADIR A MIS FAVORITOS */}
                    <i className={`bi ${iconoBoton} me-2`}></i>
                    {textoBoton}
                </Button>
            </>
        )
    }
    else{
        botonesAccion = (
            <Badge bg='warning' text='dark'>
                <i className='bi bi-lock-fill me-2'></i>
                {t('movie_detail_login_to_watch')}
            </Badge>
        )
    }
    // --------------------------------------------------------------------------------


    let seccionPuntuacion;
    if(!authCtx.login){
        seccionPuntuacion = (
            <Badge bg="warning" text="dark" className="p-3">
                {t('movie_detail_login_to_rate')}
            </Badge>
        )
    }
    else if (yaHasPuntuado){
        seccionPuntuacion = (
            <div className='bg-secondary bg-opacity-10 p-4 rounded shadow-sm mb-5'>
                <i className='bi bi-hand-thumbs-up-fill text-success display-6'></i>
                <h5 className='mt-3'>{t('movie_detail_thanks_rating')}</h5>
                <p>{t('movie_detail_your_rating_display', { nota: notaSeleccionada })}</p>
            </div>
        )
    }
    else {
        seccionPuntuacion = (
            <div className='bg-secondary bg-opacity-10 p-4 rounded shadow-sm mb-5'>
                <h5>{t('movie_detail_rate_title_section')}</h5>

                <Form className='row align-items-end'>
                    <Col xs="auto">
                        <Form.Label>Nota (1-10)</Form.Label>
                        <Form.Select
                            value={notaSeleccionada}
                            onChange={(e) => setNotaSeleccionada(Number(e.target.value))}
                        >
                            {[1,2,3,4,5,6,7,8,9,10].map(n=> (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col>
                        <Button variant='warning' onClick={enviarNota} className='fw-bold'>
                            Puntuar
                        </Button>
                    </Col>
                </Form>
            </div>
        )
    }


    // --------------------------------------------------------------------------------
    let seccionComentarios;
    if(!authCtx.login){ // Para el caso que no este registrado, habra que indicarle que se registre para que pueda reproducir la peli
        seccionComentarios = (
            <Badge bg="warning" text="dark" className="p-3">
                Inicia sesion para comentar que te ha parecido esta pelicula
            </Badge>
        )
    }
    else if(yaHasComentado){ // Si el usuario ya ha comentado, habra que indicarle que como ya ha comentado, no puede volver a comentar 
        seccionComentarios = (
        <div className='bg-secondary bg-opacity-10 p-4 rounded shadow-sm mb-5'>
            <h5>
                <i className="bi bi-chat-check-fill me-2"></i> {t('movie_detail_review_thanks_title')}
            </h5>
            <p>{t('movie_detail_review_already_done')}</p>
        </div>
        )
    }
    else{ // Aqui tratamos el caso en que no se haya comentado
        seccionComentarios = (
            <div className="bg-secondary bg-opacity-10 p-4 rounded shadow-sm">
                <h5 className="mb-3">{t('movie_detail_write_review')}</h5>
                <Form.Control 
                    as="textarea" 
                    rows={3} 
                    className="bg-dark text-white border-secondary mb-3"
                    placeholder={t('movie_detail_placeholder_review')}
                    value={comentarioTexto}
                    onChange={(e) => setComentarioTexto(e.target.value)} 
                />
                <Button variant="primary" onClick={enviarComentario}>{t('movie_detail_btn_send_comm')}</Button>
            </div>
        )
    }
    // --------------------------------------------------------------------------------


    return (
        <div className="bg-dark text-white min-vh-100"> 
            <div style={{ // Este es uno de los estilos mas importantes que vamos a implementar
                position: "relative",
                width: "100%",
                height: "65vh",
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 40%, #212529 100%), url(/${peli.imagen_en_pelicula})`,
                backgroundSize: "cover",
                backgroundPosition: "center top",
                display: "flex",
                alignItems: "flex-end"
            }}>
                <Container className="pb-4">
                    <Row>
                        <Col>
                            <h1 className="display-4 fw-bold">{peli.titulo}</h1>
                            <div className='mb-4 d-flex align-items-center flex-wrap'>
                                <span className="me-3">{renderEstrellas(mediaPeli)}</span>
                                <Badge bg='primary' className='me-3 px-3 py-2'>{peli.categoria}</Badge>
                                <span className='text-secondary fw-bold'>{peli.fecha_estreno}</span>
                            </div>

                            <div className="d-flex gap-3">
                            
                            {botonesAccion}

                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* INFO SECTION: Sinopsis + Video + Zona de comentarios*/}
            <Container className='mt-5 pb-5'>
                
                {modoCine && (
                    <ModoCine 
                        tituloPeli={peli.titulo} 
                        onClose={() => setModoCine(false)} 
                    />
                )}
                
                <Row className='gy-5'>
                    {/* Columna Izquierda: Sinopsis y Comentarios */}
                    <Col lg={7}>
                        <h5 className='text-uppercase text-secondary mb-3 small fw-bold tracking-wider'>{t('movie_detail_synopsis')}</h5>
                        <p className="fs-5 lh-base mb-5">
                            {peli.descripcion}
                        </p>

                        <hr className="border-secondary mb-5" />
                
                        {seccionPuntuacion}
                        <br>
                        </br>
                        <br>
                        </br>
                        {seccionComentarios}
                    </Col>

                    <Col lg={5}>
                        <div className='ms-lg-4'>
                            <h5 className='text-uppercase text-secondary mb-3 small fw-bold'>{t('movie_detail_official_trailer')}</h5>
                            <div className='ratio ratio-16x9 rounded overflow-hidden shadow-lg border border-secondary' 
                                 style={{ maxWidth: '480px', margin: '0 auto' }}>
                                <video 
                                    controls 
                                    poster={`/${peli.imagen_en_pelicula}`} 
                                    style={{ backgroundColor: '#000', objectFit: 'cover' }}
                                >
                                    <source src={`/${peli.video_local}`} type="video/mp4" />
                                    Tu navegador no soporta el video.
                                </video>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row className='mt-4'>
                    <Col>
                        <h4 className='mb-4'>{t('movie_detail_community_comments')}</h4>
                        {(()=> {
                            if(arrayDeComentarios && arrayDeComentarios.length > 0){
                                return (
                                    <div className="bg-secondary bg-opacity-10 p-3 rounded shadow-sm">
                                        {arrayDeComentarios.map((c:any, i:number) => (
                                            <div key={i} className="mb-3 p-2 border-bottom border-secondary">
                                                <div className='d-flex align-items-center gap-2'>
                                                    <i className='bi bi-person-fill text-white'></i>
                                                    <h6 className='mb-0'>{c.nombre_usuario}</h6>
                                                </div>
 
                                                <strong>{c.usuario}</strong>
                                                <p className="mb-0">{c.texto}</p>
                                            </div>
                                        ))}
                                    </div>
                                );
                            }
                            else{
                                return (
                                    <p>{t('movie_detail_no_comments_yet')}</p>
                                )
                            }
                        })()}
                    </Col>
                </Row>
                <MensajeModal 
                    show={mostrarModal}
                    onHide={() => setMostrarModal(false)}
                    titulo={tituloModal}
                    mensaje={mensajeModal}
                    tipo={tipoModal}
                />
            </Container>
        </div>
    );
}

export default DetallePelicula;