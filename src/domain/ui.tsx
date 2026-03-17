export interface AvisoDeProps {
    show: boolean,
    onHide: () => void,
    titulo: string,
    mensaje: string,
    tipo?: 'success' | 'error'
}