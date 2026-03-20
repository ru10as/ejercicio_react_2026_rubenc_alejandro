// ARQUITECTURA HEXAGONAL: CUMPLIDA
// TODO COMPLETADO: SI


// ------------------------------------------------------------
export interface InfoIntroducida { // Aqui es lo que vamos a definir en distintos idiomas 
    titulo:string;
    categoria:string;
    descripcion:string;
}
// ------------------------------------------------------------


// ------------------------------------------------------------
export interface Pelicula { // Nuevo introducido
    id: number;                 // Este va a ser el identificador unico de la pelicula 
    calificacion_media: number; // La nota media de la peli
    imagen_portada: string;     // La imagen que aparece al principio (cuando se ve el conjunto de cartas en el Home)
    imagen_en_pelicula: string; // Esta se va a usar como imagen de fondo cuando establecemos el DetallePelicula
    video_local: string;        // Identificador del archivo de video (revisar)
    fecha_estreno: string;      // Su fecha de estreno
    proximamente: boolean;      // para indicar si aun no ha salido y saldra proximamente
    taquilla: number;           // Datos de recaudacion (se puede usar en el futuro)
    pais_origen: string;        // Informacion de la procedencia de la peli
    mercados?: any[];           // Mercados donde se ha distribuido la pelicula

    es:InfoIntroducida;
    en:InfoIntroducida;
    eu:InfoIntroducida;

    [key:string]:any;

}
// ------------------------------------------------------------


// ------------------------------------------------------------
export interface PeliFav { 
    id: string,             // Id GENERADO para la pelicula establecida como favorita (ESTE NO ES EL ID NUMERICO DE CADA PELI)
    titulo: string,         // Titulo de la pelicula establecida como favorita
    imagen_portada: string, // Imagen que aparece al rpincipio
    categoria?: string,     // La pelicula a la que pertenece esta pelicula añadida a peliculas favoritas
    pelicula_id:number      // id del la pelicula 
}
// ------------------------------------------------------------


// ------------------------------------------------------------
export interface PeliculaFirebase {// Lo empleamos para los objetos que vienen de la base de datos
    id: number;         // 
    titulo: string;     // 
    [key: string]: any; // Permitimos cierta flexibilidad para adaptarnos a lo que nos devuelve
}
// ------------------------------------------------------------


// ------------------------------------------------------------
export interface Props {    // Para que las listas de peliculas que enviamos a la UI tengan el formato correcto
    peliculas: PeliculaFirebase[];
}
// ------------------------------------------------------------


// ------------------------------------------------------------
export interface Pelicula_destacada {   // Datos empleados para el baner de destacados
    titulo: string;         // Titulo de la pelicula
    imagen: string;         // Imagen de la pelicula 
    descripcion: string;    // Descripcion de la misma
}
// ------------------------------------------------------------


// ------------------------------------------------------------
export interface FirebasePelicula { // Para obtener cada una de las peliculas pero omitiendo el id (es la clave externa y no un campo de interes)
    [key: string]: Omit<Pelicula, "id">;    // Proceso de omision
}
// ------------------------------------------------------------


// ------------------------------------------------------------
export interface FirebaseResponse { // 
  peliculas: FirebasePelicula;          // Respuesta con objeto llamado peliculas que tiene la forma de mapeo definida arriba
}
// ------------------------------------------------------------