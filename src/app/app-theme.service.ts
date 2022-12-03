import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';
import { AppTheme } from "./app-theme.enum";

@Injectable({
    providedIn: 'root',
})
export class AppThemeService {

    /** Evento disparado cuando se cambia el esquema de colores de la aplicación. */
    private themeEventSource: BehaviorSubject<string> = new BehaviorSubject<string>(AppTheme.APP_DARK);
    themeEvent: Observable<string> = this.themeEventSource.asObservable();

    constructor() {}

    /**
     * Dispara el evento de cambio de esquema de colores.
     * @param theme el esquema de colores
     */
    setColorTheme(theme: string) {
        this.themeEventSource.next(theme);
    }
}