export const AccessService = {
    obtenerMensajeError: (codigo: string): string => {
        switch(codigo) {
            case "EMAIL_EXISTS":
                return "El correo ya esta en uso. Prueba con otro o haz login";
            case "WEAK_PASSWORD":
                return "La contraseña es muy corta. Pon al menos 6 caracteres.";
            case "INVALID_EMAIL":
                return "El formato del correo no es correcto (falta @ o punto).";
            case "OPERATION_NOT_ALLOWED":
                return "El registro con contraseña está desactivado en Firebase.";
            default:
                return "Ha ocurrido un error tecnico: " + codigo;
        }
    }
}