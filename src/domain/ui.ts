// ESTRUCTURA HEXAGONAL = SI
// TODO INDICADO CON MENSAJES = SI
// IDIOMAS = SI

// ------------------------------------------------------------
export interface AvisoDeProps { // 
    // Esto lo que nos ayuda es a indicar si el modal esta visible o no
    show: boolean,    

    // Funcion que uasamos para cerrar el modal
    onHide: () => void,       

    // Titulo que va a aparecer en el mensaje modal
    titulo: string,           

    // Mensaje que va a aparecer en el mensaje modal
    mensaje: string,            

    // Esto es para elegir el color dependiendo de lo que se ha hecho al pulsar (lo que ha generado)
    tipo?: 'success' | 'error'  
}
// ------------------------------------------------------------