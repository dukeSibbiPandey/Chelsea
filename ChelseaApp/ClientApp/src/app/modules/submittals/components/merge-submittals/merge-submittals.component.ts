import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { HttpService } from 'src/app/components/http.service';
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
  constructor(private _ActivatedRoute: ActivatedRoute, private httpService: HttpService, private router: Router) { }
  entityRes: any
  pageUrl = "";
  id: any
  ngOnInit(): void {
    this.id = this._ActivatedRoute.snapshot.params['id'];
    this.getSubmittalData(this.id);
  }
  getSubmittalData(id: any) {
    this.httpService.get("Home/submittal/get/" + id + "").toPromise().then((value: any) => {
      this.pageUrl = "https://chelsea.skdedu.in/api/Home/download?bloburl=" + value.fileName + ""
      this.entityRes = value;
    })
  }
  handleBack = () => {
    this.router.navigate([`/submittals/form/add/${this.id}/step/2`]);
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
