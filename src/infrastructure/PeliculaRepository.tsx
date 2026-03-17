import axios from "axios";
import type { Pelicula } from "../domain/Pelicula";

// NUEVO METIDO

// ------------------------------------------------------------------------
const BASE_URL = 'https://pelis-react-upna-ru-al-default-rtdb.europe-west1.firebasedatabase.app';
// ------------------------------------------------------------------------

export const PeliculaRepository = {
    // ------------------------------------------------------------------------
    async getAll(): Promise<Pelicula[]> {
        try {
            const res = await axios.get(`${BASE_URL}/peliculas.json`);
            const data = res.data;
            const entradas = Object.entries(data);
            
            const listaFormateada = entradas.map((entrada) => {
                const idFirebase = entrada[0];
                const datosPelicula = entrada[1] as any;

                if (!datosPelicula || typeof datosPelicula !== 'object') {
                    return null;
                }

                return {
                    // Forzamos el ID a número, pero si falla (NaN), usamos 0 o la key
                    id: isNaN(Number(idFirebase)) ? 0 : Number(idFirebase),
                    ...datosPelicula,
                    // Aseguramos que los strings existan para que .includes() no falle en el Home
                    fecha_estreno: datosPelicula.fecha_estreno || "",
                    titulo: datosPelicula.titulo || "Sin título",
                    categoria: datosPelicula.categoria || "General"
                } as Pelicula;
            }).filter(p => p !== null) as Pelicula[];

            return listaFormateada;
        } catch (error) {
            console.error("Error crítico en getAll:", error);
            return [];
        }
    },
    // ------------------------------------------------------------------------


    // ------------------------------------------------------------------------
    async getById(id: string): Promise<Pelicula | null>{
        try{
            const res = await axios.get(`${BASE_URL}/peliculas/${id}.json`);
            const data = res.data;

            if(!data){
                return null;
            }

            return{
                id: Number(id),
                ...data as Record<string, any>
            } as Pelicula;
        }
        catch (error){
            console.error("Error al obtener la pelicula por ID",error);
            return null;
        }
    },
    // ------------------------------------------------------------------------


    // ------------------------------------------------------------------------
    async getComentarios(pelicula_id:string){ // Queremos pillar los comentarios de la pelicula con ese id
        try{
            const res = await axios.get(`${BASE_URL}/comentarios.json`);
            const data = res.data;

            if(!data){
                return [];
            }

            const comentarios_filtrados = [];
            for (const key in data){
                if(String(data[key].pelicula_id) === pelicula_id){              // Nos vamos a quedar con los comentarios de esta pelicula
                    comentarios_filtrados.push({id_firebase:key,...data[key]}); // Lo de dentro del push lo hacemos por si en un futuro queremos eliminar algun comentario
                }
            }

            return comentarios_filtrados;
        }

        catch(error){
            console.error("Error al cargar los comentarios:", error);
            return [];
        }
    },
    // ------------------------------------------------------------------------


    // ------------------------------------------------------------------------
    async saveComentario(nuevoComentario: any){
        return axios.post(`${BASE_URL}/comentarios.json`, nuevoComentario);
    },
    // ------------------------------------------------------------------------


    // ------------------------------------------------------------------------
    async getPuntuaciones(pelicula_id: string){
        const res = await axios.get(`${BASE_URL}/puntuaciones.json`);
        const data = res.data;

        if(!data)return [];

        const filtradas = [];
        for (const key in data){
            if(String(data[key].pelicula_id) === pelicula_id){
                filtradas.push(data[key]);
            }
        }
        return filtradas;
    },
    // ------------------------------------------------------------------------


    // ------------------------------------------------------------------------
    async savePuntuacion(nuevaPuntuacion:any){
        return axios.post(`${BASE_URL}/puntuaciones.json`,nuevaPuntuacion);
    },
    // ------------------------------------------------------------------------


    // ------------------------------------------------------------------------
    async saveFavoritos(userId:string, favorito:any){
        return axios.post(`${BASE_URL}/usuarios/${userId}/favoritos.json`, favorito);
    },
    // ------------------------------------------------------------------------


    // Para la obtencion de los favoritos del usuario
    // ------------------------------------------------------------------------
    async getFavoritos(userId: string, token: string){
        try{
            const res = await axios.get(`${BASE_URL}/usuarios/${userId}/favoritos.json?auth=${token}`);
            const data = res.data;

            if(!data)return []; // No tiene favoritos aun

            const lista = [];
            for (const key in data){
                if(data[key].titulo !== undefined){
                    lista.push({
                        id:key,
                        ...data[key]
                    });
                }
            }
            return lista;
        }
        catch(error:any){
            console.error("Error al obtener favoritos",error);
            return [];
        }
    },
    // ------------------------------------------------------------------------


    // ------------------------------------------------------------------------
    async deleteFavorito(userId:string, peliId:string, token:string){
        const res = await axios.delete(`${BASE_URL}/usuarios/${userId}/favoritos/${peliId}.json?auth=${token}`);
        return res;
    },
    // ------------------------------------------------------------------------


    // ----------------------------------------------------------
    async getFavoritoById (userId:string, token:string): Promise<number[]> {
        try{
            const res = await axios.get(`${BASE_URL}/usuarios/${userId}/favoritos.json?auth=${token}`);
            const data = res.data;
            if (!data) return [];

            const listaObjetosConFavoritos = Object.values(data);
            
            const idFavoritos: number[] = listaObjetosConFavoritos.map((item: any) => {
                const id_tomado = item.pelicula_id
                const id_numerico_tomado = Number(id_tomado);

                return (id_numerico_tomado);
            })

            return idFavoritos;

            
        }
        catch(error){
            console.error("Error cargando tus peliculas favoritas",error);
            return [];
        }
    }
    // ----------------------------------------------------------

}