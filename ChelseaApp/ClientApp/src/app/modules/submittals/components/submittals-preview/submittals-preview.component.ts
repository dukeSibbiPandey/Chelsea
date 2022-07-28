import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
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
  files: []
}
@Component({
  selector: 'app-submittals-preview',
  templateUrl: './submittals-preview.component.html',
  styleUrls: ['./submittals-preview.component.scss']
})
export class SubmittalsPreviewComponent implements OnInit {
  @Input() pdfActionConfig: any = {};
  @Output() previewSubmitCallback: EventEmitter<any> = new EventEmitter();
  saveDialogTitle = 'Save PDF';
  isDetailEditDialog = false;
  submittal: any = submittalItem;
  constructor() { }

  ngOnInit(): void {
    this.submittal = {
      ...this.pdfActionConfig.pdfFiles
    }

  }
  handleUpdateDetail = () => {
    let pdfFiles = {
      mfg: this.submittal.mfg,
      part: this.submittal.part,
      description: this.submittal.description,
      volt: this.submittal.volt,
      lamp: this.submittal.lamp,
      dim: this.submittal.dim,
      runs: this.submittal.runs,
    }
    let config = {
      ...this.pdfActionConfig.config
    }
    let postDto = {
      pdfFiles: pdfFiles,
      config: config
    }
    this.previewSubmitCallback.emit(postDto)
  }
  handleDetailEditDialog = (value: boolean) => {
    this.isDetailEditDialog = value
  }

}
