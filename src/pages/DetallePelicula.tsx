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

// --- COMPONENTE PRINCIPAL ---
function DetallePelicula() {
    
    // MODIFICADO
    // ------------------------------------------------------------------
    const { id } = useParams<{ id: string }>();                         // Aqui extraemos el id de la url que estmamos poniendo
    const authCtx = useContext(AuthContext);                            // Tomamos el contexto del usuario que se encuentra dentro en este momento
    const [peli, setPeli] = useState<Pelicula | null>(null);            // Aqui vamos a guardar el objeto completo de la pelicula
    const [comentarioTexto, setComentarioTexto] = useState("");         // Aqui guardamos el comentario de texto que puede escribir el usuario
    const [listaComentarios, setListaComentarios] = useState<any[]>([]);// Aqui guardamos todos los comentarios sobre esta peli que han hecho los usuarios
    const [notaSeleccionada, setNotaSeleccionada] = useState(5);        // Vamos a guardar la nota a la pelicula que le da el usuario
    const [mediaPeli, setMediaPeli] = useState<number>(0);              // Media final que vamos a calcular con el conjunto de notas
    
    const yaHasComentado = listaComentarios.find((comentario) => {      // Todo esto, suponiendo que listaComentarios ya venga filtrada para esta pelicula en especifico
        const esMismoUsuario = comentario.usuario_id === authCtx.userID;
        return esMismoUsuario;
    });

    const [esFavorita, setEsFavorita] = useState(false);

    const [modoCine, setModoCine] = useState(false);

    const [yaHasPuntuado, setYaHasPuntuado] = useState(false);      // Vamos a comprobar si este usuario que esta dentro ya ha puntuado (No dejamos puntuar dos veces a la misma peli)
    

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
    // --------------------------------------------------------------

    

    // MODIFICADO
    // --------------------------------------------------------------
    const cargarDatosIniciales = async () => {
        if (!id) return;

        /* const [peliculaData, comentariosData, puntuacionesData] = await Promise.all([
            PeliculaRepository.getById(id),
            PeliculaRepository.getComentarios(id),
            PeliculaRepository.getPuntuaciones(id)
        ]); */

        const resultados = await Promise.all([
            PeliculaRepository.getById(id),
            PeliculaRepository.getComentarios(id),
            PeliculaRepository.getPuntuaciones(id),
            (async () => {
                if (authCtx.userID && authCtx.idToken){
                    return await PeliculaRepository.getFavoritoById(authCtx.userID,authCtx.idToken);
                }
                return [];
            })()
        ])

        setPeli(resultados[0]);
        setListaComentarios(resultados[1]);
        procesarPuntuaciones(resultados[2]);

        const listaIdsFavoritos = resultados[3];

        if(listaIdsFavoritos.includes(Number(id))){
            setEsFavorita(true);
        }
        else{
            setEsFavorita(false);
        }
    }
    // --------------------------------------------------------------


    // MODIFICADO
    // --------------------------------------------------------------
    const procesarPuntuaciones = (data: any[]) => {
        if (!data || data.length === 0) {
            setMediaPeli(0);
            return;
        }

        let suma = 0;
        for (let i = 0; i < data.length; i++) {
            suma = suma + Number(data[i].nota);
        }
        const promedio = (suma / data.length).toFixed(1);
        setMediaPeli(Number(promedio));

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


    // MODIFICADO
    // --------------------------------------------------------------------------------
    const enviarComentario = async () => { // ----- ESTO LO VAMOS A ENVIAR A X ----------
        const nuevoComentario = {               // Definimos el nuevo comentario que va a introducir este usuario
            pelicula_id:peli?.id,               // 
            texto:comentarioTexto,              // Almacenamos el comentario de texto
            usuario_id:authCtx.userID,          // Almacenamos con el comentario el usuario id que esta ahora dentro
            fecha:new Date().toLocaleString()   //
        }

        await PeliculaRepository.saveComentario(nuevoComentario);
        setComentarioTexto("");
        // alert("Comentario guardado correctamente"); // Solo para pruebas
        lanzamientoAviso("Comentario guardado","¡Gracias por darnos tu opinion!","success")
        const nuevosComentarios = await PeliculaRepository.getComentarios(id!);
        setListaComentarios(nuevosComentarios);
    };
    // --------------------------------------------------------------------------------



    // MODIFICADO
    // --------------------------------------------------------------------------------
    const enviarNota = async () => { // Proceso en la que este usuario va a enviar la nota
        
        if (!peli || yaHasPuntuado){
            return
        }
        
        const nuevaPuntuacion = {
            pelicula_id:peli?.id,
            nota:notaSeleccionada,
            usuario_id:authCtx.userID, // Asociado a esa nota le introducimos un indicativo del usuario = el usuario_id
        }

        await PeliculaRepository.savePuntuacion(nuevaPuntuacion);
        // alert('Puntuacion guardada'); // Solo para pruebas
        lanzamientoAviso("Puntuacion guardada","¡Gracias por valorar la pelicula!","success")
        setYaHasPuntuado(true);
        cargarDatosIniciales();
    }
    // --------------------------------------------------------------------------------



    // MODIFICADO
    // --------------------------------------------------------------------------------
    const añadirAfavoritos = async () => {
        const nuevoFavorito = {
            pelicula_id: peli?.id,
            usuario_id:authCtx.userID,
            titulo: peli?.titulo,
            imagen_portada:peli?.imagen_portada,
            categoria:peli?.categoria

        }

        await PeliculaRepository.saveFavoritos(authCtx.userID!, nuevoFavorito);
        //alert("Añadida a favoritos");
        setEsFavorita(true);
        lanzamientoAviso("Añadida a favoritos", "Pelicula añadida a tus favoritos", "success");
    }
    // --------------------------------------------------------------------------------
    

    // --------------------------------------------------------------------------------
    useEffect(() => {
        // 1) Hacemos la limpieza para que salga inicialmente lo de Cargando...
        setPeli(null);
        if(!id)return;

        // 2) Cargamos los detalles
        cargarDatosIniciales();
    },[id, authCtx.login]);
    // --------------------------------------------------------------------------------


    // --------------------------------------------------------------------------------
    if (!peli) { // Para el caso de que la peli no exista (haya puesto algo mal en la url, dejaremos en Cargando..) => ESTO SE PUEDE MODIFICAR
        return (
            <div className="bg-dark text-white min-vh-100 d-flex align-items-center justify-content-center">
                <p>Cargando detalles de la pelicula...</p>
            </div>
        );
    }
    // --------------------------------------------------------------------------------

    let variantBoton = "warning";
    let textoBoton = "AÑADIR A MIS FAVORITOS";
    let iconoBoton = "bi-plus-lg";
    let estaBloqueado = false;

    if (esFavorita){
        variantBoton = "outline-warning";
        textoBoton = "YA EN MIS FAVORITOS";
        iconoBoton = "bi-check-lg";
        estaBloqueado = true;
    }


    // --------------------------------------------------------------------------------
    let botonesAccion;
    if (authCtx.login){
        botonesAccion = (
            <>
                <Button onClick={() => setModoCine(true)}>
                    <i className='bi bi-play-fill me-2'></i>VER AHORA
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
                Inicia sesion para reproducir el contenido
            </Badge>
        )
    }
    // --------------------------------------------------------------------------------


    let seccionPuntuacion;
    if(!authCtx.login){
        seccionPuntuacion = (
            <Badge bg="warning" text="dark" className="p-3">
                Inicia sesion para puntuar esta pelicula
            </Badge>
        )
    }
    else if (yaHasPuntuado){
        seccionPuntuacion = (
            <div className='bg-secondary bg-opacity-10 p-4 rounded shadow-sm mb-5'>
                <i className='bi bi-hand-thumbs-up-fill text-success display-6'></i>
                <h5 className='mt-3'>¡Gracias por tu valoracion!</h5>
                <p>Has puntuado esta pelicula con un <strong>{notaSeleccionada}</strong></p>
            </div>
        )
    }
    else {
        seccionPuntuacion = (
            <div className='bg-secondary bg-opacity-10 p-4 rounded shadow-sm mb-5'>
                <h5>Opina sobre esta pelicula</h5>

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
                Inicia sesion para reproducir el contenido
            </Badge>
        )
    }
    else if(yaHasComentado){ // Si el usuario ya ha comentado, habra que indicarle que como ya ha comentado, no puede volver a comentar 
        seccionComentarios = (
        <div className='bg-secondary bg-opacity-10 p-4 rounded shadow-sm mb-5'>
            <h5>
                <i></i> Gracias por tu reseña
            </h5>
            <p>Ya has participado en la comunidad de esta pelicula</p>
        </div>
        )
    }
    else{ // Aqui tratamos el caso en que no se haya comentado
        seccionComentarios = (
            <div className="bg-secondary bg-opacity-10 p-4 rounded shadow-sm">
                <h5 className="mb-3">Comentanos que te ha parecido</h5>
                <Form.Control 
                    as="textarea" 
                    rows={3} 
                    className="bg-dark text-white border-secondary mb-3"
                    placeholder="Escribe tu reseña..."
                    value={comentarioTexto}
                    onChange={(e) => setComentarioTexto(e.target.value)} // Establecemos el comentario actual
                />
                <Button variant="primary" onClick={enviarComentario}>Enviar comentario</Button>
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
                        <h5 className='text-uppercase text-secondary mb-3 small fw-bold tracking-wider'>Sinopsis</h5>
                        <p className="fs-5 lh-base mb-5">
                            {peli.descripcion}
                        </p>

                        <hr className="border-secondary mb-5" />
                
                        {seccionPuntuacion}
                        {seccionComentarios}
                    </Col>

                    <Col lg={5}>
                        <div className='ms-lg-4'>
                            <h5 className='text-uppercase text-secondary mb-3 small fw-bold'>Trailer Oficial</h5>
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
                        <h4 className='mb-4'>Comentarios de la comunidad</h4>
                        {(()=> {
                            if(listaComentarios && listaComentarios.length > 0){
                                return (
                                    <div className="bg-secondary bg-opacity-10 p-3 rounded shadow-sm">
                                        {listaComentarios.map((c, i) => (
                                            <div key={i} className="mb-3 p-2 border-bottom border-secondary">
                                                <div className='d-flex align-items'>
                                                    <div>
                                                        <i className='bi bi-person-fill text-white'></i>
                                                    </div>
                                                </div>
                                                <div>
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
                                    <p>Todavia no hay comentarios sobre esta pelicula</p>
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