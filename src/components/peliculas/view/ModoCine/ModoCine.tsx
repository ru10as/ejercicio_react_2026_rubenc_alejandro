import { Badge, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import type { Pelicula } from '../../../../domain/Pelicula';
import { ModoCineProps } from '../../../../domain/Pelicula';

// Tratamiento con multiples idiomas = SI
// Arquitectura hexagonal = SI
// Comentarios introducidos = SI

const ModoCine = ({ tituloPeli, onClose }: ModoCineProps) => {

    // Para la gestion del leng
    const {t,i18n} = useTranslation();

    // Para la identificacion del leng (1 de esos 3)
    const lang = i18n.language as 'es' | 'en' | 'eu';

    return (
        <div className='overflow-hidden mb-3'
            style={{backgroundColor:"#000",aspectRatio:"16/9",width:"100%",position:'relative',border:'2px solid black'}}>
            
            {/*Este es para el boton de cierre (mirar la funcion)*/}
            <Button variant='link' onClick={onClose} style={{
                position:'absolute', 
                top:'20px',
                right:'10px',
                zIndex:10,
                color:'white'
            }}> <i className='bi bi-x-lg'></i>
            </Button>

            {/* Esto es lo que es los textos de error*/}
            <div className='d-flex flex-column align-items-center justify-content-center text-center h-100 text-white'>
                <h3>{tituloPeli}</h3>
                <p>
                   {t('copyright_error')}
                </p>

                {/* Etiqueta roja de aviso */}
                <Badge bg='danger' className='text-uppercase'>
                    {t('protected_error')}
                </Badge>

            </div>
        </div>
    );
};

export default ModoCine;