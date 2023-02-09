import { Pipe, PipeTransform,Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { HttpService } from 'src/app/components/http.service';
import { EditHeaderComponent } from '../edit-header/edit-header.component';
import { SubmittalsDetailFormComponent } from '../submittals-detail-form/submittals-detail-form.component';
import WebViewer from '@pdftron/pdfjs-express';
import { PdfHelperService } from '../../pdfhelper.service';
import { SubmittalService } from '../../submittal.service';
import { DomSanitizer } from '@angular/platform-browser';
import { async } from 'rxjs';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Component({
  selector: 'app-merge-preview-submittals',
  templateUrl: './merge-preview-submittals.html',
  styleUrls: ['./merge-preview-submittals.scss'],
  providers: [PrimeNGConfig]
})
export class MergePreviewSubmittalsComponent implements OnInit {
  position = 'right'
  isEditDialog = false;
  headerDialogtitle = 'Edit Header';
  detailDialogtitle = 'Edit Submittal Details';
  wvInstance3: any;
  isDetailEditDialog = false;
  constructor(private _SubmittalService: SubmittalService, private _ActivatedRoute: ActivatedRoute, private httpService: HttpService, private router: Router, private sanitizer: DomSanitizer) { }
  dialogConfig: any
  pageUrl = "";
  id: any
  icon: any = {
    BACK_ICON: ''
  }
  previewUrl
  ngOnInit(): void {
    PdfHelperService.RemoveDataLocalStorage();
    this.BACK_ICON()
    this.id = this._ActivatedRoute.snapshot.params['id'];
    this.getSubmittalData(this.id);
  }
  BACK_ICON = () => {
    const icon = this._SubmittalService.BACK_ICON();
    this.icon.BACK_ICON = this.sanitizer.bypassSecurityTrustHtml(
      icon
    );
  }
  getSubmittalData = async (id: any) => {
    this.httpService.get("Home/submittal/get/" + id + "").toPromise().then((value: any) => {
      this.previewUrl = value.fileUrl;
      this.dialogConfig = value;
    })
  }
  handleFile = async (src: string, fileName) =>  {
    const res = await fetch(src);
    const buf = await res.arrayBuffer();
    const file = new File([buf], 'test.pdf', { type: 'application/pdf' });
    var reader = new FileReader();
    reader.onload =  (e)=> {
      this.previewUrl  = e.target.result;
    }
    reader.readAsDataURL(file);
  }
  handleBack = () => {
    window.history.back()
  }
  handleEditDialog(value: boolean) {
    this.isEditDialog = value;
  }
  
  editDialogSubmitCallbackHandler = ($event: any) => {
    this.isEditDialog = $event.isDialogOpen
  }
  
}
