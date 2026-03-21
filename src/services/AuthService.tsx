// YA METIDO
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

// ARQUITECTURA HEXAGONAL: SI
// TODO COMPLETADO: SI

// -----------------------------------------------
export const AccessService = {
    obtenerMensajeError: (codigo: string): string => {
        switch(codigo) {
            case "EMAIL_EXISTS":
                return i18next.t('error_email_exists');
            case "WEAK_PASSWORD":
                return i18next.t('error_weak_password');
            case "INVALID_EMAIL":
                return i18next.t('error_invalid_email');
            case "OPERATION_NOT_ALLOWED":
                return i18next.t('operation_not_allowed');
            default:
                return i18next.t('error_general') + codigo;
        }
    }
}
// ---------------------------------------------------------