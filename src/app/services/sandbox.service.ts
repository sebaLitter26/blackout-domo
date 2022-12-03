import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SandboxService {

    private sandboxModeEventSource_: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);
    sandBoxModeEvent: Observable<boolean | null> = this.sandboxModeEventSource_.asObservable();

    environment = environment;

    constructor() {
        const sandboxModeEnabled: boolean = localStorage.getItem("sandbox_mode") == 'true';

        this.sandboxModeEventSource_.next(sandboxModeEnabled);
    }

    /**
     * Activa o desactiva el modo Sandbox.
     */
    toggleSandboxMode(): void {
        this.sandboxModeEventSource_.next(!this.sandboxModeEventSource_.value);
    }

    /**
     * Indica si el modo sandbox está activado o no
     * @returns `true` si el modo sandbox está activado, `false` en caso contrario
     */
    isSandboxMode(): boolean | null {
        // Doble chequeo que no esté en producción
        return !environment.preProduction && !environment.production && this.sandboxModeEventSource_.value;
    }
}
