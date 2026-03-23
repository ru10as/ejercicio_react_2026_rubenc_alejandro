import { IPeliculaRepository } from "../domain/IPeliculaRepository";
import { Pelicula } from "../domain/Pelicula";

export const LocalStoragePeliculaRepository: IPeliculaRepository = {
    // 1. Favoritos: Aqui es donde brilla el LocalStorage
    getFavoritos: async (userId: string) => {
        const data = localStorage.getItem(`favs_${userId}`);
        return data ? JSON.parse(data) : [];
    },

    saveFavoritos: async (userId: string, favorito: any) => {
        const data = localStorage.getItem(`favs_${userId}`);
        const favs = data ? JSON.parse(data) : [];
        favs.push(favorito);
        localStorage.setItem(`favs_${userId}`, JSON.stringify(favs));
        return Promise.resolve();
    },

    deleteFavorito: async (userId: string, peliId: string) => {
        const data = localStorage.getItem(`favs_${userId}`);
        if (data) {
            const favs = JSON.parse(data).filter((f: any) => f.id !== peliId);
            localStorage.setItem(`favs_${userId}`, JSON.stringify(favs));
        }
        return Promise.resolve();
    },

    getFavoritoById: async (userId: string) => {
        const data = localStorage.getItem(`favs_${userId}`);
        if (!data) return [];
        const favs = JSON.parse(data);
        return favs.map((f: any) => Number(f.pelicula_id));
    },

    // 2. Metodos de lectura: Podrias devolver un set de datos "falsos" (Mock) para probar
    getAll: async (): Promise<Pelicula[]> => {
        console.log("Cargando desde LocalStorage...");
        return []; // O un array con 2 pelis de prueba
    },

    getById: async () => null,

    // 3. Relleno obligatorio para cumplir la Interfaz (Contracts)
    // Ponemos promesas vacias para que TypeScript no se queje
    getComentarios: async () => [],
    saveComentario: async () => Promise.resolve(),
    getPuntuaciones: async () => [],
    savePuntuacion: async () => Promise.resolve(),
    updateCalificacion: async () => Promise.resolve(),
    getTopRanking: async () => [],
    getDestacadas: async () => [],
    getAvailableMovies: async () => []
};