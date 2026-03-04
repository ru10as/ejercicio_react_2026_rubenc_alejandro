import axios from "axios";
import { useContext, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../../web-peliculas-upna-v2/src/store/AuthContext";


function Registro(){
    const navigate = useNavigate();
    const authCtx = useContext(AuthContext); // 

    const [email, setEmail] = useState<string>(''); // 
    const [password, setPassword] = useState<string>(''); // 

    const API_KEY = "AIzaSyBY5z4uU0OUlp9x_ZcaFRICSUe_42GwlOk"; // 

    const submitHandler = (event: React.FormEvent) => {
        event.preventDefault();
        
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        }

        axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`, authData)
        .then((response) => {
            console.log("Respuesta de Firebase:", response.data);
            authCtx.loginAction(response.data.idToken, response.data.localId); // Empleamos la funcion la cual...
            
            // props.actualizaLogin(true, response.data);
            navigate("/home");
        })
      .catch((error) => {
            let codigoError = "";

            if (error.response){
                if (error.response.data){
                    if (error.response.data.error){
                        codigoError = error.response.data.error.message;
                    }
                }
            }

            let mensajeParaUsuario = "";

            if (codigoError === "EMAIL_EXISTS"){
                mensajeParaUsuario = "El correo ya esta en uso. Prueba con otro o haz login";
            }
            else if (codigoError === "WEAK_PASSWORD") {
                mensajeParaUsuario = "La contraseña es muy corta. Pon al menos 6 caracteres.";
            } 
            else if (codigoError === "INVALID_EMAIL") {
                mensajeParaUsuario = "El formato del correo no es correcto (falta @ o punto).";
            } 
            else if (codigoError === "OPERATION_NOT_ALLOWED") {
                mensajeParaUsuario = "El registro con contraseña está desactivado en Firebase.";
            } 
            else {
                mensajeParaUsuario = "Ha ocurrido un error tecnico: " + codigoError;
            }

            alert(mensajeParaUsuario);
            // Revisar aqui si falta algo
        });
    }

    return (
        <Form onSubmit={submitHandler} className="mt-4">
            <Container>
                <Row>
                    <Col md={4}>
                        <Form.Label>Email:</Form.Label>
                        <Form.Control
                            onChange={(event) => setEmail(event.target.value)}
                            type="email"
                            value={email}
                            placeholder="email"
                        ></Form.Control>
                    </Col>
                    <Col>
                        <Form.Label>Password:</Form.Label>
                        <Form.Control
                            onChange={(event) => setPassword(event.target.value)}
                            type="password"
                            value={password}
                        ></Form.Control>
                    </Col>
                    <Col>
                        <Button variant="primary" type="submit" className="w-100">
                            REGISTRARSE
                        </Button>
                    </Col>
                </Row>
            </Container>
        </Form>
    )
}
export default Registro;