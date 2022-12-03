import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Profile } from '../../../index';
import { ProfilesService } from '../../../services/profiles.service';

@Component({
    selector: 'app-dialog-edit-profiles',
    templateUrl: './dialog-edit-profiles.component.html',
    styleUrls: ['./dialog-edit-profiles.component.scss'],
})
export class DialogEditProfilesComponent implements OnInit {
    /** Se crearon propiedades para guardar información desde el ngOnInit y reflejar esa información en los inputs del formulario.*/
    enabled: string | null = null;

    /** Se crea instancia de formulario con nombre myForm con sus respectivos campos, agregando validaciónes. */
    myForm: FormGroup = this.fb.group({
        id_perfil: [this.data.id_perfil, []],
        perfil: [this.data.perfil, [Validators.required]],
        descripcion: [this.data.descripcion, [Validators.required]],
        enabled: [this.data.activo, []],
    });

    constructor(
        public dialogRef: MatDialogRef<DialogEditProfilesComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Profile,
        private fb: FormBuilder,
        private profilesServise: ProfilesService
    ) {}

    ngOnInit(): void {
        if (this.data.activo == 1) {
            this.enabled = 'Si';
        } else {
            this.enabled = 'No';
        }
    }

    /** Si el formulario es invalido y fue tocado retorna true, generando una alerta en la UI desde el template.*/
    notValid() {
        return this.myForm.invalid && this.myForm.touched;
    }

    /** Metodo que se ejecuta con el evento click del botón Guardar en el pop-up editar. */
    saveProfile() {
        this.profilesServise
        .profileModification(this.myForm.value)
        .subscribe();
    }
}
