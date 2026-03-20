// ARQUITECTURA HEXAGONAL: CUMPLIDA
// TODO COMPLETADO: SI

// ------------------------------------------------------------
export interface AvisoDeProps { // 
    show: boolean,              // Esto lo que nos ayuda es a indicar si el modal esta visible o no
    onHide: () => void,         // Funcion que uasamos para cerrar el modal
    titulo: string,             // Titulo que va a aparecer en el mensaje modal
    mensaje: string,            // Mensaje que va a aparecer en el mensaje modal
    tipo?: 'success' | 'error'  // Esto es para elegir el color dependiendo de lo que se ha hecho al pulsar (lo que ha generado)
}
// ------------------------------------------------------------