import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Container, Row, Form } from "react-bootstrap";
import './access.css';
import { AccessRepository } from "../../../infrastructure/AccessRepository";
import { AccessService } from "../../../services/AuthService";
import AuthContext from "../../../store/AuthContext";
import MensajeModal from "../../ui/MensajeModal";
import { useTranslation } from 'react-i18next';

function Login(){
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();

    const {t} = useTranslation();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);


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


    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            const resAuth = await AccessRepository.login(email, password);
            const idToken = resAuth.data.idToken;
            const localId = resAuth.data.localId;

            // Ahora vamos a obtener el nombre real del usuario que se ha logueado
            const nombreReal = await AccessRepository.obtenerNombreUsuario(localId,idToken);

            authCtx.loginAction(idToken, localId, nombreReal || "Usuario");
            lanzamientoAviso(t('welcome'),t('hello') + ", " + nombreReal, "success");
            setTimeout(() => {
                navigate("/");
            }, 1500);

        } 
        catch(error: any){
            let codigo = "ERROR_DESCONOCIDO";
            if (error.response && error.response.data && error.response.data.error){
                codigo = error.response.data.error.message;
            }

            const mensajeParaUsuario = AccessService.obtenerMensajeError(codigo);
            // alert(mensajeParaUsuario);
            //lanzamientoAviso("Error de acceso",mensajeParaUsuario,"error");
            lanzamientoAviso(t('error_de_acceso'),mensajeParaUsuario,"error");
        }
    }
    return(
        <div className="access-page">
            <Container>
                <Row className="align-items-center g-4">
                    <Col className="d-none d-md-block">
                        <div className="access-side-img">
                            <img src='imagen_por_peli/imagen_pelicula_peaky_blinders.webp' alt='Peaky Blinders' />
                        </div>
                    </Col>

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
                                        placeholder='tu@email.com'
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