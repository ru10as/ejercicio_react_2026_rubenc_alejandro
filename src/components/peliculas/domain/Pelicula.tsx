export interface Pelicula {
    id: number;   
    titulo: string;
    categoria: string;
    taquilla: number;
    video_local: string;
    pais_origen: string;
    mercados?: any[];
    imagen_portada: string;
    imagen_en_pelicula: string;
    calificacion_media: number;
    descripcion: string;
    comentarios?: { usuario: string; texto: string; nota: number }[];
    proximamente: boolean;
    fecha_estreno: string;
}

export interface PeliFav {
    id: string,
    titulo: string,
    imagen_portada: string, 
    categoria?: string
}

export function calcularMedia(comentarios: { nota: number }[] | undefined): number { // ----- ESTO LO VAMOS A ENVIAR A domain/Pelicula.ts ----------
    if (!comentarios || comentarios.length === 0) {
        return 0;
    }
    const suma = comentarios.reduce((acc,curr) => {
        return acc + curr.nota;
    },0);

    const promedio = suma / comentarios.length;
    const resultadoFormateado = promedio.toFixed(1);

    return Number(resultadoFormateado);
}