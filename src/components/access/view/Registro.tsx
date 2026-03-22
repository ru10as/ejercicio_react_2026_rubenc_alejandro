import { AccessRepository } from "../../../infrastructure/AccessRepository";
import { AccessService } from "../../../services/AuthService";
import AuthContext from "../../../store/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Col, Container, Row, Form } from "react-bootstrap";
import './access.css';
import MensajeModal from "../../ui/MensajeModal";
import { useTranslation } from 'react-i18next';

// ESTRUCTURA HEXAGONAL = SI
// TODO INDICADO CON MENSAJES = SI
// IDIOMAS = SI

function Registro() {

    // Tomamos el contexto que esta almacenado
    const authCtx = useContext(AuthContext);

    // Para poder realizar la navegacion
    const navigate = useNavigate();

    // Para almacenar el email que haya introducido el usuario
    const [email,setEmail] = useState<string>('');

    // Para almacenar la contra que haya introducido el usuario
    const [password, setPassword] = useState<string>('');

    // Para almacenar el nombre con el que se introduce el usuario
    const [username, setUserName] = useState<string>('');

    // Para indicar si vamos a mostrar el mensaje de Modal
    const [mostrarModal, setMostrarModal] = useState(false);

    // Para establecer el tipo de titulo en el Modal (segun si hemos añadido comentario, puntuacion, etc..)
    const [tituloModal, setTituloModal] = useState("");
    
    // Para indicar el tipo de mensaje que aparece en el modal
    const [mensajeModal, setMensajeModal] = useState("");

    // Para almacenar el tipo de modal (si es algo positivo o negativo por asi decir)
    const [tipoModal, setTipoModal] = useState<'success' | 'error'>('success'); 

    // Para todo lo que hay que hacer cuando se lanza aviso
    const lanzamientoAviso = (titulo:string, mensaje:string, tipo: 'success' | 'error') => {
        setTituloModal(titulo);
        setMensajeModal(mensaje);
        setTipoModal(tipo);
        setMostrarModal(true);
    }

    // Para tratar con multiples idiomas
    const {t} = useTranslation();

    // Esta para el envio del formulario 
    const submitHandler  = async (e: React.FormEvent) => {
        e.preventDefault(); 

        try {
            // Empleamos la funcion de infrastructure para el proceso de registro al completo 
            const data = await AccessRepository.registroCompleto(email,password,username);
            
            // Para que el usuario cuando se registre, ya entre
            authCtx.loginAction(data.idToken,data.localId,username);
            
            // Lanzamos el aviso de bienvenida
            lanzamientoAviso(t('welcome'),t('registration_success')+", "+username,"success");

            // Lo mantenemos durante cierto tiempo
            setTimeout(() => {
                navigate("/");
            }, 1500); // REvisar
        }
        catch (error:any){

            // EL error con multiples posibles idiomas
            let codigo = t("unknown_error");

            // Para el codigo asociado al error 
            if (error.response && error.response.data && error.response.data.error){
                codigo = error.response.data.error.message;
            }
            
            // Usamos la funcion definida en el infratructure 
            const mensajeParaUsuario = AccessService.obtenerMensajeError(codigo);

            // Lanzamos el mensaje de error (con el modal)
            lanzamientoAviso(t("auth_error"), mensajeParaUsuario,"error");
        }
    }


    return (
        <div className="access-page">
            <Container>
                <Row className="align-items-center g-4">
                    {/*La imagen de lateral*/}
                    <Col className="d-none d-md-block">
                        <div className="access-side-img">
                            <img src='imagen_por_peli/imagen_pelicula_peaky_blinders.webp' alt='Peaky Blinders' />
                        </div>
                    </Col>

                    {/*Lo que es el formulario*/}
                    <Col xs={12} md={6}>
                        <div className="access-card">
                            <h2 className="access-card-title text-center">{t('register_title')}</h2>
                            <div className="access-card-divider mx-auto"></div>

                            <Form onSubmit={submitHandler}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="access-label">{t('email_label')}</Form.Label>
                                    <Form.Control
                                        className="access-input"
                                        type="email"
                                        placeholder={t('email_placeholder')}
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="access-label">{t('password_label')}</Form.Label>
                                    <Form.Control
                                        className="access-input"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="access-label">{t('username_label')}</Form.Label>
                                    <Form.Control
                                        className="access-input"
                                        type="text"
                                        placeholder={t('example_placeholder')}
                                        value={username}
                                        onChange={(event) => setUserName(event.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <button className="access-btn" type="submit">
                                    {t('register_button')}
                                </button>

                                <p className="access-link" onClick={() => navigate('/login')}>
                                    {t('already_have_account')} <span>{t('login_link')}</span>
                                </p>
                            </Form>
                        </div>
                    </Col>

                    {/*La imagen del lateral*/}
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
    )
}
export default Registro;
