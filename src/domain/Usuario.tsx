// ARQUITECTURA HEXAGONAL: CUMPLIDA
// TODO COMPLETADO: SI

// ------------------------------------------------------------
export interface UserAuthResponse{ // Para tratar con los datos que nos devuelve Firebase tras validar las credenciales
    idToken: string,    // El token de acceso que nos devuelve
    localId: string,    // Identificador unico para el usuario
    email:string        // Correo electronico que ha introducido el usuario al registrarse
}
// ------------------------------------------------------------


// ------------------------------------------------------------
export interface UserProfile{ // Definimos la estructura de la informacion personal que almacenamos
    user:string,            // Nombre de usauario que haya elegido el propio usuario
    email:string,           // Email que haya elegido el propio usuario
    fecha_registro:string   // fecha en la que el usuario se registro
}
// ------------------------------------------------------------


// ------------------------------------------------------------
export interface AuthContextType { // Pasamos a definir lo que seria el contrato por asi decir
    login: boolean,             // O esta logueado o no
    language: string,           // Para establecer el leng global
    idToken: string,            // Es el token que nos devuelve firebase
    userID: string,             // Es el ID unico del usuario para filtrar
    userName: string,           // Nombre que usaremos para referirnos a dicho usuario por toda la web
    loginAction: (idToken:string, localId:string, name:string) => void;
    logoutAction: () => void;
}
// ------------------------------------------------------------