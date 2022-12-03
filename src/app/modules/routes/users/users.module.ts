import { NgModule } from '@angular/core';
import { ProfilesComponent } from './profiles/profiles.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { RolesComponent } from './roles/roles.component';
import { Routes, RouterModule } from '@angular/router';
import { DynamicTableModule } from '../../ui/dynamic-table/dynamic-table.module';
import { CheckBoolComponent } from './permissions/components/check-bool/check-bool.component';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { CoolDirectivesModule } from '../../ui/cool-input/cool-directives/cool-directives.module';
import { SharedModule } from '../../shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogCreateComponent } from './permissions/components/dialog-create/dialog-create.component';
import { DialogEditPermissionsComponent } from './permissions/components/dialog-edit-permissions/dialog-edit-permissions.component';
import { DialogEditProfilesComponent } from './profiles/components/dialog-edit-profiles/dialog-edit-profiles.component';
import { AssociatedPermissionsComponent } from './profiles/components/associated-permissions/associated-permissions.component';
import { DialogCreateProfileComponent } from './profiles/components/dialog-create-profile/dialog-create-profile.component';
import { DialogEditRolesComponent } from './roles/components/dialog-edit-roles/dialog-edit-roles.component';
import { DialogCreateRoleComponent } from './roles/components/dialog-create-role/dialog-create-role.component';
import { AssociatedProfilesComponent } from './roles/components/associated-profiles/associated-profiles.component';
import { PermissionsListComponent } from './permissions-list/permissions-list.component';
import { LoadersModule } from '../../ui/loaders/loaders.module';
import { ProfilesListComponent } from './profiles-list/profiles-list.component';
import { DynamicTableColumnMenuModule } from '../../common/dynamic-table-column-menu/dynamic-table-column-menu.module';
import { RolesListComponent } from './roles-list/roles-list.component';
import { PermissionsService } from './services/permissions.service';
import { ProfilesService } from './services/profiles.service';
import { DynamicSearchModule } from '../../ui/dynamic-search/dynamic-search.module';
import { RolesService } from './services/roles.service';


const routes: Routes = [
  {
    path: 'permissions',
    component: PermissionsComponent
  },
  {
    path: 'profiles',
    component: ProfilesComponent
  },
  {
    path: 'roles',
    component: RolesComponent
  }
]

@NgModule({
  declarations: [
    ProfilesComponent,
    PermissionsComponent,
    RolesComponent,
    CheckBoolComponent,
    DialogEditPermissionsComponent,
    DialogCreateComponent,
    DialogEditProfilesComponent,
    AssociatedPermissionsComponent,
    DialogCreateProfileComponent,
    DialogEditRolesComponent,
    DialogCreateRoleComponent,
    AssociatedProfilesComponent,
    PermissionsListComponent,
    ProfilesListComponent,
    RolesListComponent,
  ],
  imports: [
    SharedModule,
    DynamicTableModule,
    CoolDirectivesModule,
    ReactiveFormsModule,
    LoadersModule,
    DynamicTableColumnMenuModule,
    DynamicSearchModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    PermissionsService,
    ProfilesService,
    RolesService,
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'}}
  ]
})
export class UsersModule { }
