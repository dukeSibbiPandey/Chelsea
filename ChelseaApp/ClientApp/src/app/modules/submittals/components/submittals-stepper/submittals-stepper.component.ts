import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-submittals-stepper',
  templateUrl: './submittals-stepper.component.html',
  styleUrls: ['./submittals-stepper.component.scss']
})
export class SubmittalsStepperComponent implements OnInit {
 @Input() activeStep=0
  constructor() { }
  steps=[
    {
      name:'',
      value:1
    },
    {
      name:'',
      value:2
    }
  ]
  ngOnInit(): void {
  }

}
