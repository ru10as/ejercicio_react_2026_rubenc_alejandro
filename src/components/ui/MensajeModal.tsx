import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import type { AvisoDeProps } from '../../domain/ui';
import { useTranslation } from 'react-i18next';

function MensajeModal(props: AvisoDeProps){

    const {t} = useTranslation();

    return (
    <Modal show={props.show} onHide={props.onHide} centered>
        <Modal.Header closeButton>
            <Modal.Title>{props.titulo}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {props.mensaje}
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={props.onHide}>{t('modal_button_ok')}</Button>
        </Modal.Footer>
    </Modal>
  );
}
export default MensajeModal;