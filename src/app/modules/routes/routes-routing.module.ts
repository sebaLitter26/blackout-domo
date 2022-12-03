import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthorizationModule } from "../authorization/authorization.module";
import { AuthorizationGuard } from "../authorization/guards/authorization-guard.service";

const routes: Routes = [
    {
        path: 'help-desk',
        loadChildren: () => import('./help-desk/ticket.module').then(m => m.TicketModule),
        canActivateChild: [ AuthorizationGuard ],
    },
    {
        path: 'development',
        loadChildren: () => import('./development/development.module').then(m => m.DevelopmentModule),
        canActivateChild: [ AuthorizationGuard ],
    },
    {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(m => m.UserModule),
        canActivateChild: [ AuthorizationGuard ],
    },
    {
        path: 'users',
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
        canActivateChild: [ AuthorizationGuard ],
    },
    {
        path: '',
        redirectTo: '/help-desk/order-list',
        pathMatch: 'full'
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        AuthorizationModule,
    ],
    exports: [
        RouterModule,
    ],
})
export class RoutesRoutingModule {}
