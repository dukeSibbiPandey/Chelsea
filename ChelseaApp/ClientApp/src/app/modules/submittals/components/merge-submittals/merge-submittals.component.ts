import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { HttpService } from 'src/app/components/http.service';
import { EditHeaderComponent } from '../edit-header/edit-header.component';
import { SubmittalsDetailFormComponent } from '../submittals-detail-form/submittals-detail-form.component';
import WebViewer from '@pdftron/pdfjs-express';
import { PdfHelperService } from '../../pdfhelper.service';
import { SubmittalService } from '../../submittal.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-merge-submittals',
  templateUrl: './merge-submittals.component.html',
  styleUrls: ['./merge-submittals.component.scss'],
  providers: [PrimeNGConfig]
})
export class MergeSubmittalsComponent implements OnInit {
  @ViewChild('viewer3', { static: false }) viewer3: ElementRef;
  @ViewChild(EditHeaderComponent, { static: false }) _EditHeaderComponent: EditHeaderComponent;
  @ViewChild(SubmittalsDetailFormComponent, { static: false }) _SubmittalsDetailFormComponent: SubmittalsDetailFormComponent;
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
  getSubmittalData(id: any) {
    this.httpService.get("Home/submittal/get/" + id + "").toPromise().then((value: any) => {
      this.previewUrl = this.httpService.getBaseUrl() + "Home/download?bloburl=" + value.fileName + "";
      this.dialogConfig = value;
      this.inView()
    })
  }
  inView(): void {
    WebViewer(
      {
        path: '../lib',
        initialDoc: this.previewUrl,
        licenseKey: 'irld89CMAcwPvMz4SJzz',
      }, this.viewer3.nativeElement).then(instance => {
        this.wvInstance3 = instance;        
        instance.setFitMode('FitWidth')
       /* instance.disableElements(['header']);//, 'leftPanel'*/
        instance.disableElements([
          'freeTextToolButton',
          'eraserToolButton',
          'shapeToolGroupButton',
          'textToolGroupButton',
          'freeHandToolGroupButton',
          'menuButton', /* for menu */
          'searchButton', /* for search */
          'toolsButton', /* full screen */
          'miscToolGroupButton', /* stamp, attachment, callout */
          'stickyToolButton', /* comment box */
          'signatureToolButton', /* signature */
          //'zoomOverlayButton', 'zoomInButton', 'zoomOutButton',
          'panToolButton',/* hand */
          'viewControlsButton', /* settings, page transition, layout, rotate */
          'selectToolButton' /* big arrow */,
          'ellipseToolButton',
          'arrowToolButton',
          'polylineToolButton',
          'polygonToolButton',
          'cloudToolButton',
          'freeHandToolButton2',
          'freeHandToolButton3',
          'freeHandToolButton4',
          'highlightToolButton2',
          'highlightToolButton3',
          'highlightToolButton4',
          'underlineToolButton',
          'squigglyToolButton',
          'strikeoutToolButton',
          'outlinesPanelButton',
          'notesPanelButton'
        ]);
        instance.disableFeatures([instance.Feature.FilePicker]);
        instance.openElements(['notesPanel']);
      })
  }
  createHeader = async (previewUrl, pdfFiles) => {
    let blobDoc = await PdfHelperService.CreatePdfHeader(previewUrl, pdfFiles);
    this.wvInstance3.loadDocument(blobDoc);
    setTimeout(() => {
      this.wvInstance3.setFitMode('FitWidth')
    }, 100);
  }
  handleBack = () => {
    window.history.back()
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
