import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-submittals-list',
  templateUrl: './submittals-list.component.html',
  styleUrls: ['./submittals-list.component.scss']
})
export class SubmittalsListComponent implements OnInit {
  list: any = [

  ]
  constructor() { }

  ngOnInit(): void {
    this.list = [
      {
        info: {
          image: '../../../assets/images/thumb_1.jpg',
          fileName: '010622 Sample file.pdf',
          fileSize: '2.5 mb'
        },
        noSamples: 5,
        owner: 'John Smith',
        createdAt: '06/06/2022'
      },
      {
        info: {
          image: '../../../assets/images/thumb_2.jpg',
          fileName: '020622 Sample file.pdf',
          fileSize: '3.0 mb'
        },
        noSamples: 4,
        owner: 'Jane Doe',
        createdAt: '06/05/2022'
      },
      {
        info: {
          image: '../../../assets/images/thumb_3.jpg',
          fileName: '030622 Sample file.pdf',
          fileSize: '2.7 mb'
        },
        noSamples: 6,
        owner: 'Michael S.',
        createdAt: '05/24/2022'
      },
      {
        info: {
          image: '../../../assets/images/thumb_4.jpg',
          fileName: '030622 Sample file.pdf',
          fileSize: '2.7 mb'
        },
        noSamples: 5,
        owner: 'Heather R.',
        createdAt: '05/12/2022'
      },
      {
        info: {
          image: '../../../assets/images/thumb_4.jpg',
          fileName: '030622 Sample file.pdf',
          fileSize: '2.7 mb'
        },
        noSamples: 3,
        owner: 'Robin Raszka',
        createdAt: '04/18/2022'
      }
    ]
  }

}
