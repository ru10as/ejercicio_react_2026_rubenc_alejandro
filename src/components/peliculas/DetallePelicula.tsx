import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Badge, Form } from 'react-bootstrap';
import axios from "axios";
import AuthContext from '../../store/AuthContext';
import './detallepelicula.css';
import MensajeModal from '../ui/MensajeModal';

// --- INTERFACES ---
// --------------------------------------------------------------------
interface Pelicula { 
    id: number;   
    titulo: string;
    categoria: string;
    taquilla: number;
    video_local: string;
    pais_origen: string;
    mercados?: any[];
    imagen_portada: string;
    imagen_en_pelicula: string;
    calificacion_media: number;
    descripcion: string;
    comentarios?: { usuario: string; texto: string; nota: number }[];
    proximamente: boolean;
    fecha_estreno: string;
}
// --------------------------------------------------------------------


// --------------------------------------------------------------------
interface FirebasePelicula { 
    [key: string]: Omit<Pelicula, "id">;
}
// --------------------------------------------------------------------


// --------------------------------------------------------------------
interface FirebaseResponse {
    peliculas: FirebasePelicula;
}
// --------------------------------------------------------------------

// --- FUNCIONES AUXILIARES ---
// --------------------------------------------------------------------
function calcularMedia(comentarios: { nota: number }[] | undefined): number {
    if (!comentarios || comentarios.length === 0) {
        return 0;
    }
    const suma = comentarios.reduce((acc,curr) => {
        return acc + curr.nota;
    },0);

    const promedio = suma / comentarios.length;
    const resultadoFormateado = promedio.toFixed(1);

    return Number(resultadoFormateado);
}
// --------------------------------------------------------------------


// --------------------------------------------------------------------
function renderEstrellas(nota: number) {
    const estrellasMax = 5;             // Vamos a tratar sobre 5 estrellas en vez de sobre 10
    const valor_sobre_5 = nota / 2;     // Por ello, aqui hacemos el ajuste
    const iconos = [];                  // aqui vamos a almacenar los iconos (el numero de estrellas)

    for (let i = 1; i <= estrellasMax; i++) {                               // Recorremos hasta un maximo de 5 estrellas
        if (i <= valor_sobre_5) {                                           // Damos estrella completa
            iconos.push(<i key={i} className="bi bi-star-fill text-warning me-1"></i>);
        } else if (i - 0.5 === valor_sobre_5) {                             // Damos media estrella
            iconos.push(<i key={i} className="bi bi-star-half text-warning me-1"></i>);
        } else {                                                            // Damos estrella vacia
            iconos.push(<i key={i} className="bi bi-star text-muted me-1"></i>);
        }
    }
    return <span style={{ fontSize: '1.1rem' }}>{iconos}</span>;
}
// -------------------------------------------------------------


    

