import { Pelicula } from "./Pelicula";

export interface IPeliculaRepository {
    // 1) Obtener todas
    getAll(): Promise<Pelicula[]>;

    // 2) Obtener por ID
    getById(id: string): Promise<Pelicula | null>;

    // 3 y 4) Comentarios
    getComentarios(pelicula_id: string): Promise<any[]>;
    saveComentario(nuevoComentario: any): Promise<any>;

    // 5, 6 y 6b) Puntuaciones
    getPuntuaciones(pelicula_id: string): Promise<any[]>;
    savePuntuacion(nuevaPuntuacion: any): Promise<any>;
    updateCalificacion(id: string, media: number): Promise<any>;

    // 7, 8, 9 y 10) Favoritos
    saveFavoritos(userId: string, favorito: any): Promise<any>;
    getFavoritos(userId: string, token: string): Promise<any[]>;
    deleteFavorito(userId: string, peliId: string, token: string): Promise<any>;
    getFavoritoById(userId: string, token: string): Promise<number[]>;

    // 11, 12 y 13) Listados especiales
    getTopRanking(): Promise<Pelicula[]>;
    getDestacadas(): Promise<Pelicula[]>;
    getAvailableMovies(): Promise<Pelicula[]>;
}