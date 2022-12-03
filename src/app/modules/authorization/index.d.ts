export interface PermissionAuthorizationPayload {
    user: string;
    permiso: string;
    legajo: string;
    password: string;
}

export interface PermissionAuthorizationTaks {
    permission: string;
    title?: string | null;
    message?: string | null;
}