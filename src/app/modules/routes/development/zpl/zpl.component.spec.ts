import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SerialService } from '../../../../services/serial.service';

import { ZplComponent } from './zpl.component';

describe('ZplComponent', () => {
    let component: ZplComponent;
    let fixture: ComponentFixture<ZplComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ ZplComponent ],
            providers: [
                {
                    provide: SerialService,
                    useValue: {},
                },
            ],
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ZplComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
