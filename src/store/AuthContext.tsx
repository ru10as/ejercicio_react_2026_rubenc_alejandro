import React from "react";

interface AuthContextType {
    login: boolean,
    language: string,
    idToken: string,
    userID: string,
    loginAction: (idToken:string, localId:string) => void;
    logoutAction: () => void;
}
const AuthContext = React.createContext<AuthContextType>({
    login: false, // Al inicio por defecto nadie esta logueado (Habra que iniciar sesion)
    language: 'es-ES',
    idToken: '',
    userID: '',
    loginAction: (_idToken:string, _localId:string) => {},
    logoutAction: () => {}
});
 

export default AuthContext;