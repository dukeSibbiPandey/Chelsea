import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-submittals-form-step1',
  templateUrl: './submittals-form-step1.component.html',
  styleUrls: ['./submittals-form-step1.component.scss']
})
export class SubmittalsFormStep1Component implements OnInit {
  activeAddressInde = 0
  constructor() { }

  ngOnInit(): void {
  }
  selectAddress = (index: any) => {
    this.activeAddressInde = index;
  }
}
