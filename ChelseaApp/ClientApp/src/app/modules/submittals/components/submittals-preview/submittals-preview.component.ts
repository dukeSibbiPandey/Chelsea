import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { HttpService } from 'src/app/components/http.service';
import { SubmittalService } from '../../submittal.service';
import WebViewer from '@pdftron/pdfjs-express';
import { PdfHelperService } from '../../pdfhelper.service';
import { HostListener } from '@angular/core';
import { Observable } from 'rxjs';
const submittalItem: any = {
  name: 'F1',
  status: '',
  mfg: '',
  part: '',
  description: '',
  volt: '',
  lamp: '',
  dim: '',
  runs: '',
  files: []
}
@Component({
  selector: 'app-submittals-preview',
  templateUrl: './submittals-preview.component.html',
  styleUrls: ['./submittals-preview.component.scss'],
  providers: [PrimeNGConfig, MessageService]
})
export class SubmittalsPreviewComponent implements OnInit, AfterViewInit {
  @ViewChild('viewer2', { static: false }) viewer1: ElementRef;
  @HostListener('window:beforeunload')
  saveDialogTitle = 'Save PDF';
  isDetailEditDialog = false;
  submittal: any = submittalItem;
  previewUrl: any;
  wvInstance: any;
  isFormSaved = true;
  id: any
  dialogConfig: any = null;
  icon: any = {
    BACK_ICON: ''
  }
  constructor(private _SubmittalService: SubmittalService, public activatedRoute: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer, private httpService: HttpService, private messageService: MessageService) { }

  ngOnInit(): void {
    PdfHelperService.RemoveDataLocalStorage();
    this.BACK_ICON()
    this.id = this.activatedRoute.snapshot.params['submittalId'];
    const data = localStorage.getItem('submittalObject') && JSON.parse(localStorage.getItem('submittalObject')) || null;
    if (!data) {
      this.handleBack();
    } else {
      this.dialogConfig = data;
      this.submittal = {
        ...data.pdfFiles
      }
      this.wvDocumentLoadedHandler = this.wvDocumentLoadedHandler.bind(this);
    }

  }
  BACK_ICON = () => {
    const icon = this._SubmittalService.BACK_ICON();
    this.icon.BACK_ICON = this.sanitizer.bypassSecurityTrustHtml(
      icon
    );
  }
  canDeactivate(): Observable<boolean> | boolean {

    return this.isFormSaved
  }
  ngAfterViewInit(): void {
    this.previewUrl = this.dialogConfig.config.previewUrl;
    WebViewer(
      {
        path: '../lib',
        initialDoc: this.previewUrl,
        licenseKey: 'irld89CMAcwPvMz4SJzz',
      }, this.viewer1.nativeElement).then(instance => {
        this.wvInstance = instance;
        this.createHeader(this.previewUrl, this.dialogConfig.pdfFiles);
        instance.setFitMode('FitWidth')
        instance.disableElements(['header', 'leftPanel']);
        instance.disableFeatures([instance.Feature.Print, instance.Feature.FilePicker]);
        instance.openElements(['notesPanel']);
        instance.docViewer.on('annotationsLoaded', () => {
          const annots = this.wvInstance.annotManager.getAnnotationsList;
          this.wvInstance.annotManager.deleteAnnotations(annots);
        });
        instance.docViewer.on('documentLoaded', this.wvDocumentLoadedHandler)
      })
  }

  wvDocumentLoadedHandler(): void {
    const { annotManager } = this.wvInstance;
    let submitalData = this.dialogConfig.pdfFiles;
    let xfdfData = submitalData.files.annotations;
    if (xfdfData) {
      annotManager.importAnnotations(xfdfData).then(importedAnnotations => { });
    }
  }
  createHeader = async (previewUrl, pdfFiles) => {
    let blobDoc = await PdfHelperService.CreatePdfHeader(previewUrl, pdfFiles);
    this.wvInstance.loadDocument(blobDoc);
    setTimeout(() => {
      this.wvInstance.setFitMode('FitWidth')
    }, 100);
  }
  handleBack = () => {
    localStorage.removeItem('submittalObject');
    localStorage.removeItem('updatedHeader');
    setTimeout(() => {
      this.router.navigate([`/submittals/form/${this.id}/step/2`]);
    }, 10);
  }
  handleUpdateDetail = () => {
    let pdfFiles = {
      mfg: this.submittal.mfg,
      part: this.submittal.part,
      description: this.submittal.description,
      volt: this.submittal.volt,
      lamp: this.submittal.lamp,
      dim: this.submittal.dim,
      runs: this.submittal.runs,
    }
    let config = {
      ...this.dialogConfig.config
    }
    let postDto = {
      pdfFiles: pdfFiles,
      config: config
    }
    this.dialogConfig = {
      ...postDto
    }
    this.isFormSaved = false
    this.createHeader(this.previewUrl, pdfFiles);
    localStorage.setItem('updatedHeader', JSON.stringify(postDto));
    // this.handleBack();
  }
  handleDetailEditDialog = (value: boolean) => {
    this.isDetailEditDialog = value
  }
  toastMsg(severity: any, summary: any, detail: any, life: any) {
    this.messageService.add({ key: 'pdfEditorToast', severity: severity, summary: summary, detail: detail, life: life, closable: true });
  }
  modelChanged = (event) => {
    this.isFormSaved = false
  }
  handleSaveAction = async () => {
    const { annotManager } = this.wvInstance;
    const xfdf = await annotManager.exportAnnotations({ links: false, widgets: false });
    localStorage.setItem('annotations', xfdf);
    let submitalData = this.submittal;
    submitalData.submittalId = this.dialogConfig.config.submittalId;
    let url = 'home/auto/save';
    let formData = {
      ...submitalData
    }
    formData.files.annotations = xfdf
    formData.files.annotation = xfdf
    this.httpService.fileupload(url, formData, null, null).subscribe(res => {
      this.toastMsg('success', 'Success', 'PDF Submitted Successfully', 2000);
      this.isFormSaved = true
      setTimeout(() => {
        this.handleBack();
      }, 3000)
    })
  }
}
