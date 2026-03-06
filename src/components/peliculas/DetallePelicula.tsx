import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Badge, Form } from 'react-bootstrap';
import axios from "axios";
import AuthContext from '../../store/AuthContext';
import './detallepelicula.css';

// --- INTERFACES ---
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

interface FirebasePelicula { 
    [key: string]: Omit<Pelicula, "id">;
}

interface FirebaseResponse {
    peliculas: FirebasePelicula;
}

// --- FUNCIONES AUXILIARES ---
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

function renderEstrellas(nota: number) {
    const estrellasMax = 5;
    const valor_sobre_5 = nota / 2;
    const iconos = [];

    for (let i = 1; i <= estrellasMax; i++) {
        if (i <= valor_sobre_5) {
            iconos.push(<i key={i} className="bi bi-star-fill text-warning me-1"></i>);
        } else if (i - 0.5 === valor_sobre_5) {
            iconos.push(<i key={i} className="bi bi-star-half text-warning me-1"></i>);
        } else {
            iconos.push(<i key={i} className="bi bi-star text-muted me-1"></i>);
        }
    }
    return <span style={{ fontSize: '1.1rem' }}>{iconos}</span>;
}


    

// --- COMPONENTE PRINCIPAL ---
function DetallePelicula() {
    const { id } = useParams<{ id: string }>();
    const authCtx = useContext(AuthContext);

    const [peli, setPeli] = useState<Pelicula | null>(null);
    const [comentarioTexto, setComentarioTexto] = useState("");
    const [listaComentarios, setListaComentarios] = useState<any[]>([]);
    const [notaSeleccionada, setNotaSeleccionada] = useState(5);
    const [mediaPeli, setMediaPeli] = useState<number>(0);
    const yaHasComentado = listaComentarios.find((comentario) => { // Todo esto, suponiendo que listaComentarios ya venga filtrada para esta pelicula en especifico
        const esMismoUsuario = comentario.usuario_id === authCtx.userID;
        return esMismoUsuario;
    });

    const [yaHasPuntuado, setYaHasPuntuado] = useState(false);
    // --------------------------------------------------------------------------------



    // --------------------------------------------------------------------------------
    const enviarComentario = () => {
        const nuevoComentario = {
            pelicula_id:peli?.id, // Revisar esto que no se si va a funcionar
            texto:comentarioTexto,
            usuario_id:authCtx.userID,
            fecha:new Date().toLocaleString()
        }
        axios.post('https://pelis-react-upna-ru-al-default-rtdb.europe-west1.firebasedatabase.app/comentarios.json', nuevoComentario)
        .then(() => {
            setComentarioTexto("");
            alert("Comentario guardado correctamente");
            cargarComentarios();
        })
        .catch(err => console.log("Error al guardar comentario",err));
    };
    // --------------------------------------------------------------------------------



    // --------------------------------------------------------------------------------
    const cargarMedia = () => {
        axios.get('https://pelis-react-upna-ru-al-default-rtdb.europe-west1.firebasedatabase.app/puntuaciones.json')
        .then((res) => {
            const data = res.data;
            let suma = 0;
            let contador = 0;
            let promedio;
            for (const key in data){
                if(String(data[key].pelicula_id) === id){
                    suma = suma + Number(data[key].nota);
                    contador++;
                }
            }

            if (contador > 0){
                const calculo = suma / contador;
                promedio = calculo.toFixed(1);
            }else{
                promedio = 0;
            }
            setMediaPeli(Number(promedio));
        })
    }
    // --------------------------------------------------------------------------------



    // --------------------------------------------------------------------------------
    const enviarNota = () => {
        const nuevaPuntuacion = {
            pelicula_id:peli?.id,
            nota:notaSeleccionada,
            usuario_id:authCtx.userID,
        }
        axios.post('https://pelis-react-upna-ru-al-default-rtdb.europe-west1.firebasedatabase.app/puntuaciones.json',nuevaPuntuacion)
        .then((res) => {
            alert('Puntuacion guardada correctamente');
            cargarMedia();
        })
    }
    // --------------------------------------------------------------------------------




    // --------------------------------------------------------------------------------
    const cargarComentarios = () => {
        axios.get('https://pelis-react-upna-ru-al-default-rtdb.europe-west1.firebasedatabase.app/comentarios.json')
        .then((resultado) => {
            const data = resultado.data;
            const comentarios_filtrados = [];

            for (const key in data){
                if(String(data[key].pelicula_id) === id){
                    comentarios_filtrados.push({id_firebase:key,...data[key]});
                }
            }
            setListaComentarios(comentarios_filtrados);

        })
        .catch(error => console.log("Error al cargar comentarios", error));
    }
    // --------------------------------------------------------------------------------



    // --------------------------------------------------------------------------------
    useEffect(() => {
        cargarComentarios();
        cargarMedia();
    },[id]);
    // --------------------------------------------------------------------------------



    // --------------------------------------------------------------------------------
    useEffect(() => {
        axios.get<FirebaseResponse>("https://pelis-react-upna-ru-al-default-rtdb.europe-west1.firebasedatabase.app/.json")
            .then((response) => {
                const data = response.data;
                if (data && data.peliculas) {
                    const peliculasArray: Pelicula[] = Object.entries(data.peliculas).map(
                        ([key, value]) => ({
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
    }, [id]);
    // --------------------------------------------------------------------------------



    // --------------------------------------------------------------------------------
    if (!peli) {
        return (
            <div className="bg-dark text-white min-vh-100 d-flex align-items-center justify-content-center">
                <p>Cargando detalles de la pelicula...</p>
            </div>
        );
    }
    // --------------------------------------------------------------------------------



    // --------------------------------------------------------------------------------
    let botonesAccion;
    if (authCtx.login){
        botonesAccion = (
            <>
                <Button>
                    <i className='bi bi-play-fill me-2'></i>VER AHORA
                </Button>
                <Button>
                    <i className='bi bi-plus-lg me-2'></i>MI LISTA
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



    // --------------------------------------------------------------------------------
    let seccionComentarios;
    if(!authCtx.login){
        seccionComentarios = (
            <Badge bg="warning" text="dark" className="p-3">
                Inicia sesion para reproducir el contenido
            </Badge>
        )
    }
    else if(yaHasComentado){
        seccionComentarios = (
        <div>
            <h5>
                <i></i> Gracias por tu reseña
            </h5>
            <p>Ya has participado en la comunidad de esta pelicula</p>
        </div>
        )
    }
    else{
        seccionComentarios = (
            <div className="bg-secondary bg-opacity-10 p-4 rounded shadow-sm">
                <h5 className="mb-3">Comentanos que te ha parecido</h5>
                <Form.Control 
                    as="textarea" 
                    rows={3} 
                    className="bg-dark text-white border-secondary mb-3"
                    placeholder="Escribe tu reseña..."
                    value={comentarioTexto}
                    onChange={(e) => setComentarioTexto(e.target.value)}
                />
                <Button variant="primary" onClick={enviarComentario}>Enviar comentario</Button>
            </div>
        )
    }
    // --------------------------------------------------------------------------------


    return (
        <div className="bg-dark text-white min-vh-100"> 
            <div style={{ 
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
                            


                            {authCtx.login ? (
                                <>
                                    <Button variant='light' className="px-4 py-2 fw-bold">
                                        <i className='bi bi-play-fill me-2'></i>VER AHORA
                                    </Button>
                                    <Button variant='outline-light' className="px-4 py-2">
                                        <i className='bi bi-plus-lg me-2'></i>MI LISTA
                                    </Button>
                                </>
                            ) : (
                                <Badge bg="warning" text="dark" className="p-3">
                                    Inicia sesión para reproducir el contenido
                                </Badge>
                            )}
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
            </Container>
        </div>
    );
}

export default DetallePelicula;