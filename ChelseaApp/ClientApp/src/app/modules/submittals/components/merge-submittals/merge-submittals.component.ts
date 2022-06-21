import { Component, OnInit, ViewChild } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { EditHeaderComponent } from '../edit-header/edit-header.component';

@Component({
  selector: 'app-merge-submittals',
  templateUrl: './merge-submittals.component.html',
  styleUrls: ['./merge-submittals.component.scss'],
  providers: [PrimeNGConfig]
})
export class MergeSubmittalsComponent implements OnInit {
  @ViewChild(EditHeaderComponent, { static: false }) _EditHeaderComponent: EditHeaderComponent;
  position = 'right'
  isEditDialog = false;
  headerDialogtitle = 'Edit Header';
  detailDialogtitle = 'Edit Submittal Details';
  isDetailEditDialog = false;
  constructor(private primengConfig: PrimeNGConfig) { }

  ngOnInit(): void {
  }
  handleEditDialog(value: boolean) {
    this.isEditDialog = value;
  }
  editDialogSubmitHndler = (value: any) => {
    this._EditHeaderComponent.handleSubmit();
  }
  editDialogSubmitCallbackHandler = ($event: any) => {
    this.isEditDialog = $event.isDialogOpen
  }
  handleDetailEditDialog(value: boolean) {

    this.isDetailEditDialog = value;
  }
}
