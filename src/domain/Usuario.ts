// ESTRUCTURA HEXAGONAL = SI
// TODO INDICADO CON MENSAJES = SI
// IDIOMAS = SI

// ------------------------------------------------------------
// Para tratar con los datos que nos devuelve Firebase tras validar las credenciales
export interface UserAuthResponse{ 
    // El token de acceso que nos devuelve
    idToken: string,    

    // Identificador unico para el usuario
    localId: string,    

    // Correo electronico que ha introducido el usuario al registrarse
    email:string        
}
// ------------------------------------------------------------


// ------------------------------------------------------------
// Definimos la estructura de la informacion personal que almacenamos
export interface UserProfile{
    // Nombre de usauario que haya elegido el propio usuario 
    user:string,           
    
    // Email que haya elegido el propio usuario
    email:string,   

    // fecha en la que el usuario se registro
    fecha_registro:string  
}
// ------------------------------------------------------------


// ------------------------------------------------------------
// Pasamos a definir lo que seria el contrato por asi decir
export interface AuthContextType {
    // O esta logueado o no
    login: boolean,         
    
    // Para establecer el leng global
    language: string,       

    // Es el token que nos devuelve firebase
    idToken: string,        

    // Es el ID unico del usuario para filtrar
    userID: string,           

    // Nombre que usaremos para referirnos a dicho usuario por toda la web
    userName: string,      
    
    // Funcion para el login
    loginAction: (idToken:string, localId:string, name:string) => void;

    // Funcion para cerrar sesion
    logoutAction: () => void;
}
// ------------------------------------------------------------