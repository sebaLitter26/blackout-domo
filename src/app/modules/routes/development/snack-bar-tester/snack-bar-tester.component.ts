import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SnackBarService } from 'src/app/services/snackbar.service';

@Component({
    selector: 'app-snack-bar-tester',
    templateUrl: './snack-bar-tester.component.html',
    styleUrls: ['./snack-bar-tester.component.scss']
})
export class SnackBarTesterComponent implements OnInit {

    messageControl: FormControl = new FormControl();

    durationControl: FormControl = new FormControl();

    constructor(
        private snackBarService: SnackBarService,
    ) { }

    ngOnInit(): void {
    }

    letsDance(): void {
        this.snackBarService.open(this.messageControl.value, "Aceptar", this.durationControl.value);
    }
}
