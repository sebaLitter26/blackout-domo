/** Datos del usuario que se encuentra logueado actualmente. */
/* export interface LoginInfo {
    id?: number;
    nombre: string;
    legajo: string;
    perfil?: string;
    password?: string;
    //token: string;
    fotoUrl?: string;
    qr?: string;
    permisos?: string[];
    sucursales: number[];
    Usuario: User | null;
    Grupos: Grupo[] | null;
    ERROR: error | null;
    sessionId: string;
}

export interface Grupo{
    nombre: string;
} */

export interface User {
    id: number;
    nombre: string;
    legajo: string;
    perfil: string;
    password: string;
    token: string;
    fotoUrl: string;
    qr?: string;
    permisos: string[];
}
/* 
export interface error {
    CODIGO: string;
    MENSAJE: string;
} */
