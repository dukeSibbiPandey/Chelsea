import { Component, Input, Output, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-submittals-sections',
  templateUrl: './submittals-sections.component.html',
  styleUrls: ['./submittals-sections.component.scss']
})
export class SubmittalsSectionsComponent implements OnInit {
  @Input() title = '';
  templateList: any = [];
  isEdit = false;
  items: MenuItem[]=[];
  transmittedFor: string = '';
  constructor() { }

  ngOnInit(): void {
    this.items = [
      {label: 'Update', icon: 'pi pi-refresh'},
      {label: 'Delete', icon: 'pi pi-times'},
      {label: 'Angular.io', icon: 'pi pi-info'},
      {label: 'Setup', icon: 'pi pi-cog'}
  ];
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
  handleEdit = (value: boolean) => {
    this.isEdit = value
  }
}
