import axios from "axios";
import { useContext, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, CardBody, FormGroup } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import AuthContext from "../../store/AuthContext";

function Registro(){
    // -----------------------------------------------------------
    const navigate = useNavigate();                             // 
    const authCtx = useContext(AuthContext);                    // 
    const [email, setEmail] = useState<string>('');             // 
    const [password, setPassword] = useState<string>('');       // 
    const [username, setUsername] = useState<string>('');       //
    const API_KEY = "AIzaSyBY5z4uU0OUlp9x_ZcaFRICSUe_42GwlOk";  // 
    // -------------------------------------------------------

    const submitHandler = (event: React.FormEvent) => {
        event.preventDefault();     // Evitamos que la pagina se recargue al enviar el formulario
        
        const authData = {          // 
            email: email,           // 
            password: password,     // 
            returnSecureToken: true // Vamos a pedir a firebase que nos devuelva el token de acceso
        }

        axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`, authData)
        .then((response) => {
            
            const uid = response.data.localId;      // El ID unico generado
            const idToken = response.data.idToken;  // El token de seguridad para esta sesion

            const datosDeUsuarioParaBD = {                              // 
                nombre:username,                                        // Nombre que ha elegido el usuario
                email:email,                                            // 
                fecha_registro: new Date().toLocaleDateString('es-ES'), //
                favoritos:{init: true}                                  // Damos un inicio al favoritos para que no este vacio
            };

            return axios.put(`https://pelis-react-upna-ru-al-default-rtdb.europe-west1.firebasedatabase.app/usuarios/${uid}.json?auth=${idToken}`,datosDeUsuarioParaBD)
                .then(()=>{
                    // console.log('OK - Token:', idToken, 'UID:', uid); // Esto solo lo hacemos para pruebas
                    authCtx.loginAction(idToken, uid, username);
                    navigate("/home");
                }
            )
        })
      .catch((error) => {
            let codigoError = "";

            if (error.response){                                        // Si se ha respondido el servidor con algun codigo de error
                if (error.response.data){                               // Comprobamos si la respuesta contiene ciertos datos
                    if (error.response.data.error){                     // Vemos si tenemos el objeto error
                        codigoError = error.response.data.error.message;// Guardamos el tipo de error
                    }                                                  
                }                                         
            }                                                           

            let mensajeParaUsuario = "";

            if (codigoError === "EMAIL_EXISTS"){ // Usuario ha intentado registrarse con un email que ya esta registrado
                mensajeParaUsuario = "El correo ya esta en uso. Prueba con otro o haz login";
            }
            else if (codigoError === "WEAK_PASSWORD") { // Contra pobre
                mensajeParaUsuario = "La contraseña es muy corta. Pon al menos 6 caracteres.";
            } 
            else if (codigoError === "INVALID_EMAIL") { // El usuario ha escrito mal el email
                mensajeParaUsuario = "El formato del correo no es correcto (falta @ o punto).";
            } 
            else if (codigoError === "OPERATION_NOT_ALLOWED") { // Un error de configuracion
                mensajeParaUsuario = "El registro con contraseña está desactivado en Firebase.";
            } 
            else { 
                mensajeParaUsuario = "Ha ocurrido un error tecnico: " + codigoError;
            }

            alert(mensajeParaUsuario); // Revisar si vamos a poner esto 
        });
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
                                            <Form.Control onChange={(event) => setUsername(event.target.value)}
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
        </div>
    )
}
export default Registro;