import { Component, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-submittals-sections',
  templateUrl: './submittals-sections.component.html',
  styleUrls: ['./submittals-sections.component.scss']
})
export class SubmittalsSectionsComponent implements OnInit {
  @Input() title='';
  templateList: any = []
  constructor() { }

  ngOnInit(): void {
    this.templateList = [
      {
        info: {
          image: 'thumb_1.jpg',
          fileName: '010622 Sample file.pdf',
          fileSize: '2.5 mb'
        },
        noSamples: 5,
        owner: 'John Smith',
        createdAt: '06/06/2022'
      },
      {
        info: {
          image: 'thumb_2.jpg',
          fileName: '020622 Sample file.pdf',
          fileSize: '3.0 mb'
        },
        noSamples: 4,
        owner: 'Jane Doe',
        createdAt: '06/05/2022'
      }
    ]
  }
}
