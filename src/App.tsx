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

// ESTRUCTURA HEXAGONAL = SI
// TODO INDICADO CON MENSAJES = SI
// IDIOMAS = SI

function App() {

  // 
  const {t,i18n} = useTranslation();

  // Para ver si hay alguien dentro 
  const [estaLogueado, setEstaLogueado] = useState(false);

  // Es como la llave temporal para Firebase
  const [token, setToken] = useState("");

  // Codigo unico del usuario en la base de datos
  const [uId, setUId] = useState(""); 

  //  Donde vamos a almacenar el nombre que se ha puesto el usuario
  const [userName, setUserName] = useState("");

  // Para la busqueda que vamos a hacer en el Header
  const [busqueda, setBusqueda] = useState("");



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
  // Esta funcion la vamos a implementar para Cerrar sesion 
  const logoutHandler = () => {
    // Cuando le damos a logout, indicamos que ya no esta logueado
    setEstaLogueado(false);      

    // quitamos el token
    setToken("");       

    // quitamos el UId
    setUId("");   

    // Limpiamos el localStorage
    localStorage.clear();        
  }
  // -------------------------------


  // -----------------------------------------------------------------------
  // Ejecutamos esto cuando se carga
  useEffect(() => {
    // Buscamos si en el localStorage tenemos el token guardado
    const tokenGuardado = localStorage.getItem('token');

    // Buscamos si en el localStorage tenemos el userId guardado
    const idGuardado = localStorage.getItem('userId');

    // Tomamos el nombre guardado el en storage local
    const nombreGuardado = localStorage.getItem('userName');

    // Si ambos se dan, esta logueado
    if (tokenGuardado && idGuardado){
      // Indicamos que esta logueado
      setEstaLogueado(true);   
      
      // Almacenamos el token
      setToken(tokenGuardado);   
      
      // Almacenamos el UId
      setUId(idGuardado);      
      
      // Si hay nombre almacenado, entonces lo vamos a guardar en la variable que hemos creado
      if(nombreGuardado) setUserName(nombreGuardado);
    }
  }, []);
  // -----------------------------------------------------------------------

  return (
    <>
      <AuthContext.Provider value={{
        // Compartimos el estado para indicar si hay alguien dentro o no
        login:estaLogueado,     
        
        // Indicamos un valor fijo con el idioma (Castellano)
        language:i18n.language,   
        
        // Le pasamos el token
        idToken:token,     
        
        // Pasamos el ID unico del usuario
        userID:uId,      
        
        // Pasamos la funcion
        loginAction: loginHandler,   

        // Pasamos la funcion (para limpiar)
        logoutAction: logoutHandler, 

        // Pasamos lo que es el nombre de usuario
        userName:userName
      }}>
        <div className='d-flex flex-column min-vh-100'>

          <Header onSearch={setBusqueda}/>
            <div className='flex-grow-1'>
              <Routes>
                {/*Para la ruta principal*/}
                <Route path="/" element={<Home textobuscado={busqueda}/>}/>

                {/*Para el acceso a los usuarios*/}
                <Route path="/login" element={<Login />}></Route>

                {/*Para ir a registrarse*/}
                <Route path="/registro" element={<Registro />}></Route>

                {/*Para ir a la pagina de favoritos*/}
                <Route path="/favoritos" element={<Favoritos />}/>

                {/*Para ir a la pagina de contacto*/}
                <Route path="/contacto" element={<Contacto />}/>

                {/*Para ir a la pagina principal*/}
                <Route path="/home" element={<Home textobuscado={busqueda}/>}/>

                {/*Para ir a la pagina con los detalles de la peli*/}
                <Route path='/pelicula/:id' element={<DetallePelicula />}></Route>

                {/*Para la pagina del aviso legal*/}
                <Route path='/aviso_legal' element={<AvisoLegal />}></Route>

                {/*Para la pagina de top peliculas*/}
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
