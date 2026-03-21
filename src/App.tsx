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
import Login from './components/access/view/Login';
import Registro from './components/access/view/Registro';
import AvisoLegal from './pages/AvisoLegal';
import TopPeliculas from './pages/TopPeliculas';
import { useTranslation } from 'react-i18next';
import { HeaderProps } from './domain/Header';
import { HomeProps } from './domain/Home';

// ARQUITECTURA HEXAGONAL: NO
// TODO COMPLETADO: SI


function App() {

  const {t,i18n} = useTranslation();

  // --------------------------------------------------------
  // Para ver si hay alguien dentro por asi decir 
  const [estaLogueado, setEstaLogueado] = useState(false);

  // Es como la llave temporal para Firebase
  const [token, setToken] = useState("");

  // Codigo unico del usuario en la base de datos
  const [uId, setUId] = useState(""); 

  //  Donde vamos a almacenar el nombre que se ha puesto el usuario
  const [userName, setUserName] = useState("");

  // Para la busqueda que vamos a hacer en el Header
  const [busqueda, setBusqueda] = useState("");
  // --------------------------------------------------------


  // ------------------------------------------------------------------------
  // La funcion recibe dos parametros
  const loginHandler = (idToken:string, localId: string, name: string) => {
    // Indicamos a toda la web que alguien ha entrado
    setEstaLogueado(true);

    // Guardamos dato para que este disponible
    setToken(idToken);

    // Guardamos dato para que este disponible
    setUId(localId);

    // Guardamos el token en el localStorage para que no haya problema al refrescar
    localStorage.setItem('token',idToken);

    // Guardamos el token en el localStorage para que no haya problema al refrescar
    localStorage.setItem('userId',localId);

    // Guardamos tambien el nombre del usuario
    localStorage.setItem('userName', name);
    setUserName(name); 
  }
  // ------------------------------------------------------------------------


  // -------------------------------
  //
  const logoutHandler = () => {
    setEstaLogueado(false);       // Cuando le damos a logout, indicamos que ya no esta logueado
    setToken("");                 // quitamos el token
    setUId("");                   // quitamos el UId
    localStorage.clear();         // Limpiamos el localStorage
  }
  // -------------------------------


  // -------------------------------
  // De esta forma evitamos que el usario tenga que escribir el email y contraseña cada vez
  useEffect(() => {
    // Buscamos si en el localStorage tenemos el token guardado
    const tokenGuardado = localStorage.getItem('token');

    // Buscamos si en el localStorage tenemos el userId guardado
    const idGuardado = localStorage.getItem('userId');

    //
    const nombreGuardado = localStorage.getItem('userName');

    // Si ambos se dan, esta logueado
    if (tokenGuardado && idGuardado){
      setEstaLogueado(true);            // Indicamos que esta logueado
      setToken(tokenGuardado);          // Almacenamos el token
      setUId(idGuardado);               // Almacenamos el UId
      if(nombreGuardado) setUserName(nombreGuardado);
    }
  }, []);
  // -------------------------------


  /* interface HeaderProps{
    onSearch: (parametro:string) => void;
  } */

  /* interface HomeProps{
    textobuscado:string;
  } */

  return (
    <>
      <AuthContext.Provider value={{
        login:estaLogueado,           // Compartimos el estado para indicar si hay alguien dentro o no
        language:i18n.language,       // Indicamos un valor fijo con el idioma (Castellano)
        idToken:token,                // Le pasamos el token
        userID:uId,                   // Pasamos el ID unico del usuario
        loginAction: loginHandler,    // Pasamos la funcion
        logoutAction: logoutHandler,  // Pasamos la funcion (para limpiar)
        userName:userName
      }}>
        <div className='d-flex flex-column min-vh-100'>
          <Header onSearch={setBusqueda}/>
            <div className='flex-grow-1'>
              <Routes>
                <Route path="/" element={<Home textobuscado={busqueda}/>}/>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/registro" element={<Registro />}></Route>
                <Route path="/favoritos" element={<Favoritos />}/>
                <Route path="/contacto" element={<Contacto />}/>
                <Route path="/home" element={<Home textobuscado={busqueda}/>}/>
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
