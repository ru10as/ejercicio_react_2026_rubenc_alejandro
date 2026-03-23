// ESTRUCTURA HEXAGONAL = SI
// TODO INDICADO CON MENSAJES = SI
// IDIOMAS = SI


// ------------------------------------------------------------
// Aqui es lo que vamos a definir en distintos idiomas (Cade uno de estos se puede definir en cada uno de los 3 idiomas)
export interface InfoIntroducida { 
    titulo:string;
    categoria:string;
    descripcion:string;
}
// ------------------------------------------------------------


// ------------------------------------------------------------
// Contrato para la introduccion de Pelicula
export interface Pelicula { // Nuevo introducido
    // Este va a ser el identificador unico de la pelicula 
    id: number;                
    
    // La nota media de la peli
    calificacion_media: number;

    // La imagen que aparece al principio (cuando se ve el conjunto de cartas en el Home)
    imagen_portada: string;     

    // Esta se va a usar como imagen de fondo cuando establecemos el DetallePelicula
    imagen_en_pelicula: string; 

    // Identificador del archivo de video (revisar)
    video_local: string;        

    // Su fecha de estreno
    fecha_estreno: string;      

    // para indicar si aun no ha salido y saldra proximamente
    proximamente: boolean;     
    
    // Datos de recaudacion (se puede usar en el futuro)
    taquilla: number;          

    // Informacion de la procedencia de la peli
    pais_origen: string;        

    // Mercados donde se ha distribuido la pelicula
    mercados?: any[];           

    // Info en español
    es:InfoIntroducida;

    // Info en ingles
    en:InfoIntroducida;

    // Info en euskera
    eu:InfoIntroducida;

    // Vamos a permitir meter otra key siempre que sea de tipo string
    [key:string]:any;

}
// ------------------------------------------------------------


// ------------------------------------------------------------
// El contrato para la definicion de una pelicula como favorita
export interface PeliFav { 
    // Id GENERADO para la pelicula establecida como favorita (ESTE NO ES EL ID NUMERICO DE CADA PELI)
    id: string,  
        
    // Titulo de la pelicula establecida como favorita      
    titulo: string,   

    // Imagen que aparece al rpincipio
    imagen_portada: string,

    // La pelicula a la que pertenece esta pelicula añadida a peliculas favoritas
    categoria?: string, 

    // id del la pelicula 
    pelicula_id:number
}
// ------------------------------------------------------------


// ------------------------------------------------------------
// Lo empleamos para los objetos que vienen de la base de datos
export interface PeliculaFirebase {
    id: number;          
    titulo: string;    
    
    // Permitimos cierta flexibilidad para adaptarnos a lo que nos devuelve
    [key: string]: any;
}
// ------------------------------------------------------------


// ------------------------------------------------------------
// Para que las listas de peliculas que enviamos a la UI tengan el formato correcto
export interface Props {
    peliculas: PeliculaFirebase[];
}
// ------------------------------------------------------------


// ------------------------------------------------------------
// Datos empleados para el baner de destacados
export interface Pelicula_destacada {
    // Titulo de la pelicula
    titulo: string;

    // Imagen de la pelicula 
    imagen: string;    

    // Descripcion de la misma     
    descripcion: string;
}
// ------------------------------------------------------------


// ------------------------------------------------------------
// Para obtener cada una de las peliculas pero omitiendo el id (es la clave externa y no un campo de interes)
export interface FirebasePelicula { 
    // Proceso de omision
    [key: string]: Omit<Pelicula, "id">;
}
// ------------------------------------------------------------


// ------------------------------------------------------------
// 
export interface FirebaseResponse { 
    // Respuesta con objeto llamado peliculas que tiene la forma de mapeo definida arriba
    peliculas: FirebasePelicula;
}
// ------------------------------------------------------------


// ------------------------------------------------------------
// Contrato para l avisualizacion de la pelicula en pantalla
export interface ModoCineProps {
    // Para el titulo de la peli
    tituloPeli: string;
    
    // Para poder cerrar la ventana que se haya abierto
    onClose: () => void;
}
// ------------------------------------------------------------


// ------------------------------------------------------------
// Contrato para renderizar la carte de la pelicula correspondiente
export interface CardPeliculaprops {
    peli: Pelicula;
    
    // Para indicar si es favorita dicha peli
    isFavorite: boolean;
}
// ------------------------------------------------------------


// ------------------------------------------------------------
// Contrato para el carrusel de destacados
export interface PropsCarousel {
    peliculas: Pelicula[];
}
// ------------------------------------------------------------