import { Component, Input, OnInit } from '@angular/core';
const submittalItem: any = {
  name: 'F1',
  status: '',
  mfg: '',
  part: '',
  description: '',
  volt: '',
  lamp: '',
  dim: '',
  runs: '',
  files: [],
  isOpen: true
}
@Component({
  selector: 'app-submittals-preview',
  templateUrl: './submittals-preview.component.html',
  styleUrls: ['./submittals-preview.component.scss']
})
export class SubmittalsPreviewComponent implements OnInit {
  @Input() pdfActionConfig: any = {};
  saveDialogTitle = 'Save PDF';
  isDetailEditDialog = false;
  submittal: any = submittalItem;
  constructor() { }

  ngOnInit(): void {
    debugger
    this.submittal = {
      ...this.pdfActionConfig.pdfFiles
    }

  }
  handleUpdateDetail = () => {

  }
  handleDetailEditDialog = (value: boolean) => {
    this.isDetailEditDialog = value
  }

}
