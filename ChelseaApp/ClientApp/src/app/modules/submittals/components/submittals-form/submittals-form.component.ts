import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubmittalService } from '../../submittal.service';
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-submittals-form',
  templateUrl: './submittals-form.component.html',
  styleUrls: ['./submittals-form.component.scss']
})
export class SubmittalsFormComponent implements OnInit {
  activeStep: any=0;
  icon:any={

  }
  constructor(private _ActivatedRoute: ActivatedRoute, private _SubmittalService: SubmittalService, private sanitizer: DomSanitizer,) { }

  ngOnInit(): void {
    this.BACK_ICON();
    this._ActivatedRoute.params.subscribe(params => {
      this.activeStep = params.step
    });
  }
  BACK_ICON = () => {
    const icon = this._SubmittalService.BACK_ICON();
    this.icon.BACK_ICON = this.sanitizer.bypassSecurityTrustHtml(
      icon
    );
  }
  selectAddress = (index: any) => {
    this.activeStep = index;
  }
}
