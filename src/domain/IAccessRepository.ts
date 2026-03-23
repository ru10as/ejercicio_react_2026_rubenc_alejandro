import { UserAuthResponse } from "./Usuario";

export interface IAccessRepository {
    // 1) Validar credenciales (Login)
    login(email: string, pass: string): Promise<any>;

    // 2) Crear usuario y perfil en base de datos (Registro)
    registroCompleto(email: string, pass: string, username: string): Promise<UserAuthResponse>;

    // 3) Recuperar metadatos del usuario (Nombre, etc.)
    obtenerNombreUsuario(localId: string, idToken: string): Promise<string>;

    // getSession(): { userId: string | null, token: string | null };

    // Las de sesion
    saveSession(token: string, userId: string, userName: string): void;
    getSession(): { token: string | null; userId: string | null; userName: string | null };
    logout(): void;
}