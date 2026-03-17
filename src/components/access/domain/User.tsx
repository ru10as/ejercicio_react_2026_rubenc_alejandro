export interface UserAuthResponse{
    idToken: string,
    localId: string,
    email:string
}

export interface UserProfile{
    user:string,
    email:string,
    fecha_registro:string
}