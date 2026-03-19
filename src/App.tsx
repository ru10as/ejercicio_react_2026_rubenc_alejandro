import { Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react'; 

import './App.css';
import Contacto from './pages/Contacto';
import Home from './pages/Home';
import DetallePelicula from './pages/DetallePelicula';
import Footer from './components/ui/Footer';
import Header from './components/ui/Header';
import AuthContext from './store/AuthContext';
import Favoritos from './pages/Favoritos';
import Login from './components/access/Login';
import Registro from './components/access/Registro';
import AvisoLegal from './pages/AvisoLegal';
import TopPeliculas from './components/peliculas/view/TopPeliculas';
 

function App() {

  // --------------------------------------------------------
  const [estaLogueado, setEstaLogueado] = useState(false);  // Para ver si hay alguien dentro por asi decir 
  const [token, setToken] = useState("");                   // Es como la llave temporal para Firebase
  const [uId, setUId] = useState("");                       // Codigo unico del usuario en la base de datos
  const [userName, setUserName] = useState("");             //  Donde vamos a almacenar el nombre que se ha puesto el usuario
  // --------------------------------------------------------


  // ------------------------------------------------------------------------
  const loginHandler = (idToken:string, localId: string, name: string) => { // La funcion recibe dos parametros
    setEstaLogueado(true);                                                  // Indicamos a toda la web que alguien ha entrado
    setToken(idToken);                                                      // Guardamos dato para que este disponible
    setUId(localId);                                                        // Guardamos dato para que este disponible
    localStorage.setItem('token',idToken);                                  // Guardamos el token en el localStorage para que no haya problema al refrescar
    localStorage.setItem('userId',localId);                                 // Guardamos el token en el localStorage para que no haya problema al refrescar
    setUserName(name);                                                      // Guardamos tambien el nombre del usuario
  }
  // ------------------------------------------------------------------------


  // -------------------------------
  const logoutHandler = () => {   //
    setEstaLogueado(false);       // Cuando le damos a logout, indicamos que ya no esta logueado
    setToken("");                 // quitamos el token
    setUId("");                   // quitamos el UId
    localStorage.clear();         // Limpiamos el localStorage
  }
  // -------------------------------

  
  useEffect(() => {                                         // De esta forma evitamos que el usario tenga que escribir el email y contraseña cada vez
    const tokenGuardado = localStorage.getItem('token');    // Buscamos si en el localStorage tenemos el token guardado
    const idGuardado = localStorage.getItem('userId');      // Buscamos si en el localStorage tenemos el userId guardado

    if (tokenGuardado && idGuardado){   // Si ambos se dan, esta logueado
      setEstaLogueado(true);            // Indicamos que esta logueado
      setToken(tokenGuardado);          // Almacenamos el token
      setUId(idGuardado);               // Almacenamos el UId
    }
  }, []);

  return (
    <>
      <AuthContext.Provider value={{
        login:estaLogueado,           // Compartimos el estado para indicar si hay alguien dentro o no
        language:'es-ES',             // Indicamos un valor fijo con el idioma (Castellano)
        idToken:token,                // Le pasamos el token
        userID:uId,                   // Pasamos el ID unico del usuario
        loginAction: loginHandler,    // Pasamos la funcion
        logoutAction: logoutHandler,   // Pasamos la funcion (para limpiar)
        userName:userName
      }}>
        <div className='d-flex flex-column min-vh-100'>
          <Header />
            <div className='flex-grow-1'>
              <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/registro" element={<Registro />}></Route>
                <Route path="/favoritos" element={<Favoritos />}/>
                <Route path="/contacto" element={<Contacto />}/>
                <Route path="/home" element={<Home />}/>
                <Route path='/pelicula/:id' element={<DetallePelicula />}></Route>
                <Route path='/aviso_legal' element={<AvisoLegal />}></Route>
                <Route path='/top-peliculas' element={<TopPeliculas />}></Route>

              </Routes>
            </div>
        <Footer />
        </div>
      </AuthContext.Provider>

      
      
    </>
  )
}

export default App
