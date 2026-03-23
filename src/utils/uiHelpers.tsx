// --------------------------------------------------------------------
export function renderEstrellas(nota: number) { 
    // Vamos a tratar sobre 5 estrellas en vez de sobre 10
    const estrellasMax = 5; 

    // Por ello, aqui hacemos el ajuste        
    const valor_sobre_5 = nota / 2; 

    // aqui vamos a almacenar los iconos (el numero de estrellas)
    const iconos = [];                  

    // Definimos el estilo de las estrellas 
    const estiloEstrellas = {
        fontSize: '2rem',
        textShadow: '0 0 1px rgba(252, 251, 251, 0.93)',
    }

    // Recorremos hasta un maximo de 5 estrellas
    for (let i = 1; i <= estrellasMax; i++) {
        // Damos estrella completa                             
        if (i <= valor_sobre_5) {                                          
            iconos.push(<i key={i} className="bi bi-star-fill text-warning me-1" style={estiloEstrellas}></i>);
        } // Damos media estrella
        else if (i - 0.5 === valor_sobre_5) {                            
            iconos.push(<i key={i} className="bi bi-star-half text-warning me-1" style={estiloEstrellas}></i>);
        } // Damos estrella vacia
        else {                                                         
            iconos.push(<i key={i} className="bi bi-star text-muted me-1" style={estiloEstrellas}></i>);
        }
    }
    return <span style={{ fontSize: '1.1rem' }}>{iconos}</span>;
}
// -------------------------------------------------------------
