import axios from "axios";
import { IAccessRepository } from "../domain/IAccessRepository";
import type { UserAuthResponse, UserProfile } from "../domain/Usuario";

const API_KEY = "AIzaSyBY5z4uU0OUlp9x_ZcaFRICSUe_42GwlOk";// Es la clave de acceso a los servicios de Google
const AUTH_URL = "https://identitytoolkit.googleapis.com/v1/accounts";// Es el endpoint para todo lo relacionado con la autenticacion
const DB_URL = "https://pelis-react-upna-ru-al-default-rtdb.europe-west1.firebasedatabase.app";// Url de nuestra realtime database

export const FirebaseAccessRepository: IAccessRepository = {
    // Funcion que vamos a emplear para validar las credenciales en el Firebase Auth
    login: (email, pass) => {
        return axios.post<UserAuthResponse>(`${AUTH_URL}:signInWithPassword?key=${API_KEY}`, {
            email, password: pass, returnSecureToken: true
        });
    },
    // Proceso de registro (Lo haremos en 2 pasos)
    registroCompleto: async (email, pass, username) => {
        const resAuth = await axios.post<UserAuthResponse>(`${AUTH_URL}:signUp?key=${API_KEY}`, { 
            email, password: pass, returnSecureToken: true 
        });
        const datosUsuario: UserProfile = { user: username, email, fecha_registro: new Date().toLocaleDateString('es-ES') };
        await axios.put(`${DB_URL}/usuarios/${resAuth.data.localId}.json?auth=${resAuth.data.idToken}`, datosUsuario);
        return resAuth.data;
    },
    // Queremos recuperar el nombre que se ha puesto el usuario
    obtenerNombreUsuario: async (localId, idToken) => {
        const response = await axios.get(`${DB_URL}/usuarios/${localId}.json?auth=${idToken}`);
        return response.data ? response.data.user : "Usuario";
    },

    saveSession: (token, userId, userName) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('userName', userName);
    },

    getSession: () => {
        return {
            token: localStorage.getItem('token'),
            userId: localStorage.getItem('userId'),
            userName: localStorage.getItem('userName')
        };
    },

    logout: () => {
        localStorage.clear();
    }
};