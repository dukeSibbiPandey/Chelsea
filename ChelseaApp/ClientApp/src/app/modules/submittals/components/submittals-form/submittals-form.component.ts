import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-submittals-form',
  templateUrl: './submittals-form.component.html',
  styleUrls: ['./submittals-form.component.scss']
})
export class SubmittalsFormComponent implements OnInit {
  activeStep: any=0;
  constructor(private _ActivatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this._ActivatedRoute.params.subscribe(params => {
      this.activeStep = params.step
    });
  }
  selectAddress = (index: any) => {
    this.activeStep = index;
  }
}
