/* import { useContext, useState } from 'react';
import { useCol } from 'react-bootstrap/esm/Col';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, Alert, CardBody, FormGroup } from 'react-bootstrap';
import AuthContext from '../../store/AuthContext';

function Login(){
    const [email,setEmail] = useState('');
    const [passwd,setPasswd] = useState('');
    const [error, setError] = useState<string | null>(null);
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();

    const API_KEY = "AIzaSyBY5z4uU0OUlp9x_ZcaFRICSUe_42GwlOk";

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const authData = {
            email:email,
            password: passwd,
            returnSecureToken:true
        };

        axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, authData)
            .then((res) => {
                authCtx.loginAction(res.data.idToken,res.data.localId);
                navigate('/');
            })
            .catch((err) => {
                let codigoError = "";
                if (err.response){
                    if (err.response.data){
                        if (err.response.data.error){
                            codigoError = err.response.data.error.message;
                        }
                    }
                }

                if (codigoError === "EMAIL_NOT_FOUND" || codigoError === "INVALID_LOGIN_CREDENTIALS") {
                    setError("El correo o la contraseña no son correctos.");
                }
                else if (codigoError === "INVALID_PASSWORD"){
                    setError("La contraseña es incorrecta. Vuelve a introducirla");
                }
                else if (codigoError === "USER_DISABLED"){
                    setError("Esta cuenta ha sido desactivada por el administrador");
                }
                else{
                    setError("Error de Firebase: " + codigoError);
                }
            })
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


                    <Col xs={6}>
                        <Row style={{height:"100px"}}>

                        </Row>

                        <Row>
                            <Card style={{backgroundColor:"#2d9d9d"}} className='text-center'>
                            <Card.Body>
                                <h2 className='text-center fw-bold'>LOGIN</h2>
                                {error && <Alert variant="danger" className="mt-2 py-1 small">{error}</Alert>}
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
                                            type='password' placeholder='Introduce tu contraseña' value={passwd} onChange={e => setPasswd(e.target.value)}>   
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
        </div>
    );
}

export default Login; */