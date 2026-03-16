// NUEVO METIDO

export interface UserAuthResponse{ // Nuevo introducido
    idToken: string,
    localId: string,
    email:string
}

export interface UserProfile{ // Nuevo introducido
    user:string,
    email:string,
    fecha_registro:string
}