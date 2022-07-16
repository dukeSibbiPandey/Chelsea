import { Component, OnInit, ViewChild } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { EditHeaderComponent } from '../edit-header/edit-header.component';
import { SubmittalsDetailFormComponent } from '../submittals-detail-form/submittals-detail-form.component';

@Component({
  selector: 'app-merge-submittals',
  templateUrl: './merge-submittals.component.html',
  styleUrls: ['./merge-submittals.component.scss'],
  providers: [PrimeNGConfig]
})
export class MergeSubmittalsComponent implements OnInit {
  @ViewChild(EditHeaderComponent, { static: false }) _EditHeaderComponent: EditHeaderComponent;
  @ViewChild(SubmittalsDetailFormComponent, { static: false }) _SubmittalsDetailFormComponent: SubmittalsDetailFormComponent;
  position = 'right'
  isEditDialog = false;
  headerDialogtitle = 'Edit Header';
  detailDialogtitle = 'Edit Submittal Details';
  isDetailEditDialog = false;
  constructor(private primengConfig: PrimeNGConfig) { }
  entityRes:any
  pageUrl="";
  previewUrl=''
  ngOnInit(): void {
    this.entityRes=JSON.parse(localStorage.getItem('pdfRes'));
    //this.pageUrl="https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
    this.pageUrl=this.entityRes.fileUrl
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
    this._SubmittalsDetailFormComponent.createForm(() => {
      this.isDetailEditDialog = value;
    });
  }

  /* detail form */
  detailFormSubmitHndler = () => {
    this._SubmittalsDetailFormComponent.handleSubmit();
  }

  detailFormSubmitCallbck = ($event: any) => {
    this.isDetailEditDialog = $event.isDialogOpen
  }
}