// --- COMPONENTE PRINCIPAL ---
function DetallePelicula() {
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

    // -------------- Todo lo relacionado al Modal ----------------------------
    const [mostrarModal, setMostrarModal] = useState(false);                    // Para indicar si vamos a mostrar el mensaje de Modal
    const [tituloModal, setTituloModal] = useState("");                         // Para establecer el tipo de titulo en el Modal (segun si hemos añadido comentario, puntuacion, etc..)
    const [mensajeModal, setMensajeModal] = useState("");                       // Para indicar el tipo de mensaje que aparece en el modal
    const [tipoModal, setTipoModal] = useState<'success' | 'error'>('success'); // 


    // ---------------------------------------------------------------------------
    const lanzamientoAviso = (titulo:string, mensaje:string, tipo: 'success' | 'error') => {
        setTituloModal(titulo);
        setMensajeModal(mensaje);
        setTipoModal(tipo);
        setMostrarModal(true);
    }
    // ---------------------------------------------------------------------------


    const [esFavorita, setEsFavorita] = useState(false);            // 
    const [yaHasPuntuado, setYaHasPuntuado] = useState(false);      // Vamos a comprobar si este usuario que esta dentro ya ha puntuado (No dejamos puntuar dos veces a la misma peli)
    // --------------------------------------------------------------


    // --------------------------------------------------------------
    const [idFirebaseFavorito, setIdFirebaseFavorito] = useState<string | null>(null); // Para almacenar el indicativo con el que se va a guardar la peli favorita
    const [esPeliFavorita, setEsPeliFavorita] = useState(false);    // 
    // --------------------------------------------------------------


    // --------------------------------------------------------------
    const comprobarSiEsFavorito = () => {
        if(!authCtx.login || !authCtx.userID){
            return
        }

        axios.get(`https://pelis-react-upna-ru-al-default-rtdb.europe-west1.firebasedatabase.app/usuarios/${authCtx.userID}/favoritos.json`)
        .then((result) => {
            const data = result.data; // Tomamos los resultados
            let encontradoKeyEsFavorito = null; 

            for (const key in data){
                if(String(data[key].pelicula_id) === id){
                    encontradoKeyEsFavorito = key;
                    break;
                }
            }

            if (encontradoKeyEsFavorito){
                setEsPeliFavorita(true);
                setIdFirebaseFavorito(encontradoKeyEsFavorito);
            } else{
                setEsPeliFavorita(false);
                setIdFirebaseFavorito(null);
            }  
        })
        .catch(err => console.error("Error al comprobar el favorito",err));
    }
    // --------------------------------------------------------------


    // --------------------------------------------------------------
    const eliminarDeFavoritos = () => {
        if (idFirebaseFavorito === null)return;

        axios.delete(`https://pelis-react-upna-ru-al-default-rtdb.europe-west1.firebasedatabase.app/usuarios/${authCtx.userID}/favoritos/${idFirebaseFavorito}.json`)
        .then(() => {
            setEsPeliFavorita(false);
            setIdFirebaseFavorito(null);
            lanzamientoAviso("Eliminado","Se ha quitado de tus favoritos","success");
        })
        .catch(err => console.log("Error al eliminar",err));
    }
    // --------------------------------------------------------------



    




    // --------------------------------------------------------------------------------
    const enviarComentario = () => {
        const nuevoComentario = {               // Definimos el nuevo comentario que va a introducir este usuario
            pelicula_id:peli?.id,               // 
            texto:comentarioTexto,              // Almacenamos el comentario de texto
            usuario_id:authCtx.userID,          // Almacenamos con el comentario el usuario id que esta ahora dentro
            nombre_usuario:authCtx.userName,    // Vamos a enviar tambien este indicativo de forma que podamos poner el nombre junto al comentario
            fecha:new Date().toLocaleString()   //
        }
        axios.post('https://pelis-react-upna-ru-al-default-rtdb.europe-west1.firebasedatabase.app/comentarios.json', nuevoComentario)
        .then(() => {
            setComentarioTexto("");                     // Aqui lo que hacemos es limpiar el cuadro de texto para que no se quede lo escrito ahi
            //alert("Comentario guardado correctamente"); // Solo para pruebas
            cargarComentarios();                        // Y cargamos el conjunto de comentarios
            lanzamientoAviso("Comentario guardado","¡Gracias por darnos tu opinion!","success")
        })
        .catch(err => console.log("Error al guardar comentario",err));
    };
    // --------------------------------------------------------------------------------



    // --------------------------------------------------------------------------------
    const cargarMedia = () => {
        axios.get('https://pelis-react-upna-ru-al-default-rtdb.europe-west1.firebasedatabase.app/puntuaciones.json')
        .then((res) => {
            const data = res.data;      // Cargamos la info que nos devuelve
            let suma = 0;               // Aqui es donde vamos a ir almacenando la suma de todas las notas de esta peli
            let contador = 0;           // Para saber sobre que numero dividir (para hacer la media)
            let promedio;               // Donde almacenaremos el promedio
            for (const key in data){
                if(String(data[key].pelicula_id) === id){ // Comprobamos si es una puntuacion de esta peli mediante su id
                    suma = suma + Number(data[key].nota);
                    contador++;
                }
            }

            if (contador > 0){                      // Comprobamos que el contador sea mayor que cero (posteriormente haremos la division)
                const calculo = suma / contador;    // Hacemos la operacion
                promedio = calculo.toFixed(1);      // 
            }else{                                  // 
                promedio = 0;                       // 
            }                                       // 
            setMediaPeli(Number(promedio));         // 
        })
    }
    // --------------------------------------------------------------------------------



    // --------------------------------------------------------------------------------
    const enviarNota = () => { // Proceso en la que este usuario va a enviar la nota
        
        if (!peli || yaHasPuntuado){
            return
        }
        
        const nuevaPuntuacion = {
            pelicula_id:peli?.id,
            nota:notaSeleccionada,
            usuario_id:authCtx.userID, // Asociado a esa nota le introducimos un indicativo del usuario = el usuario_id
        }
        axios.post('https://pelis-react-upna-ru-al-default-rtdb.europe-west1.firebasedatabase.app/puntuaciones.json',nuevaPuntuacion)
        .then(() => {
            // alert('Puntuacion guardada correctamente'); // Esto solo para pruebas
            setYaHasPuntuado(true);
            cargarMedia();
            lanzamientoAviso("Puntuacion guardada","¡Gracias por valorar la pelicula!","success")
        })
    }
    // --------------------------------------------------------------------------------



    // --------------------------------------------------------------------------------
    const añadirAfavoritos = () => {
        const nuevoFavorito = {                 // 
            pelicula_id: peli?.id,              //
            usuario_id:authCtx.userID,          //
            titulo: peli?.titulo,               //
            imagen_portada:peli?.imagen_portada,//
            categoria:peli?.categoria           //
        }
        axios.post(`https://pelis-react-upna-ru-al-default-rtdb.europe-west1.firebasedatabase.app/usuarios/${authCtx.userID}/favoritos.json`,nuevoFavorito)
        .then((result) => {
            // alert("Pelicula añadida a favoritos"); // Solo para pruebas
            const firebaseId = result.data.name;    // 
            setEsPeliFavorita(true);                // 
            setIdFirebaseFavorito(firebaseId);      // 
            
            lanzamientoAviso("Añadida a favoritos", "Pelicula añadida a tus favoritos", "success");
        })
        .catch(err => console.log("Error al guardar favorito",err))

    }
    // --------------------------------------------------------------------------------
    



    // --------------------------------------------------------------------------------
    const cargarComentarios = () => {
        axios.get('https://pelis-react-upna-ru-al-default-rtdb.europe-west1.firebasedatabase.app/comentarios.json') // Cargamos la parte de la base de datos de comentarios.json
        .then((resultado) => {
            const data = resultado.data;
            const comentarios_filtrados = [];

            for (const key in data){                                            // Vamos a recorrer cada uno de los comentarios que tomamos
                if(String(data[key].pelicula_id) === id){                       // Nos vamos a quedar con los comentarios de esta pelicula
                    comentarios_filtrados.push({id_firebase:key,...data[key]}); // Lo de dentro del push lo hacemos por si en un futuro queremos eliminar algun comentario
                }                                                               // 
            }
            setListaComentarios(comentarios_filtrados); // En la lista que estamoos almacenando solo habra comentarios de esta pelicula

        })
        .catch(error => console.log("Error al cargar comentarios", error));
    }
    // --------------------------------------------------------------------------------


    // --------------------------------------------------------------------------------
    useEffect(() => {
        // 1) Primero lo que vamos a hacer es limpiar las peliculas que existen
        setPeli(null); // Pa que salga lo de Cargando...

        // 2) Cargamos los detalles de la pelicula
        axios.get<FirebaseResponse>("https://pelis-react-upna-ru-al-default-rtdb.europe-west1.firebasedatabase.app/.json")
            .then((response) => {
                const data = response.data;
                if (data && data.peliculas) {
                    const peliculasArray: Pelicula[] = Object.entries(data.peliculas).map(
                        ([key, value]) => ({ // De nuevo vamos a hacer lo mismo, almacenar el id dentro por asi decir
                            id: Number(key),
                            ...value
                        })
                    );
                    const seleccionada = peliculasArray.find((p) => p.id === Number(id));
                    setPeli(seleccionada || null);
                }
            })
            .catch((error) => {
                console.error("Error al cargar pelicula:", error);
                setPeli(null);
            });

        // 3) Cargamos comentarios y la media
        cargarComentarios();    // Una vez cargamos, va a aparecer tanto los comentarios de esta pelicula como..
        cargarMedia();          // La media que se ha calculado de la misma

        // 4) Comprobamos si la peli esta entre los favoritos (Para dar la posibilidad de quitar de favoritos)
        comprobarSiEsFavorito();
    }, [id, authCtx.login]);
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


    // --------------------------------------------------------------
    let botonFavorito;

    if(esPeliFavorita){
        botonFavorito = (
            <Button variant='danger' onClick={eliminarDeFavoritos}>
                <i className='bi bi-heartbreak-fill me-2'></i>QUITAR DE FAVORITOS
            </Button>
        )
    }
    else {
        botonFavorito = (
            <Button onClick={añadirAfavoritos}>
                <i className='bi bi-plus-lg me-2'></i>AÑADIR A MIS FAVORITOS
            </Button>
        )
    }
    // --------------------------------------------------------------


    // --------------------------------------------------------------------------------
    let botonesAccion;
    if (authCtx.login){
        botonesAccion = (
            <>
                <Button>
                    <i className='bi bi-play-fill me-2'></i>VER AHORA
                </Button>
                {botonFavorito}
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
        <div>
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
                <Row className='gy-5'>
                    {/* Columna Izquierda: Sinopsis y Comentarios */}
                    <Col lg={7}>
                        <h5 className='text-uppercase text-secondary mb-3 small fw-bold tracking-wider'>Sinopsis</h5>
                        <p className="fs-5 lh-base mb-5">
                            {peli.descripcion}
                        </p>

                        <hr className="border-secondary mb-5" />

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
                        
                        {seccionComentarios}
                    </Col>

                    <Col lg={5}>
                        <div className='ms-lg-4'>
                            <h5 className='text-uppercase text-secondary mb-3 small fw-bold'>Trailer Oficial</h5>
                            <div className='ratio ratio-16x9 rounded overflow-hidden shadow-lg border border-secondary' 
                                 style={{ maxWidth: '480px', margin: '0 auto' }}>
                                <video 
                                    controls 
                                    poster={`/${peli.imagen_portada}`} 
                                    style={{ backgroundColor: '#000', objectFit: 'cover' }}>
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
                                                <div className='d-flex align-items-center'>
                                                    <div className='me-2'>
                                                        <i className='bi bi-person-fill text-white'></i>
                                                    </div>
                                                    <div>
                                                    <h6 className='mb-0'>{c.nombre_usuario || "Usuario anonimo"}</h6>
                                                </div>
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
            </Container>
            <MensajeModal 
            show={mostrarModal} 
            onHide={() => setMostrarModal(false)}
            titulo={tituloModal}
            mensaje={mensajeModal}
            tipo={tipoModal}>

            </MensajeModal>
        </div>
    );
}

export default DetallePelicula;