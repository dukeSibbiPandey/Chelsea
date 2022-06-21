import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-merge-submittals',
  templateUrl: './merge-submittals.component.html',
  styleUrls: ['./merge-submittals.component.scss'],
  providers:[PrimeNGConfig]
})
export class MergeSubmittalsComponent implements OnInit {
  position='right'
  isEditDialog=false;
  constructor(private primengConfig: PrimeNGConfig) { }

  ngOnInit(): void {
  }
  handleEditDialog(value: boolean) {
    this.isEditDialog = value;
}
}
