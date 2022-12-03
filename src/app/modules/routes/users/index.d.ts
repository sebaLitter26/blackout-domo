import { Enabled, TipoOperacion } from './model';

/*********** interfaces perfil.*/ 
export interface Profile {
    activo: Enabled;
    descripcion: string;
    fecha_creacion: string;
    id_perfil: number;
    perfil: string;
    permisos: Permission[];
}

export interface ProfilePayload {
    id_perfil: number;
    perfil: string;
    descripcion: string;
    enabled: Enabled;
}

export interface CRUDProfilePayload {
    perfil: string;
    descripcion: string;
}


export interface ProfileProperties {
    perfil: string;
    descripcion: string;
    newPermissionsList: Permission[];
}

export interface ProfileId {
    id_perfil: number;
}

/********** interfaces permiso.*/ 

export interface Permission {
    id_permiso: number;
    permiso: string;
    descripcion: string;
    fecha_creacion: string;
    activo: Enabled;
}

export interface PermissionPayload {
    id_permiso: number;
    permiso: string;
    descripcion: string;
    enabled: Enabled;
}

export interface CRUDPermissionPayload {
    permiso: string;
    descripcion: string;
}

/********** interfaces rol.*/ 
export interface RolePayload{
    id_rol: number;
    rol: string;
    descripcion: string;
    enabled: Enabled;
}

export interface Role {
    activo: Enabled;
    descripcion: string;
    fecha_creacion: string;
    id_rol: number;
    rol: string;
    perfiles: Profile[]
}

export interface RolesProperties {
    rol: string;
    descripcion: string;
    newProfileList: Profile[];
}

export interface CRUDRolePayload{
    rol: string;
    descripcion: string;
}

export interface RoleId {
    id_rol: number;
}

// interfaces / relaciones.
export interface CRUDPermissionProfileRPayload {
    id_perfil: number;
    id_permiso: number;
    tipoOperacion: TipoOperacion;
}

export interface CRUDRoleProfileRPayload {
    id_rol: number;
    id_perfil: number;
    tipoOperacion: TipoOperacion;
}