import axios from "axios"; // Importamos axios 
import type { Pelicula } from "../domain/Pelicula"; // importamos el contrato de Pelicula que hemos creado en domain


// ------------------------------------------------------------------------
const BASE_URL = 'https://pelis-react-upna-ru-al-default-rtdb.europe-west1.firebasedatabase.app'; // La url a nuestro Realtime database
// ------------------------------------------------------------------------

export const PeliculaRepository = {
    // -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
    // 1) Metodo para obtener todas las peliculas de la base de datos
    async getAll(): Promise<Pelicula[]> { // Aqui empleamos el Promise para que espere a que le lleguen los datos
        try {
            const res = await axios.get(`${BASE_URL}/peliculas.json`); // Hacemos la llamada a Realtime firebase y esperamos a que nos de la respuesta
            const data = res.data;                  // Tomamos la respuesta
            const entradas = Object.entries(data);  // Tomamos la respuesta en trozos por asi decir 
            
            const listaFormateada = entradas.map((entrada) => { // Vamos a limpiar cada uno de los trozos
                const idFirebase = entrada[0];                  // lo que es id va a ser la parte 0 de la entrada 
                const datosPelicula = entrada[1] as any;        // Y lo que es el contenido es el 1

                if (!datosPelicula || typeof datosPelicula !== 'object') {  // Cuando el trozo este vacio
                    return null;                                            // devolvemos null
                }

                return {
                    id: isNaN(Number(idFirebase)) ? 0 : Number(idFirebase),// Forzamos el ID a número, pero si falla (NaN), usamos 0 o la key
                    ...datosPelicula,                                   // Copiamos todo lo que traia la pelicula
                    fecha_estreno: datosPelicula.fecha_estreno || "",   // Aseguramos que los strings existan para que .includes() no falle en el Home
                    titulo: datosPelicula.titulo || "Sin título",       // En el caso de que no haya titulo, ponemos algo por defecto
                    categoria: datosPelicula.categoria || "General"     // Lo mismo para la categoria
                } as Pelicula;                                          // Importante esto para el tipado
            }).filter(p => p !== null) as Pelicula[];                   // Los trozos nulos por asi decir, los eliminamos 

            return listaFormateada;
        } catch (error) { // Tratamos con el error
            console.error("Error crítico en getAll:", error);
            return [];
        }
    },

    // -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
    // 2) Metodo para obtener una pelicula especifica por su identificador unico
    async getById(id: string): Promise<Pelicula | null>{
        try{
            const res = await axios.get(`${BASE_URL}/peliculas/${id}.json`); // Hacemos peticion get para tomar la info de la peli de interes
            const data = res.data;  // Obtenemos la respuesta
            if(!data)return null;   // Si no hay nada en la respuesta, devolvemos el null

            return{                             // Aqui vamos a construir el obtejo que devolvemos
                id: Number(id),                 // Como id le ponemos el id introducido (pasado a numero por si acaso)
                ...data as Record<string, any>  // Hacemos el Record para que de alguna forma typescript confie en nosotros y no nos de error
            } as Pelicula;                      // Forzamos aqui el tipado 
        }
        catch (error){ // Tratamos con el error
            console.error("Error al obtener la pelicula por ID",error); // REVISAR
            return null;
        }
    },
    // -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
    // 3) Metodo para recuperar los comentarios asociados a una pelicula especifica
    async getComentarios(pelicula_id:string){ // Queremos pillar los comentarios de la pelicula con ese id
        try{
            const res = await axios.get(`${BASE_URL}/comentarios.json`); // Hacemos una peticion get para tomar el conjunto de comentarios
            const data = res.data;              // Tomamos su respuesta
            if(!data)return [];                 // Si no hay nada en respuesta, sera que aun no hay comentarios
            const comentarios_filtrados = [];   // Array donde vamos a guardar los comentarios de la peli de interes

            for (const key in data){
                if(String(data[key].pelicula_id) === pelicula_id){              // Nos vamos a quedar con los comentarios de esta pelicula
                    comentarios_filtrados.push({id_firebase:key,...data[key]}); // Lo de dentro del push lo hacemos por si en un futuro queremos eliminar algun comentario
                }
            }

            return comentarios_filtrados;
        }

        catch(error){ // Tratamos con el posible error que pueda darse
            console.error("Error al cargar los comentarios:", error);
            return [];
        }
    },

    // -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
    // 4) Metodo para enviar un comentario escrito a la base de datos
    async saveComentario(nuevoComentario: any){
        return axios.post(`${BASE_URL}/comentarios.json`, nuevoComentario);
    },

    // -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
    // 5) Metodo para obtener las valoraciones de una pelicula
    async getPuntuaciones(pelicula_id: string){
        const res = await axios.get(`${BASE_URL}/puntuaciones.json`); // Realizamos una peticion get para tomar todas las puntuaciones de todas las pelis
        const data = res.data;  // Tomamos el resultado
        if(!data)return [];     // Si no hay nada, aun no habra ni una puntuacion
        const filtradas = [];   // Donde vamos a guardar las puntuaciones asociadas a la peli de interes

        for (const key in data){            // Recorremos toda la respuesta
            if(String(data[key].pelicula_id) === pelicula_id){ // Si hay coincidencia de ids, estamos ante la peli que nos interes
                filtradas.push(data[key]);  // la añadimos al array
            }
        }
        return filtradas;
    },

    // -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
    // 6) Metodo para registrar una puntuacion dada
    async savePuntuacion(nuevaPuntuacion:any){
        return axios.post(`${BASE_URL}/puntuaciones.json`,nuevaPuntuacion); // HAcemos el post guardando la nueva puntuacion 
    },

    // -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
    // 7) Metodo para guardar una peli como favorita (para dicho usuario)
    async saveFavoritos(userId:string, favorito:any){
        return axios.post(`${BASE_URL}/usuarios/${userId}/favoritos.json`, favorito); // Hacemos el post guardando en dicho userid, en su campo de favoritos, dicha peli
    },

    // -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
    // 8) Metodo para recuperar la lista de favoritos de un usuario en especifico
    async getFavoritos(userId: string, token: string){ // Pasamos el token para cumplir con las reglas de seguridad
        try{
            const res = await axios.get(`${BASE_URL}/usuarios/${userId}/favoritos.json?auth=${token}`); // Realizamos peticion get 
            const data = res.data;  // Almacenamos la respuesta de dicha peticion
            if(!data)return [];     // Caso en que aun no tiene favoritas
            const lista = [];       // Cramos array vacio donde vamos a ir almacenando las peliculas favoritas

            for (const key in data){    // Vamos a ir recorriendo cada uno de esos ids aleatorios que se asocian a cada peli favorita
                if(data[key].titulo !== undefined){ // verificamos que tenga contenido
                    lista.push({
                        id:key,         // Guardamos como id la key (por si luego por ejemplo queremos eliminar esta peli)
                        ...data[key]    // Tomamos todas las propiedades de la pelicula establecida como favorita
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

    // -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
    // 9)
    async deleteFavorito(userId:string, peliId:string, token:string){
        const res = await axios.delete(`${BASE_URL}/usuarios/${userId}/favoritos/${peliId}.json?auth=${token}`);
        return res;
    },

    // -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
    // 10)
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
}