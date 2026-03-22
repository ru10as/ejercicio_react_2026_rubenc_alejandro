import axios from "axios"; // Importamos axios 
import { FirebaseResponse, type Pelicula } from "../domain/Pelicula"; // importamos el contrato de Pelicula que hemos creado en domain
import { useTranslation } from 'react-i18next';

// ESTRUCTURA HEXAGONAL = SI
// TODO INDICADO CON MENSAJES = SI
// IDIOMAS = SI

// ------------------------------------------------------------------------
// La url a nuestro Realtime database
const BASE_URL = 'https://pelis-react-upna-ru-al-default-rtdb.europe-west1.firebasedatabase.app';
// ------------------------------------------------------------------------

export const PeliculaRepository = {
    // -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
    // 1) Metodo para obtener todas las peliculas de la base de datos
    async getAll(): Promise<Pelicula[]> { 
        try {
            // Hacemos la llamada a Realtime firebase y esperamos a que nos de la respuesta
            const res = await axios.get(`${BASE_URL}/peliculas.json`);

            // Tomamos la respuesta
            const data = res.data;   
            
            // Tomamos la respuesta en trozos por asi decir 
            const entradas = Object.entries(data);  
            
            // Vamos a limpiar cada uno de los trozos
            const listaFormateada = entradas.map((entrada) => {

                // lo que es id va a ser la parte 0 de la entrada 
                const idFirebase = entrada[0];

                // Y lo que es el contenido es el 1
                const datosPelicula = entrada[1] as any;

                // Cuando el trozo este vacio
                if (!datosPelicula || typeof datosPelicula !== 'object') {
                    return null;
                }

                return {
                    // Forzamos el ID a número, pero si falla (NaN), usamos 0 o la key
                    id: isNaN(Number(idFirebase)) ? 0 : Number(idFirebase),
                    ...datosPelicula,                   
                    fecha_estreno: datosPelicula.fecha_estreno || "",  
                    titulo: datosPelicula.titulo || "Sin título",      
                    categoria: datosPelicula.categoria || "General"
                } as Pelicula;                                     
            }).filter(p => p !== null) as Pelicula[];  

            return listaFormateada;
        } catch (error) {
            // Tratamos con el error
            console.error("Error crítico en getAll:", error);
            return [];
        }
    },

    // -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
    // 2) Metodo para obtener una pelicula especifica por su identificador unico
    async getById(id: string): Promise<Pelicula | null>{
        try{
            // Hacemos peticion get para tomar la info de la peli de interes
            const res = await axios.get(`${BASE_URL}/peliculas/${id}.json`); 

            // Obtenemos la respuesta
            const data = res.data;

            // Si no hay nada en la respuesta, devolvemos el null
            if(!data)return null;  

            // Aqui vamos a construir el obtejo que devolvemos
            return{                             
                id: Number(id),                 
                ...data as Record<string, any> 
            } as Pelicula;                      
        }
        catch (error){
            // Tratamos con el error
            console.error("Error al obtener la pelicula por ID",error);
            return null;
        }
    },

    // -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
    // 3) Metodo para recuperar los comentarios asociados a una pelicula especifica
    async getComentarios(pelicula_id:string){
        try{
            // Hacemos una peticion get para tomar el conjunto de comentarios
            const res = await axios.get(`${BASE_URL}/comentarios.json`);
            
            // Tomamos su respuesta
            const data = res.data;

            // Si no hay nada en respuesta, sera que aun no hay comentarios
            if(!data)return [];

            // Array donde vamos a guardar los comentarios de la peli de interes
            const comentarios_filtrados = [];

            for (const key in data){
                // Nos vamos a quedar con los comentarios de esta pelicula
                if(Number(data[key].pelicula_id) === Number(pelicula_id)){  
                    // Lo de dentro del push lo hacemos por si en un futuro queremos eliminar algun comentario  
                    comentarios_filtrados.push({id_firebase:key,...data[key]});
                }
            }
            //
            return comentarios_filtrados;
        }

        catch(error){ 
            // Tratamos con el posible error que pueda darse
            console.error("Error al cargar los comentarios:", error);
            return [];
        }
    },

    // -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
    // 4) Metodo para enviar un comentario escrito a la base de datos
    async saveComentario(nuevoComentario: any){
        // 
        const objetoAGuardar = {
            ...nuevoComentario,
            pelicula_id: Number(nuevoComentario.pelicula_id) 
        };

        // 
        return axios.post(`${BASE_URL}/comentarios.json`, objetoAGuardar);
    },

    // -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
    // 5) Metodo para obtener las valoraciones de una pelicula
    async getPuntuaciones(pelicula_id: string){
        // Realizamos una peticion get para tomar todas las puntuaciones de todas las pelis
        const res = await axios.get(`${BASE_URL}/puntuaciones.json`);
        
        // Tomamos el resultado
        const data = res.data;

        // Si no hay nada, aun no habra ni una puntuacion
        if(!data)return [];

        // Donde vamos a guardar las puntuaciones asociadas a la peli de interes
        const filtradas = [];

        // Recorremos toda la respuesta
        for (const key in data){

            // Si hay coincidencia de ids, estamos ante la peli que nos interes
            if(String(data[key].pelicula_id) === pelicula_id){
                // la añadimos al array
                filtradas.push(data[key]);
            }
        }
        return filtradas;
    },

    // -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
    // 6) Metodo para registrar una puntuacion dada
    async savePuntuacion(nuevaPuntuacion:any){
        // HAcemos el post guardando la nueva puntuacion 
        return axios.post(`${BASE_URL}/puntuaciones.json`,nuevaPuntuacion); 
    },

    // -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
    // 7) Metodo para guardar una peli como favorita (para dicho usuario)
    async saveFavoritos(userId:string, favorito:any){
        // Hacemos el post guardando en dicho userid, en su campo de favoritos, dicha peli
        return axios.post(`${BASE_URL}/usuarios/${userId}/favoritos.json`, favorito);
    },

    // -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
    // 8) Metodo para recuperar la lista de favoritos de un usuario en especifico
    async getFavoritos(userId: string, token: string){ // Pasamos el token para cumplir con las reglas de seguridad
        try{
            // Realizamos peticion get 
            const res = await axios.get(`${BASE_URL}/usuarios/${userId}/favoritos.json?auth=${token}`);
            
            // Almacenamos la respuesta de dicha peticion
            const data = res.data;

            // Caso en que aun no tiene favoritass
            if(!data)return [];

            // Cramos array vacio donde vamos a ir almacenando las peliculas favoritas
            const lista = [];

            // Vamos a ir recorriendo cada uno de esos ids aleatorios que se asocian a cada peli favorita
            for (const key in data){
                // verificamos que tenga contenido
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

    // -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
    // 9) Para eliminar una pelicula de las de favoritos
    async deleteFavorito(userId:string, peliId:string, token:string){
        // Peticion de delete a la url corresnpondiente introduciendo el token 
        const res = await axios.delete(`${BASE_URL}/usuarios/${userId}/favoritos/${peliId}.json?auth=${token}`);
        return res;
    },

    // -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
    // 10) Para tomar la pelicula favorita a partir de su id
    async getFavoritoById (userId:string, token:string): Promise<number[]> {
        try{
            // Hacemos la peticion de get
            const res = await axios.get(`${BASE_URL}/usuarios/${userId}/favoritos.json?auth=${token}`);
            
            // Tomamos la data que devuelve
            const data = res.data;
            
            // Si no devuleve nada, devolvemos vacio
            if (!data) return [];

            // Convertimos el objeto a una lista (para tratar correctamente)
            const listaObjetosConFavoritos = Object.values(data);
            
            // Vamos a mapear la lista que tengamos con los favoritos para tomar su id y pasar a formato numerico (y devolverlo)
            const idFavoritos: number[] = listaObjetosConFavoritos.map((item: any) => {
                const id_tomado = item.pelicula_id
                const id_numerico_tomado = Number(id_tomado);

                return (id_numerico_tomado);
            })

            // Devolvemos todos los ids
            return idFavoritos;

            
        }
        catch(error){
            console.error("Error cargando tus peliculas favoritas",error);
            return [];
        }
    },

    // -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
    // 11) Para la generacion del ranking de las mejores peliculas
    async getTopRanking(): Promise<Pelicula[]> {
        try{
            // Tomamos todas las pelis que existen en la actualidad
            const todasLasPeliculas = await this.getAll();
            
            // Nos quedamos con las que ya han salida y estan en uno de los idiomas
            const PelisFiltradas = todasLasPeliculas.filter(p => !p.proximamente && (p.es || p.en || p.eu));
            
            // nos vamos a ordenar a partir de sus calificaciones
            const PelisFiltradasYordenadas = PelisFiltradas.sort((a,b) => b.calificacion_media - a.calificacion_media);

            return PelisFiltradasYordenadas;
        }
        catch(error){
            console.error("Error al rankear las peliculas",error);
            return[];
        }
    },

    // -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
    // 12)
    async getDestacadas(): Promise<Pelicula[]>{
        try{
            //
            const res = await axios.get(`${BASE_URL}/peliculas.json`);
            
            //
            const data = res.data;

            //
            if(!data) return [];

            //
            let listaSucia: any[] = [];
            
            //
            if(Array.isArray(data)){
                listaSucia = data;
            } 
            else{
                listaSucia = Object.values(data);
            }

            //
            const listaFiltrada = listaSucia.filter((p) => {
                if(p && p.destacada === true){
                    if (p.en || p.es || p.eu){
                        return true;
                    }
                }
                return false;
            })

            //
            const listaFormateada = listaFiltrada.map((p,index) => {
                //
                let idFinal;
                
                //
                if (p.id !== undefined){
                    idFinal = Number(p.id);
                } 
                else{
                    idFinal = index;
                }

                //
                return{
                    ...p,
                    id: idFinal,
                } as Pelicula;
            });

            //
            return listaFormateada;

        }
        catch(error){
            console.log("Error en getDestacadas:",error);
            return [];
        }
    },

    // -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
    // 13) Para tomar el conjunto de peliculas disponibles para mostrar 
    async getAvailableMovies(): Promise<Pelicula[]>{
        try{
            // Tomamos todas las peliculas 
            const todasLasPeliculas = await this.getAll();

            // filtramos quedandonos con las que soportan uno de los idiomas
            const peliculasValidas = todasLasPeliculas.filter(peli => 
                peli && (peli.es || peli.en || peli.eu)
            );

            // Devolvemos todas las pelis validas
            return peliculasValidas;

        }
        catch(error){
            console.log("Error al obtener las available movies", error);
            return[];
        }
    }
}