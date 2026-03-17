import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface AvisoDeProps {
    show: boolean,
    onHide: () => void,
    titulo: string,
    mensaje: string,
    tipo?: 'success' | 'error'
}

function MensajeModal(props: AvisoDeProps){
    return (
    <Modal show={props.show} onHide={props.onHide} centered>
        <Modal.Header closeButton>
            <Modal.Title>{props.titulo}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {props.mensaje}
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={props.onHide}>Entendido</Button>
        </Modal.Footer>
    </Modal>
  );
}
export default MensajeModal;