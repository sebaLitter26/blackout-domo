import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from "@angular/router";
import { BehaviorSubject, Observable, Subject, switchMap } from "rxjs";
import { User } from "../../main";
import { ProfileService } from "../../main/services/profile.service";
import { StationConfigurationService } from "../../station-configuration/services/configuration.service";
import { AuthenticationService } from "../services/authentication.service";

@Injectable()
export class AuthenticationGuardService implements CanActivate, CanLoad {

    private _activateSource: Subject<boolean> = new Subject<boolean>();

    constructor(
        private authenticationService: AuthenticationService,
        private profileService: ProfileService,
        private router: Router,
    ) {}

    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
        // Si no se inicializó el usuario, verifico si está logueado para obtener la data
        if (this.profileService.user.legajo == "") {
            this.authenticationService.tokenSignIn().subscribe({
                next: (userStation) => {
                    this._activateSource.next(true);
                },
                error: (error: HttpErrorResponse) => {
                    this.router.navigate(['sign/in']);
                },
            });
        } else {
            setTimeout(() => {
                this._activateSource.next(true);
            }, 100);
        }

        return this._activateSource.asObservable();
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        // Si no se inicializó el usuario, verifico si está logueado para obtener la data
        if (this.profileService.user.legajo == "") {
            this.authenticationService.tokenSignIn().subscribe({
                next: (userStation) => {
                    this._activateSource.next(true);
                },
                error: (error: HttpErrorResponse) => {
                    this.router.navigate(['sign/in']);
                },
            });
        } else {
            setTimeout(() => {
                this._activateSource.next(true);
            }, 100);
        }

        return this._activateSource.asObservable();
    }
}