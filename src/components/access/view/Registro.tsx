import { AccessRepository } from "../infrastructure/AccessRepository";
import { AccessService } from "../service/AccessService";
import AuthContext from "../../../store/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Col, Container, Row, Form } from "react-bootstrap";
import './access.css';
import MensajeModal from "../../ui/MensajeModal";


function Registro() {
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();
    const [email,setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [username, setUserName] = useState<string>('');

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


    const submitHandler  = async (e: React.FormEvent) => {
        e.preventDefault(); 

        try {
            const data = await AccessRepository.registroCompleto(email,password,username);
            authCtx.loginAction(data.idToken,data.localId,username);
            lanzamientoAviso("¡Bienvenido!", `Registro completado, ${username}`, "success");
            setTimeout(() => {
                navigate("/");
            }, 1500);
        }
        catch (error:any){
            let codigo = "ERROR_DESCONOCIDO";
            if (error.response && error.response.data && error.response.data.error){
                codigo = error.response.data.error.message;
            }

            const mensajeParaUsuario = AccessService.obtenerMensajeError(codigo);
            // alert(mensajeParaUsuario);
            lanzamientoAviso("Error de acceso",mensajeParaUsuario,"error");

        }
    }


    return (
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
                            <h2 className="access-card-title text-center">Registro</h2>
                            <div className="access-card-divider mx-auto"></div>

                            <Form onSubmit={submitHandler}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="access-label">Email</Form.Label>
                                    <Form.Control
                                        className="access-input"
                                        type="email"
                                        placeholder="tu@email.com"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="access-label">Contraseña</Form.Label>
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
                                    <Form.Label className="access-label">Nombre de usuario</Form.Label>
                                    <Form.Control
                                        className="access-input"
                                        type="text"
                                        placeholder="Ej: Bonjovi87"
                                        value={username}
                                        onChange={(event) => setUserName(event.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <button className="access-btn" type="submit">
                                    Crear cuenta
                                </button>

                                <p className="access-link" onClick={() => navigate('/login')}>
                                    ¿Ya tienes cuenta? <span>Inicia sesión</span>
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
    )
}
export default Registro;
