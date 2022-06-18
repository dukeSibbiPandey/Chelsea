import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-submittals-form-step2',
  templateUrl: './submittals-form-step2.component.html',
  styleUrls: ['./submittals-form-step2.component.scss']
})
export class SubmittalsFormStep2Component implements OnInit {
  activeAddressInde = 1;
  template=[
    {
      name:'F1'
    },
    {
      name:'F2'
    }
  ]
  constructor() { }

  ngOnInit(): void {
  }
  selectAddress = (index: any) => {
    this.activeAddressInde = index;
  }
}
