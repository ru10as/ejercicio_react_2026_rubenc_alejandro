import { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthContext from "../store/AuthContext";

// ------------------------------------------------------------------------
interface PeliFav {
    id: string,
    titulo: string,
    imagen_portada: string, 
    categoria?: string
}
// ------------------------------------------------------------------------


// ------------------------------------------------------------------------
function Favoritos(){

    // ------------------------------------------------------
    const [misFavs, setMisFavs] = useState<PeliFav[]>([]);  // Definimos donde vamos a guardar el conjunto de Peliculas favoritas del usuario
    const authCtx = useContext(AuthContext);                // Almacenamos la informacion que se ha obtenido una vez el usuario ha introducido
    const userId = authCtx.userID;                          // Extraemos el codigo unico del usuario
    const token = authCtx.idToken;                          // 
    // ------------------------------------------------------

    // ----------------------------------------------------------------------------------------------------------------
    useEffect(() => {
        if (userId && token){
            const url = `https://pelis-react-upna-ru-al-default-rtdb.europe-west1.firebasedatabase.app/usuarios/${userId}/favoritos.json?auth=${token}`;
            axios.get(url) // La url lo que va a tener es el indicativo a los favoritos del usuario que se encuentra ahora dentro
            .then(res => {
                if (res.data){  
                    const lista = Object.entries(res.data).map(([key, value]: any) => ({ // Vamos a almacenar el formato de id (el aleatorio que generamos) y como value todo lo demas
                        id: key, // Tenemos que guardar el id por si luego queremos tratar con el, por ejemplo si queremos eliminar esa peli favorita 
                        ...value
                    }));
                    // setMisFavs(lista); // Almacenamos el conjunto de peliculas favoritas

                    const peliculasValidas = lista.filter(peli => peli.titulo !== undefined); // Vamos a hacer esto para evitar problemas de indices
                    setMisFavs(peliculasValidas);
                }
                else {
                    setMisFavs([]);
                }
            })
            .catch(err => {
                console.error("Error al obtener favoritos:", err);
                
            });
        }
    }, [userId,token])

    const eliminarFavorito = (peliId: string) => { // Tenemos que meter el peliId aqui 
        const url = `https://pelis-react-upna-ru-al-default-rtdb.europe-west1.firebasedatabase.app/usuarios/${userId}/favoritos/${peliId}.json?auth=${token}`;

        axios.delete(url)
        .then(() => {
            setMisFavs((listaAnterior) => {
                const listaNueva = listaAnterior.filter(p => p.id !== peliId);  // Seleccionamos todos menos el que tiene ese id que es el que vamos a eliminar de la lista
                return listaNueva;  // Devolvemos la nueva lista la cual no tiene ya esa pelicula favorita
            });
        })
        .catch((err) => {
            console.error("Ha habido un error al eliminar la peli:",err);
            alert("No se pudo eliminar la pelicula"); // Este para pruebas, cuando eso se eliminara
        })
    }
    return (
        <Container className="text-center">
            <h1 className="text-white mb-4 mt-4">Mis Favoritos</h1>
            <Row>
                {misFavs.map((peli) => (
                    <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
                        <div className="card h-100 bg-secundary border-0 shadow">
                            <img src={peli.imagen_portada} alt={peli.titulo} style={{ height: '350px', objectFit: 'cover' }}>
                            </img>
                            <div className="card-body d-flex flex-column">
                                <h5 className="">{peli.titulo}</h5>
                                <p className="small mb-2 text-info">{peli.categoria}</p>
                                <Link to={`/pelicula/${peli.id}`}>
                                    <Button>
                                        Ver detalles
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
        </Container>
    )
}
export default Favoritos;