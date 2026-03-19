import axios from "axios";
import type { UserProfile,UserAuthResponse } from "../domain/Usuario";

// REVISADO POR COMPLETO

// ------------------------------------------------------------------------------------------
const API_KEY = "AIzaSyBY5z4uU0OUlp9x_ZcaFRICSUe_42GwlOk";                                      // Es la clave de acceso a los servicios de Google
const AUTH_URL = "https://identitytoolkit.googleapis.com/v1/accounts";                          // Es el endpoint para todo lo relacionado con la autenticacion
const DB_URL = "https://pelis-react-upna-ru-al-default-rtdb.europe-west1.firebasedatabase.app"; // Url de nuestra realtime database
// ------------------------------------------------------------------------------------------


export const AccessRepository = {
    // -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
    login: (email:string, pass: string) => { // Funcion que vamos a emplear para validar las credenciales en el Firebase Auth
        // Vamos a realizar una peticion POST con el email y la contra
        // Ademas usamos la <UserAuthResponse> para que se tipe correctamente la respuesta
        return axios.post<UserAuthResponse>(`${AUTH_URL}:signInWithPassword?key=${API_KEY}`,{
            email:email, password:pass, returnSecureToken: true // Con este ultimo parametro le pedimos a firebase que nos devuelva el token
        });
    },

    // -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
    registroCompleto: async(email:string, pass:string, username:string) => { // Proceso de registro (Lo haremos en 2 pasos)
        // 1) Creamos el usuario en el sistema de autenticacion de goggle (con el signUp porque es nuevo)
        const resAuth = await axios.post<UserAuthResponse>(`${AUTH_URL}:signUp?key=${API_KEY}`,{ 
            email:email, 
            password:pass,
            returnSecureToken:true // De nuevo pedimos que nos devuelva el token
        })
        // 2) Ahora lo que vamos a hacer es hacer la llamada pero a la base de datos
        const datosUsuario: UserProfile = { // Vamos a seguir la interfaz de Userprofile definida en domain
            user:username,
            email:email,
            fecha_registro:new Date().toLocaleDateString('es-ES')
        }

        // 3) Guardamos los datos generados previamente en su lugar dentro de nuestro Realtime database
        await axios.put(`${DB_URL}/usuarios/${resAuth.data.localId}.json?auth=${resAuth.data.idToken}`,datosUsuario);
        return resAuth.data; // Devolvemos los datos de autenticacion para que el Contexto los use
    },

    // -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
    obtenerNombreUsuario: async(localId:string, idToken:string) => { // Queremos recuperar el nombre que se ha puesto el usuario
        const response = await axios.get(`${DB_URL}/usuarios/${localId}.json?auth=${idToken}`); // Consultamos al nodo especifico de nuestro Realtime Database
        return response.data ? response.data.user : "Usuario"; // hay que REVISAR esto
    }
}