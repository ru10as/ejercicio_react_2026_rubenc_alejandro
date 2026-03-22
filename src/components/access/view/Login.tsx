import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Container, Row, Form } from "react-bootstrap";
import './access.css';
import { AccessRepository } from "../../../infrastructure/AccessRepository";
import { AccessService } from "../../../services/AuthService";
import AuthContext from "../../../store/AuthContext";
import MensajeModal from "../../ui/MensajeModal";
import { useTranslation } from 'react-i18next';


// ESTRUCTURA HEXAGONAL = SI
// TODO INDICADO CON MENSAJES = SI
// IDIOMAS = SI

function Login(){
    // Definimos el authCtx para tomar el contexto actual
    const authCtx = useContext(AuthContext);

    // Lo utilizaremos para navegar a otras paginas
    const navigate = useNavigate();

    // Para el tratamiento con multiples idiomas
    const {t} = useTranslation();

    // Para almacenar el email que se meta el usuario al log
    const [email, setEmail] = useState<string>('');

    // Para almacenar la contra que se meta el usuario al log
    const [password, setPassword] = useState<string>('');

    // Para el mensaje de error que saquemos
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Para indicar si vamos a mostrar el mensaje de Modal
    const [mostrarModal, setMostrarModal] = useState(false);

    // Para establecer el tipo de titulo en el Modal (segun si hemos añadido comentario, puntuacion, etc..)
    const [tituloModal, setTituloModal] = useState("");

    // Para indicar el tipo de mensaje que aparece en el modal
    const [mensajeModal, setMensajeModal] = useState("");

    // Para indicar que tipo de mensaje vamos a establecer (de algo positivo o de error)
    const [tipoModal, setTipoModal] = useState<'success' | 'error'>('success');
    
    // cuando lancemos el aviso, estableceremos todo lo que se indica aqui 
    const lanzamientoAviso = (titulo:string, mensaje:string, tipo: 'success' | 'error') => {
        setTituloModal(titulo);
        setMensajeModal(mensaje);
        setTipoModal(tipo);
        setMostrarModal(true);
    }

    // Esta funcion para tomar los datos que meta el usuario y lo envie a la base de datos
    const submitHandler = async (e: React.FormEvent) => {
        // Esto para evitar que se la pag se recargue
        e.preventDefault();
        try{
            // Hacemos la peticion de autenticacion a la funcion definida en el AccessRepository
            const resAuth = await AccessRepository.login(email, password);

            // Tomamos el token del estado actual
            const idToken = resAuth.data.idToken;

            // y su id
            const localId = resAuth.data.localId;

            // Ahora vamos a obtener el nombre real del usuario que se ha logueado
            const nombreReal = await AccessRepository.obtenerNombreUsuario(localId,idToken);

            // Enviamos estos datos (y si no mete nombre, le llamamos usuario) => Esto seria posible punto de mejora
            authCtx.loginAction(idToken, localId, nombreReal || "Usuario");

            // Lanzamos el aviso para dar la bienvenida al usuario
            lanzamientoAviso(t('welcome'),t('hello') + ", " + nombreReal, "success");

            // Retrasamos para que el cambio no sea instantaneo
            setTimeout(() => {
                navigate("/");
            }, 1500); // Revisar esto 

        } 
        catch(error: any){
            // Codigo de error desconocido
            let codigo = t('mensaje_error_desconocido');

            // Comporbar si ha respondido algo el servidor; si tiene datos dicha respuesta; Si hay error entre esos datos; 
            if (error.response && error.response.data && error.response.data.error){
                codigo = error.response.data.error.message;
            }

            // Llamamos a la funcion en AccessService para pasarle el codigo 
            const mensajeParaUsuario = AccessService.obtenerMensajeError(codigo);

            // Lanzamos mensaje de que ha habido error
            lanzamientoAviso(t('error_de_acceso'),mensajeParaUsuario,"error");
        }
    }
    return(
        <div className="access-page">
            <Container>
                <Row className="align-items-center g-4">
                    {/* Esta columna la empleamos para la imiagen de un lateral */}
                    <Col className="d-none d-md-block">
                        <div className="access-side-img">
                            <img src='imagen_por_peli/imagen_pelicula_peaky_blinders.webp' alt='Peaky Blinders' />
                        </div>
                    </Col>

                    {/* Esta columna la empleamos para lo que es el log */}
                    <Col xs={12} md={6}>
                        <div className="access-card">
                            <h2 className="access-card-title text-center">{t('login_title')}</h2>
                            <div className="access-card-divider mx-auto"></div>

                            <Form onSubmit={submitHandler}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="access-label">{t('email')}</Form.Label>
                                    <Form.Control
                                        className="access-input"
                                        type='email'
                                        placeholder={t('email_placeholder')}
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="access-label">{t('password')}</Form.Label>
                                    <Form.Control
                                        className="access-input"
                                        type='password'
                                        placeholder='••••••••'
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </Form.Group>

                                <button className="access-btn" type='submit'>
                                    {t('login_btn')}
                                </button>

                                <p className="access-link" onClick={() => navigate('/registro')}>
                                    {t('no_account_question')} <span>{t('register_link')}</span>
                                </p>
                            </Form>
                        </div>
                    </Col>

                    {/* Esta columna la empleamos para la imiagen de un lateral */}
                    <Col className="d-none d-md-block">
                        <div className="access-side-img">
                            <img src='imagen_por_peli/imagen_pelicula_peaky_blinders.webp' alt='Peaky Blinders' />
                        </div>
                    </Col>
                </Row>
            </Container>
            <MensajeModal 
                show={mostrarModal}
                onHide={() => setMostrarModal(false)}
                titulo={tituloModal}
                mensaje={mensajeModal}
                tipo={tipoModal}
            />
        </div>
    );
}
export default Login;