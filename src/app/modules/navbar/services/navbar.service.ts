import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NavbarItem } from '..';
import { ProfileService } from '../../main/services/profile.service';

@Injectable()
export class NavbarService {
    /** Evento que se dispara cuando se navega a un item de la barra de navegación. */
    private navigationEventSource: BehaviorSubject<string | null> =
        new BehaviorSubject<string | null>(null);
    navigationEvent: Observable<string | null> =
        this.navigationEventSource.asObservable();

    /** Evento que se dispara cuando se cierra o abre la barra de navegación. */
    private toggleEventSource: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    toggleEvent: Observable<boolean> = this.toggleEventSource.asObservable();

    /** Un `array` con los items de la barra de navegación. */
    navbarItems: NavbarItem[] = [];

    constructor(private profileService: ProfileService) {
        this.profileService.userChangeEvent().subscribe((user) => {
            if (user.legajo) {
                this._initNavbarItems();
            }
        });
    }

    /**
     * Abre o cierra la barra de navegación
     */
    toggle() {
        this.toggleEventSource.next(!this.toggleEventSource.value);
    }

    /**
     * Devuelve los items de navegación del usuario actual
     * @returns `NavbarItem[]`
     */
    getNavbarItems(): NavbarItem[] {
        return this.navbarItems;
    }

    /**
     * Navega a un item de la barra de navegación por ruta
     * @param description la ruta del item
     */
    highlightByRoute(route: string): void {
        this.navigationEventSource.next(route);
    }

    /**
     * Inicializa la barra de navegación con los items correspondientes
     */
    private _initNavbarItems() {
        let preItems: NavbarItem[] = [];

        this.navbarItems = [];
        
        if (this.profileService.hasModuleAccess('users')) {
            preItems.push(this._getUserControl());
        }
        

        if (this.profileService.hasModuleAccess('operations')) {
            preItems.push(this._getOperationsItems());
        }

        if (this.profileService.hasModuleAccess('development')) {
            preItems.push(this._getDevelopmentItems());
        }
        

        for (let item of preItems) {
            if (item.navigationItems.length) {
                this.navbarItems.push(item);
            }
        }
    }

    

    private _getOperationsItems(): NavbarItem {
        let operations: NavbarItem = {
            description: 'Operaciones',
            icon: 'fa fa-fw fa-cog',
            navigationItems: [],
        };

        /* if (this.profileService.hasRouteAccess('delivery-coordination')) {
            operations.navigationItems.push({
                description: 'Gestión de reservas',
                icon: 'fa fa-fw fa-tasks',
                route: 'operations/delivery-coordination',
                checked: false,
            });
        } */

        if (this.profileService.hasRouteAccess('expeditions-control')) {
            operations.navigationItems.push({
                description: 'Mesa de devoluciones',
                icon: 'fa fa-fw fa-route',
                route: 'operations/order-list',
                checked: false,
            });
        }

        return operations;
    }

    private _getDevelopmentItems(): NavbarItem {
        let development: NavbarItem = {
            description: 'Desarrollo',
            icon: 'fa fa-fw fa-bug',
            navigationItems: [],
        };

        if (this.profileService.hasRouteAccess('component-debugging')) {
            development.navigationItems.push({
                description: 'Depuración',
                icon: 'fa fa-fw fa-puzzle-piece',
                route: 'development/component-debugging',
                checked: false,
            });
        }

        if (this.profileService.hasRouteAccess('zpl')) {
            development.navigationItems.push({
                description: 'ZPL',
                icon: 'fa fa-fw fa-horse-head',
                route: 'development/zpl',
                checked: false,
            });
        }

        if (this.profileService.hasRouteAccess('snackbar-tester')) {
            development.navigationItems.push({
                description: 'Snack Bar Tester',
                icon: 'fa fa-fw fa-comment',
                route: 'development/snackbar-tester',
                checked: false,
            });
        }

        return development;
    }

    private _getUserControl(): NavbarItem {
        let users: NavbarItem = {
            description: 'Usuarios',
            icon: 'fa fas fa-users-cog',
            navigationItems: [],
        };

        if (this.profileService.hasRouteAccess('permissions')) {
            users.navigationItems.push({
                description: 'Permisos',
                icon: 'fa fa-address-card',
                route: 'users/permissions',
                checked: false,
            });
        }

        if (this.profileService.hasRouteAccess('profiles')) {
            users.navigationItems.push({
                description: 'Perfiles',
                icon: 'fa far fa-users',
                route: 'users/profiles',
                checked: false,
            });
        }

        if (this.profileService.hasRouteAccess('roles')) {
            users.navigationItems.push({
                description: 'Roles',
                icon: 'fas fa-user-tag',
                route: 'users/roles',
                checked: false,
            });
        }

        return users;
    }
}
