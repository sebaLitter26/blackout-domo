import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from 'src/app/modules/ui/dialogs/image-dialog/image-dialog.component';
import { CustomCellComponent } from 'src/app/modules/ui/dynamic-table';
import { Image } from '..';

@Component({
    selector: 'app-plu-image',
    templateUrl: './plu-image.component.html',
    styleUrls: ['./plu-image.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PluImageComponent implements CustomCellComponent {

    data: Image | null = null;

    _mouseOver: boolean = false;

    constructor(
        private matDialog: MatDialog,
    ) { }

    openPluImage($event: MouseEvent): void {
        $event.stopPropagation();

        this.matDialog.open(ImageDialogComponent, {
            data: this.data?.imagen,
            panelClass: "xs-padding-panel",
        });
    }
}
