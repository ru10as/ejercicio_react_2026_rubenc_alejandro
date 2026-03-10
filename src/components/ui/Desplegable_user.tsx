import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import AuthContext from '../../store/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { useContext } from 'react';


function Desplegable_user() {

    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();

    const cerrar_sesion = () => {
        authCtx.logoutAction();
        navigate('/');
    }

    return (
    <DropdownButton id="dropdown-item-button" title={<i className='bi bi-person-circle'></i>} variant='link'>
        <Dropdown.ItemText></Dropdown.ItemText>
        <Dropdown.Item as="button">Mi cuenta</Dropdown.Item>
        <Dropdown.Item as="button">Ajustes</Dropdown.Item>
        <Dropdown.Item as="button" onClick={cerrar_sesion} className='text-danger'>Cerrar sesion</Dropdown.Item>
    </DropdownButton>
    );
}

export default Desplegable_user;