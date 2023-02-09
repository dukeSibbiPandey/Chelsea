import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-submittals-preview-content',
  templateUrl: './submittals-preview-content.component.html',
  styleUrls: ['./submittals-preview-content.component.scss']
})
export class SubmittalsPreviewContentComponent implements OnInit {
  @Input() formValueOne: any
  @Input() address2: any
  constructor() { }

  ngOnInit(): void { }

  displayAddressText(text): string {  
    return text && text.replaceAll('\n', '<br>');
  }
}
