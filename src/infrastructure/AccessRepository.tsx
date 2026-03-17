// Con este registro lo que estamos buscando es hablar con Firebase
import axios from "axios";
import { UserProfile, UserAuthResponse } from "../domain/User";

// Nuevo introducido

const API_KEY = "AIzaSyBY5z4uU0OUlp9x_ZcaFRICSUe_42GwlOk";
const AUTH_URL = "https://identitytoolkit.googleapis.com/v1/accounts";
const DB_URL = "https://pelis-react-upna-ru-al-default-rtdb.europe-west1.firebasedatabase.app";


export const AccessRepository = {
    login: (email:string, pass: string) => {
        return axios.post<UserAuthResponse>(`${AUTH_URL}:signInWithPassword?key=${API_KEY}`,{
            email:email, password:pass, returnSecureToken: true
        });
    },
    registroCompleto: async(email:string, pass:string, username:string) => {
        // Primero lo que vamos a hacer es introducir este usuario enel Auth
        const resAuth = await axios.post<UserAuthResponse>(`${AUTH_URL}:signUp?key=${API_KEY}`,{
            email:email, 
            password:pass,
            returnSecureToken:true
        })

        // Ahora lo que vamos a hacer es hacer la llamada pero a la base de datos
        const datosUsuario: UserProfile = {
            user:username,
            email:email,
            fecha_registro:new Date().toLocaleDateString('es-ES')
        }

        await axios.put(`${DB_URL}/usuarios/${resAuth.data.localId}.json?auth=${resAuth.data.idToken}`,datosUsuario);

        return resAuth.data;
    }, 
    obtenerNombreUsuario: async(localId:string, idToken:string) => {
        const response = await axios.get(`${DB_URL}/usuarios/${localId}.json?auth=${idToken}`);
        return response.data.user;
    }
}