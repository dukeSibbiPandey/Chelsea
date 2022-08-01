import { Component, Input, OnInit, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit, } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { HttpService } from 'src/app/components/http.service';
import { SubmittalService } from '../../submittal.service';
import WebViewer from '@pdftron/pdfjs-express';
import { PdfHelperService } from '../../pdfhelper.service';
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
  @Output() previewSubmitCallback: EventEmitter<any> = new EventEmitter();
  saveDialogTitle = 'Save PDF';
  isDetailEditDialog = false;
  submittal: any = submittalItem;
  previewUrl: any;
  wvInstance: any;
  isFormSubmit = false;
  id: any
  dialogConfig: any = null;
  icon: any = {
    BACK_ICON: ''
  }
  constructor(private httpService: HttpService, private _SubmittalService: SubmittalService, public activatedRoute: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer, private messageService: MessageService) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['submittalId'];
    const data = JSON.parse(localStorage.getItem('submittalObject'));
    this.submittal = {
      ...data.pdfFiles
    }
    this.dialogConfig = data;
    this.wvDocumentLoadedHandler = this.wvDocumentLoadedHandler.bind(this);
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
        this.createHeader();
        instance.setFitMode('FitWidth')
        instance.disableElements(['header', 'leftPanel']);
        instance.disableFeatures([instance.Feature.Print, instance.Feature.FilePicker]);
        instance.openElements(['notesPanel']);
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
  createHeader = async () => {
    let blobDoc = await PdfHelperService.CreatePdfHeader(this.previewUrl, this.dialogConfig.pdfFiles);
    this.wvInstance.loadDocument(blobDoc);
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
    localStorage.removeItem('submittalObject');
    localStorage.removeItem('updatedHeader');
    localStorage.setItem('updatedHeader', JSON.stringify(postDto));
    // this.previewSubmitCallback.emit(postDto)
    this.router.navigate([`/submittals/form/${this.id}/step/2`]);
  }
  handleDetailEditDialog = (value: boolean) => {
    this.isDetailEditDialog = value
  }

}
