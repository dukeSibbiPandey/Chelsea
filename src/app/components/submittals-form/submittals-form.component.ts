import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-submittals-form',
  templateUrl: './submittals-form.component.html',
  styleUrls: ['./submittals-form.component.scss']
})
export class SubmittalsFormComponent implements OnInit {
  activeAddressInde=0
  constructor() { }

  ngOnInit(): void {
  }
  selectAddress=(index:any)=>{
    this.activeAddressInde=index;
    
  }
}