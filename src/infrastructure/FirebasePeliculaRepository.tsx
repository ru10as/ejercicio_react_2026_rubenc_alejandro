import axios from "axios";
import { type Pelicula } from "../domain/Pelicula";
import { IPeliculaRepository } from "../domain/IPeliculaRepository";

// ------------------------------------------------------------------------
const BASE_URL = 'https://pelis-react-upna-ru-al-default-rtdb.europe-west1.firebasedatabase.app';
// ------------------------------------------------------------------------

export const FirebasePeliculaRepository: IPeliculaRepository = {
    
    // 1) Obtener todas las peliculas
    async getAll(): Promise<Pelicula[]> { 
        try {
            const res = await axios.get(`${BASE_URL}/peliculas.json`);
            const data = res.data;   
            if (!data) return [];

            const entradas = Object.entries(data);  
            
            return entradas.map((entrada) => {
                const idFirebase = entrada[0];
                const datosPelicula = entrada[1] as any;

                if (!datosPelicula || typeof datosPelicula !== 'object') return null;

                return {
                    id: isNaN(Number(idFirebase)) ? 0 : Number(idFirebase),
                    ...datosPelicula,                   
                    fecha_estreno: datosPelicula.fecha_estreno || "",  
                    titulo: datosPelicula.titulo || "Sin título",      
                    categoria: datosPelicula.categoria || "General"
                } as Pelicula;                                     
            }).filter(p => p !== null) as Pelicula[];  

        } catch (error) {
            console.error("Error crítico en getAll:", error);
            return [];
        }
    },

    // 2) Obtener por ID
    async getById(id: string): Promise<Pelicula | null> {
        try {
            const res = await axios.get(`${BASE_URL}/peliculas/${id}.json`); 
            const data = res.data;
            if (!data) return null;  

            return {                                 
                id: Number(id),                 
                ...data as Record<string, any> 
            } as Pelicula;                      
        } catch (error) {
            console.error("Error al obtener la pelicula por ID", error);
            return null;
        }
    },

    // 3) Comentarios
    async getComentarios(pelicula_id: string) {
        try {
            const res = await axios.get(`${BASE_URL}/comentarios.json`);
            const data = res.data;
            if (!data) return [];

            const comentarios_filtrados = [];
            for (const key in data) {
                if (Number(data[key].pelicula_id) === Number(pelicula_id)) {  
                    comentarios_filtrados.push({ id_firebase: key, ...data[key] });
                }
            }
            return comentarios_filtrados;
        } catch (error) { 
            console.error("Error al cargar los comentarios:", error);
            return [];
        }
    },

    // 4) Guardar Comentario
    async saveComentario(nuevoComentario: any) {
        const objetoAGuardar = {
            ...nuevoComentario,
            pelicula_id: Number(nuevoComentario.pelicula_id) 
        };
        return axios.post(`${BASE_URL}/comentarios.json`, objetoAGuardar);
    },

    // 5) Puntuaciones
    async getPuntuaciones(pelicula_id: string) {
        const res = await axios.get(`${BASE_URL}/puntuaciones.json`);
        const data = res.data;
        if (!data) return [];

        const filtradas = [];
        for (const key in data) {
            if (String(data[key].pelicula_id) === pelicula_id) {
                filtradas.push(data[key]);
            }
        }
        return filtradas;
    },

    // 6) Guardar Puntuación
    async savePuntuacion(nuevaPuntuacion: any) {
        return axios.post(`${BASE_URL}/puntuaciones.json`, nuevaPuntuacion);
    },

    // 6b) Actualizar Media
    async updateCalificacion(id: string, media: number) {
        return axios.patch(`${BASE_URL}/peliculas/${id}.json`, { calificacion_media: media });
    },

    // 7) Guardar Favorito
    async saveFavoritos(userId: string, favorito: any) {
        return axios.post(`${BASE_URL}/usuarios/${userId}/favoritos.json`, favorito);
    },

    // 8) Obtener Favoritos
    async getFavoritos(userId: string, token: string) {
        try {
            const res = await axios.get(`${BASE_URL}/usuarios/${userId}/favoritos.json?auth=${token}`);
            const data = res.data;
            if (!data) return [];

            const lista = [];
            for (const key in data) {
                if (data[key].titulo !== undefined) {
                    lista.push({ id: key, ...data[key] });
                }
            }
            return lista;
        } catch (error) {
            console.error("Error al obtener favoritos", error);
            return [];
        }
    },

    // 9) Eliminar Favorito
    async deleteFavorito(userId: string, peliId: string, token: string) {
        return axios.delete(`${BASE_URL}/usuarios/${userId}/favoritos/${peliId}.json?auth=${token}`);
    },

    // 10) IDs de Favoritos
    async getFavoritoById(userId: string, token: string): Promise<number[]> {
        try {
            const res = await axios.get(`${BASE_URL}/usuarios/${userId}/favoritos.json?auth=${token}`);
            const data = res.data;
            if (!data) return [];

            const listaObjetosConFavoritos = Object.values(data);
            return listaObjetosConFavoritos.map((item: any) => Number(item.pelicula_id));
        } catch (error) {
            console.error("Error cargando tus peliculas favoritas", error);
            return [];
        }
    },

    // 11) Para aplica el top Ranking
    async getTopRanking(): Promise<Pelicula[]> {
        try {
            const todasLasPeliculas = await this.getAll();
            const PelisFiltradas = todasLasPeliculas.filter(p => !p.proximamente && (p.es || p.en || p.eu));
            return PelisFiltradas.sort((a, b) => b.calificacion_media - a.calificacion_media);
        } catch (error) {
            console.error("Error al rankear las peliculas", error);
            return [];
        }
    },

    // 12) Destacadas
    async getDestacadas(): Promise<Pelicula[]> {
        try {
            const res = await axios.get(`${BASE_URL}/peliculas.json`);
            const data = res.data;
            if (!data) return [];

            const listaSucia = Array.isArray(data) ? data : Object.values(data);

            const listaFiltrada = listaSucia.filter((p: any) => 
                p && p.destacada === true && (p.en || p.es || p.eu)
            );

            return listaFiltrada.map((p, index) => ({
                ...p,
                id: p.id !== undefined ? Number(p.id) : index,
            })) as Pelicula[];

        } catch (error) {
            console.error("Error en getDestacadas:", error);
            return [];
        }
    },

    // 13) Para tomar el conjunto de peliculas disponibles para mostrar 
    async getAvailableMovies(): Promise<Pelicula[]> {
        try {
            const todasLasPeliculas = await this.getAll();
            return todasLasPeliculas.filter(peli => peli && (peli.es || peli.en || peli.eu));
        } catch (error) {
            console.error("Error al obtener las available movies", error);
            return [];
        }
    }
};