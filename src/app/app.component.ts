import { Component, HostBinding, OnInit } from '@angular/core';
import { AppThemeService } from './app-theme.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    
    @HostBinding("class")
    componentClass: string = "";

    constructor(
        private appThemeService: AppThemeService,
    ) {
    }

    ngOnInit() {
        this.appThemeService.themeEvent.subscribe((theme: string) => {
            this.setAppTheme(theme);
        });
    }

    /**
     * Cambia el tema de colores actual de la aplicación.
     * @param theme el tema de colores
     */
    setAppTheme(theme: string): void {
        this.componentClass = theme;
    }
}
