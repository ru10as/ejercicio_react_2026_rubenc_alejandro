import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Container, Row, Form, Alert } from "react-bootstrap";
import { AccessRepository } from "../../infrastructure/AccessRepository";
import { AccessService } from "../../services/AuthService";
import AuthContext from "../../store/AuthContext";
import MensajeModal from "../ui/MensajeModal";

// NUEVO METIDO

function Login(){
    const authCtx = useContext(AuthContext);                                // Accedemos al contexto que existe de la autenticacion 
    const navigate = useNavigate();                                         // Iniciamos la herramienta para navegar
    const [email, setEmail] = useState<string>('');                         // Estado para almacenar el email que escriba el usuario
    const [password, setPassword] = useState<string>('');                   // Estado para la contraseña introducida
    const [errorMsg, setErrorMsg] = useState<string | null>(null);          // Para guardar mensajes de error
    const [mostrarModal, setMostrarModal] = useState(false);                    // Para indicar si vamos a mostrar el mensaje de Modal
    const [tituloModal, setTituloModal] = useState("");                         // Para establecer el tipo de titulo en el Modal (segun si hemos añadido comentario, puntuacion, etc..)
    const [mensajeModal, setMensajeModal] = useState("");                       // Para indicar el tipo de mensaje que aparece en el modal
    const [tipoModal, setTipoModal] = useState<'success' | 'error'>('success'); // Tipo de modal que se va a introducir
    const lanzamientoAviso = (titulo:string, mensaje:string, tipo: 'success' | 'error') => {// Funcion para disparar el aviso visual
        setTituloModal(titulo);     // Establecemos el titulo
        setMensajeModal(mensaje);   // El mensaje
        setTipoModal(tipo);         // El tipo de modal
        setMostrarModal(true);      // Indicar que vamos a mostrar el modal
    }


    const submitHandler = async (e: React.FormEvent) => {   //
        e.preventDefault();                                 // De esta forma vamos a evitar que la pagina se recargue
        try{
            const resAuth = await AccessRepository.login(email, password);  // Utilizamos la funcion creada para hacer el login
            const idToken = resAuth.data.idToken;       // Obtenemos el token del resultado dado
            const localId = resAuth.data.localId;       // Obtenemos el id del resultado dado
            const nombreReal = await AccessRepository.obtenerNombreUsuario(localId,idToken);    // Ahora vamos a obtener el nombre real del usuario que se ha logueado

            authCtx.loginAction(idToken, localId, nombreReal || "Usuario");                             // Guardamos todo en el contexto global
            lanzamientoAviso("¡Bienvenido!", `Hola de nuevo, ${nombreReal || 'Usuario'}`, "success");   // Sacamos el mensaje modal para que el usuario se entere
            setTimeout(() => {
                navigate("/");
            }, 1500);  // Vamos a volver a la home tras 1.5 seg

        } 
        catch(error: any){                      // Tratamos con el error
            let codigo = "ERROR_DESCONOCIDO";   // Inicialmente establecemos el error desconocido
            if (error.response && error.response.data && error.response.data.error){
                codigo = error.response.data.error.message;
            }

            const mensajeParaUsuario = AccessService.obtenerMensajeError(codigo); 
            // alert(mensajeParaUsuario); // Solo para pruebas
            lanzamientoAviso("Error de acceso",mensajeParaUsuario,"error");

        }
    }
    return(
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


                    <Col xs={6}>
                        <Row style={{height:"100px"}}>

                        </Row>

                        <Row>
                            <Card style={{backgroundColor:"#2d9d9d"}} className='text-center'>
                            <Card.Body>
                                <h2 className='text-center fw-bold'>LOGIN</h2>
                                <Form onSubmit={submitHandler}>
                                    <Form.Group className='mt-2 mb-2'>
                                        <Form.Label className='fw-bold'>Email:</Form.Label>
                                        <Form.Control 
                                            type='email' placeholder='Introduce tu email' value={email} onChange={e => setEmail(e.target.value)}>
                                        </Form.Control>
                                    </Form.Group>

                                    <Form.Group className='mt-2 mb-2'>
                                        <Form.Label className='fw-bold'>Contraseña:</Form.Label>
                                        <Form.Control
                                            type='password' placeholder='Introduce tu contraseña' value={password} onChange={e => setPassword(e.target.value)}>   
                                        </Form.Control>
                                    </Form.Group>

                                    <Button className='mt-2 mb-2' type='submit'>
                                        ¡¡VAMOS!!
                                    </Button>

                                    <div className='text-center'>
                                        <small style={{cursor:"pointer", color:"black"}} onClick={() => navigate('/registro')}>
                                            ¿No tienes cuenta? Registrate
                                        </small>
                                    </div>
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
    );
}
export default Login;