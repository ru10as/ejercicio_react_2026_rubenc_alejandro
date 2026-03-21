import React from "react";

// --------------------------------------------------------------------
export function renderEstrellas(nota: number) { // ----- ESTO LO VAMOS A ENVIAR A X ----------
    const estrellasMax = 5;             // Vamos a tratar sobre 5 estrellas en vez de sobre 10
    const valor_sobre_5 = nota / 2;     // Por ello, aqui hacemos el ajuste
    const iconos = [];                  // aqui vamos a almacenar los iconos (el numero de estrellas)

    const estiloEstrellas = {
        fontSize: '2rem',
        textShadow: '0 0 1px rgba(252, 251, 251, 0.93)',
    }

    for (let i = 1; i <= estrellasMax; i++) {                               // Recorremos hasta un maximo de 5 estrellas
        if (i <= valor_sobre_5) {                                           // Damos estrella completa
            iconos.push(<i key={i} className="bi bi-star-fill text-warning me-1" style={estiloEstrellas}></i>);
        } else if (i - 0.5 === valor_sobre_5) {                             // Damos media estrella
            iconos.push(<i key={i} className="bi bi-star-half text-warning me-1" style={estiloEstrellas}></i>);
        } else {                                                            // Damos estrella vacia
            iconos.push(<i key={i} className="bi bi-star text-muted me-1" style={estiloEstrellas}></i>);
        }
    }
    return <span style={{ fontSize: '1.1rem' }}>{iconos}</span>;
}
// -------------------------------------------------------------
