import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmationDialogData {
    title: string;
    message: string;
    color: "accent" | "primary" | "warn";
    showObservation?: boolean;
    observationPlaceholder?: string | null;
    observationLabel?: string | null;
    observationRequired?: boolean;
}

@Component({
    selector: 'app-confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {

    confirmationForm = this.fb.group({
        observationControl: [null]
    });

    constructor(
        public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        if(this.data.showObservation && this.data.observationRequired)
            this.confirmationForm.controls.observationControl.setValidators([Validators.required])
    }
}
