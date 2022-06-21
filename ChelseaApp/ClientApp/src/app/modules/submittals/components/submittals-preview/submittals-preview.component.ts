import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-submittals-preview',
  templateUrl: './submittals-preview.component.html',
  styleUrls: ['./submittals-preview.component.scss']
})
export class SubmittalsPreviewComponent implements OnInit {
  saveDialogTitle='Save PDP';
  isDetailEditDialog=false;
  constructor() { }

  ngOnInit(): void {
  }

  handleDetailEditDialog=(value:boolean)=>{
    this.isDetailEditDialog=value
  }

}
