import React from "react"; // Aqui importamos el nucleo de React
import { AuthContextType } from "../domain/Usuario";
import { useTranslation } from 'react-i18next';

// ARQUITECTURA HEXAGONAL: SI
// TODO COMPLETADO: NO


// --------- Aqui lo que vamos a hacer es crear el contenedor de contexto ---------
const AuthContext = React.createContext<AuthContextType>({
    // Estado base de la aplicacion (Al principio no se encuentra logueado)
    login: false,
    
    // Estado base de la aplicacion (Siempre estara en castellano)
    language: 'es-ES',
    
    // Estado base de la aplicacion (inicialmente vacio) (hasta que se valide la sesion)
    idToken: '',
    
    // Estado base de la aplicacion (inicialmente vacio) (Recordemos que este va a ser el identificador unico del usuario en la base de datos)
    userID: '',      
    
    // Estado base de la aplicacion (inicialmente vacio) (Este nombre lo usaremos para personalizar la aplicacion)
    userName:'',
    
    // Estado base de la aplicacion (en cuanto a funcion)
    loginAction: (_idToken:string, _localId:string, _name:string) => {},
    
    // Estado base de la aplicacion
    logoutAction: () => {}
});
 
export default AuthContext;