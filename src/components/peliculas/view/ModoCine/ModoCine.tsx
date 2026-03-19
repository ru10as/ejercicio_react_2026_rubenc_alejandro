import { Badge, Button } from 'react-bootstrap';

interface ModoCineProps {
    tituloPeli: string;
    onClose: () => void;
}

const ModoCine = ({ tituloPeli, onClose }: ModoCineProps) => {
    return (
        <div className='overflow-hidden mb-3'
        style={{
            backgroundColor:"#000",
            aspectRatio:"16/9",
            width:"100%",
            position:'relative',
            border:'2px solid black'
        }}>
            <Button variant='link' onClick={onClose} style={{
                position:'absolute', // Esto tenemos que meterlo seguro pa tratar con el relative de arriab
                top:'20px',
                right:'10px',
                zIndex:10, // FALTABA ESTO PARA PONER LA X ARRIBA !!!! 
                color:'white'
            }}> <i className='bi bi-x-lg'></i>
            </Button>

            <div className='d-flex flex-column align-items-center justify-content-center text-center h-100 text-white'>
                <h3>{tituloPeli}</h3>
                <p>
                   Esta pelicula no puede ser reproducida debido a derechos de autor 
                </p>
                {/* Lo que meto aqu lo voy a hacer para que, como no podemos poner pelis por derechos, tener de momento algo */}
                <Badge bg='danger' className='text-uppercase'>
                    Contenido protegido
                </Badge>

            </div>
        </div>
    );
};

export default ModoCine;