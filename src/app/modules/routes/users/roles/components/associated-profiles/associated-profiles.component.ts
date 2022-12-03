import { Component, OnInit } from '@angular/core';
import { Role } from '../../../index';

@Component({
  selector: 'app-associated-profiles',
  templateUrl: './associated-profiles.component.html',
  styleUrls: ['./associated-profiles.component.scss']
})
export class AssociatedProfilesComponent implements OnInit {

  data: Role | null = null

  constructor() { }

  ngOnInit(): void {
  }

}
