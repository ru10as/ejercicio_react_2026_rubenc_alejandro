// ESTRUCTURA HEXAGONAL = SI
// TODO INDICADO CON MENSAJES = SI
// IDIOMAS = SI

// Contrato para requisitos minimos para el componente Header
export interface HeaderProps{
    // Funcion de callback que se dispara al escribir en la barra de busqueda
    onSearch: (parametro:string) => void;
}