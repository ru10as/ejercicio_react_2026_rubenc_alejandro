import React from "react"; // Aqui importamos el nucleo de React
import { AuthContextType } from "../domain/Usuario";
import { useTranslation } from 'react-i18next';

// ARQUITECTURA HEXAGONAL: SI
// TODO COMPLETADO: NO


const AuthContext = React.createContext<AuthContextType>({ // Aqui lo que vamos a hacer es crear el contenedor de contexto
    // Indicamos que se tiene que usar lo generado en <AuthContextType> => Muy importante
    login: false,       // Estado base de la aplicacion (Al principio no se encuentra logueado)
    language: 'es-ES',  // Estado base de la aplicacion (Siempre estara en castellano)
    idToken: '',        // Estado base de la aplicacion (inicialmente vacio) (hasta que se valide la sesion)
    userID: '',         // Estado base de la aplicacion (inicialmente vacio) (Recordemos que este va a ser el identificador unico del usuario en la base de datos)
    userName:'',        // Estado base de la aplicacion (inicialmente vacio) (Este nombre lo usaremos para personalizar la aplicacion)
    loginAction: (_idToken:string, _localId:string, _name:string) => {},    // Estado base de la aplicacion (en cuanto a funcion)
    logoutAction: () => {}// Estado base de la aplicacion
});
 

export default AuthContext;