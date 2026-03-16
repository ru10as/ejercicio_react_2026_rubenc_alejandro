import { AccessRepository } from "../../infrastructure/AccessRepository";
import { AccessService } from "../../services/AuthService";
import AuthContext from "../../store/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button, Card, Col, Container, Row, Form } from "react-bootstrap";
import MensajeModal from "../ui/MensajeModal";

// NUEVO METIDO

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
        <div style={{backgroundColor: "#141414", minHeight: "100vh", display:"flex", alignItems:"center"}}>
            <Container>
                <Row>
                    <Col className='text-center'>
                        <div style={{border:"2px solid #2d9d9d", overflow:"hidden", height:"600px"}}>
                            <img src='imagen_por_peli/imagen_pelicula_peaky_blinders.webp' alt='Peaky Blinders' 
                            style={{width:"100%", height:"100%", objectFit:"cover"}}>
                            </img>
                        </div>
                    </Col>

                    <Col>
                        <Row style={{height:"80px"}}>

                        </Row>

                        <Row>
                            <Card style={{backgroundColor:"#2d9d9d"}} className='text-center'>
                                <Card.Body>
                                    <h2 className='text-center fw-bold'>REGISTRARSE</h2>
                                    <Form onSubmit={submitHandler}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold">Email:</Form.Label>
                                            <Form.Control onChange={(event) => setEmail(event.target.value)}
                                                type="email"
                                                value={email}
                                                placeholder="email"
                                                required>
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label className="fw-bold">Contraseña:</Form.Label>
                                            <Form.Control onChange={(event) => setPassword(event.target.value)}
                                                type="password"
                                                value={password}
                                                required>
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label className="fw-bold">Nombre de usuario:</Form.Label>
                                            <Form.Control onChange={(event) => setUserName(event.target.value)}
                                                type="text"
                                                value={username}
                                                placeholder="Ej: Bonjovi87"
                                                required>
                                            </Form.Control>
                                        </Form.Group>
                                        <Button variant="primary" type="submit" className="w-100 mt-3">
                                            VAMOS!!
                                        </Button>
                                    </Form>
                                </Card.Body>  
                            </Card>
                        </Row>
                    </Col>

                    <Col className='text-center'>
                        <div style={{border:"2px solid #2d9d9d", overflow:"hidden", height:"600px"}}>
                            <img src='imagen_por_peli/imagen_pelicula_peaky_blinders.webp' alt='Peaky Blinders' 
                            style={{width:"100%", height:"100%", objectFit:"cover"}}>
                            </img>
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
