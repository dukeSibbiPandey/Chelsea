import { Component, ViewChild, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import WebViewer from '@pdftron/pdfjs-express';
import { HttpService } from 'src/app/components/http.service';
import { SubmittalService } from '../../submittal.service';
import { HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { DomSanitizer, Title } from "@angular/platform-browser";
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { PdfHelperService } from '../../pdfhelper.service';
@Component({
  selector: 'app-pdf-editor-action',
  templateUrl: './pdf-editor-action.component.html',
  styleUrls: ['./pdf-editor-action.component.scss'],
  providers: [PrimeNGConfig, MessageService]
})
export class PdfEditorActionComponent implements OnInit, AfterViewInit {
  @ViewChild('viewer1', { static: false }) viewer1: ElementRef;
  @HostListener('window:beforeunload')
  isEditHeader: any = false;
  wvInstance: any;
  isFormSaved = false;
  id: any
  dialogConfig: any = null;
  icon: any = {
    BACK_ICON: ''
  }
  constructor(private httpService: HttpService, private _SubmittalService: SubmittalService, public activatedRoute: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer, private messageService: MessageService) { }
  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    PdfHelperService.RemoveDataLocalStorage();
    const data = localStorage.getItem('submittalObject') && JSON.parse(localStorage.getItem('submittalObject')) || null;
    if (!data) {
      this.isFormSaved = true;
      this.handleBack();
    } else {
      this.dialogConfig = data;
      this.wvDocumentLoadedHandler = this.wvDocumentLoadedHandler.bind(this);
      this.updatePagnation = this.updatePagnation.bind(this);
      this.BACK_ICON()
    }

  }
  canDeactivate(): Observable<boolean> | boolean {

    return this.isFormSaved
  }
  toggleEditHeader = () => {
    this.isEditHeader = !this.isEditHeader
  }
  modelChanged = (event) => {
    this.isFormSaved = false
  }
  BACK_ICON = () => {
    const icon = this._SubmittalService.BACK_ICON();
    this.icon.BACK_ICON = this.sanitizer.bypassSecurityTrustHtml(
      icon
    );
  }
  toastMsg(severity: any, summary: any, detail: any, life: any) {
    this.messageService.add({ key: 'pdfEditorToast', severity: severity, summary: summary, detail: detail, life: life, closable: true });
  }
  ngAfterViewInit(): void {
    WebViewer({
      path: '../lib',
      initialDoc: this.dialogConfig.config.previewUrl,
      licenseKey: 'irld89CMAcwPvMz4SJzz',
    }, this.viewer1.nativeElement).then(instance => {
      this.wvInstance = instance;
      this.createHeader(this.dialogConfig.config.previewUrl, this.dialogConfig && this.dialogConfig['pdfFiles']);
      instance.setFitMode('FitWidth')
      instance.openElements(['notesPanel']);
      instance.disableFeatures([instance.Feature.Print, instance.Feature.FilePicker]);
      instance.disableElements([
        'menuButton', /* for menu */
        'searchButton', /* for search */
        'toolsButton', /* full screen */
        'miscToolGroupButton', /* stamp, attachment, callout */
        'stickyToolButton', /* comment box */
        'signatureToolButton', /* signature */
        'zoomOverlayButton', 'zoomInButton', 'zoomOutButton',
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
      const ToolNames = this.wvInstance.Tools.ToolNames;
      this.wvInstance.setColorPalette({
        toolNames: [ToolNames['TEXT'], ToolNames['FREETEXT'], ToolNames['LINE'], ToolNames['RECTANGLE'], ToolNames['FREEHAND'], ToolNames['HIGHLIGHT']],
        colors: [
          '#FF0000',
          '#0000FF',
        ],
      });
      this.wvInstance.updateTool(ToolNames['FREEHAND'], {
        buttonImage: this._SubmittalService.FREEHAND_ICON()
      });
      this.viewer1.nativeElement.addEventListener('pageChanged', (e) => {
        const [pageNumber] = e.detail;
        console.log(`Current page is ${pageNumber}`);
        this.updatePagnation(instance)
      });
      instance.docViewer.on('annotationsLoaded', () => {
        const annots = this.wvInstance.annotManager.getAnnotationsList;
        if (annots.length > 0) {
          this.wvInstance.annotManager.deleteAnnotations(annots);
        }
      });
      instance.docViewer.on('documentLoaded', this.wvDocumentLoadedHandler)
    })
  }
  updatePagnation = (instance) => {


  }
  updatePager = (docViewer: any) => {
    setTimeout(() => {
      let currentPage = docViewer.getCurrentPage();
      let TotalPageNumber = docViewer.getPageCount();
      let pager = document.getElementById('pager');
      if (pager) {
        pager.innerHTML = `Page ${currentPage}/${TotalPageNumber}`;
      }
    }, 10000);

  }
  customReduIcon = (docViewer) => {
    const icon = {
      type: 'actionButton',
      title: "Redu",
      img: this._SubmittalService.REDU_ICON(),
      onClick: () => {
        const historyManager = docViewer.getAnnotationHistoryManager();
        historyManager.redo();
      },
      dataElement: 'redu',
    }
    return icon
  }
  customUnduIcon = (docViewer) => {
    const icon = {
      type: 'actionButton',
      title: "Undu",
      img: this._SubmittalService.UNDU_ICON(),
      onClick: () => {
        const historyManager = docViewer.getAnnotationHistoryManager();
        historyManager.undo();
      },
      dataElement: 'undo',
    }
    return icon
  }
  customPaginator = (docViewer) => {
    let currentPage = docViewer.getCurrentPage();
    let TotalPageNumber = docViewer.getPageCount();
    return `Page ${currentPage}/${TotalPageNumber}`
  }
  wvDocumentLoadedHandler(): void {
    const { docViewer } = this.wvInstance;
    const reduIcon = this.customReduIcon(docViewer);
    const unduIcon = this.customUnduIcon(docViewer);
    let TotalPageNumber = docViewer.getPageCount();
    this.wvInstance.setHeaderItems((header) => {
      let items = [];
      items = header.getItems();
      let undoCount = 0;
      let redoCount = 0;
      let paging = 0;
      console.log('items==', items)
      items && items.length > 0 && items.map((el, i) => {
        if ((el.type == "actionButton" && el.title == "Undu")) {
          undoCount = undoCount + 1
        }
        if ((el.type == "actionButton" && el.title == "Redu")) {
          redoCount = redoCount + 1
        }
        if (el.type == "customElement" && el.title == "Paging") {
          paging = paging + 1
        }
      })
      if (undoCount == 0 && redoCount == 0 && paging == 0) {
        header.push(reduIcon);
        header.push(unduIcon);
        items.push({
          type: 'customElement',
          title: 'Paging',
          render: () => {
            /* Paginator Nav */
            let pager: any = document.createElement('span');
            pager.id = 'pager';
            pager.innerHTML = this.customPaginator(docViewer);


            /* Got to First Page */
            let customPagerFirst: any = document.createElement('span');
            customPagerFirst.id = 'customPagerFirst';
            customPagerFirst.innerHTML = this._SubmittalService.CUSTOMPAGER_FIRST();
            customPagerFirst.onclick = () => {
              let currentPage = docViewer.getCurrentPage();
              if (currentPage > 1) {
                this.wvInstance.goToFirstPage()
                pager.innerHTML = `Page 1/${TotalPageNumber}`;
              }
            };

            /* Go to Prev Page */
            let customPagerPrev: any = document.createElement('span');
            customPagerPrev.id = 'customPagerPrev';
            customPagerPrev.innerHTML = this._SubmittalService.CUSTOMPAGER_PREV();
            customPagerPrev.onclick = () => {
              let currentPage = docViewer.getCurrentPage();
              if (currentPage > 1) {
                this.wvInstance.goToPrevPage();
                let currentPage = docViewer.getCurrentPage();
                pager.innerHTML = `Page ${currentPage}/${TotalPageNumber}`;
              }
            };

            /* Go to Next Page */
            let customPagerNext: any = document.createElement('span');
            customPagerNext.id = 'customPagerNext';
            customPagerNext.innerHTML = this._SubmittalService.CUSTOMPAGER_NEXT();
            customPagerNext.onclick = () => {
              let currentPage = docViewer.getCurrentPage();
              if (currentPage < TotalPageNumber) {
                this.wvInstance.goToNextPage();
                let currentPage = docViewer.getCurrentPage();
                pager.innerHTML = `Page ${currentPage}/${TotalPageNumber}`;
              }
            };

            /* Go to Last Page */
            let customPagerlast: any = document.createElement('span');
            customPagerlast.id = 'customPagerlast';
            customPagerlast.innerHTML = this._SubmittalService.CUSTOMPAGER_LAST()
            customPagerlast.onclick = () => {
              let currentPage = docViewer.getCurrentPage();
              if (currentPage < TotalPageNumber) {
                this.wvInstance.goToLastPage();
                pager.innerHTML = `Page ${TotalPageNumber}/${TotalPageNumber}`;
              }
            };

            var form: any = document.createElement('div');
            form.style = "display: flex; border-radius: 10px;padding: 10px;cursor: pointer;";
            form.appendChild(pager);
            form.appendChild(customPagerFirst);
            form.appendChild(customPagerPrev);
            form.appendChild(customPagerNext);
            form.appendChild(customPagerlast);
            return form;
          }
        });

        header.update(items);
      }
    });

    const { annotManager } = this.wvInstance;
    //var xfdfData = localStorage.getItem('annotations');
    let submitalData = this.dialogConfig && this.dialogConfig['pdfFiles'];
    let xfdfData = submitalData.files.annotations;
    if (xfdfData) {
      annotManager.importAnnotations(xfdfData).then(importedAnnotations => { });
    }
  }


  handleSaveAction = async () => {
    const { annotManager } = this.wvInstance;
    const xfdf = await annotManager.exportAnnotations({ links: false, widgets: false });
    localStorage.setItem('annotations', xfdf);
    let submitalData = this.dialogConfig && this.dialogConfig['pdfFiles'];
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
        localStorage.removeItem('submittalObject');
        this.handleBack();
      }, 3000)
    })
  }
  handleBack = () => {
    this.router.navigate([`/submittals/form/${this.id}/step/2`]);
  }
  handlePreview = () => {
    localStorage.removeItem('submittalObject');
    localStorage.setItem('submittalObject', JSON.stringify(this.dialogConfig));
    this.router.navigate([`/submittals/form/preview/${this.id}/${this.dialogConfig.pdfFiles.id}`]);

  }

  createHeader = async (previewUrl, pdfFiles) => {
    let blobDoc = await PdfHelperService.CreatePdfHeader(previewUrl, pdfFiles);
    this.wvInstance.loadDocument(blobDoc);
    setTimeout(() => {
      this.wvInstance.setFitMode('FitWidth');
      this.wvInstance.openElements(['notesPanel']);
    }, 100);
  }
  handleUpdateDetail = () => {
    const tempPdfFiles = this.dialogConfig && this.dialogConfig['pdfFiles'];
    let pdfFiles = {
      mfg: tempPdfFiles.mfg,
      part: tempPdfFiles.part,
      description: tempPdfFiles.description,
      volt: tempPdfFiles.volt,
      lamp: tempPdfFiles.lamp,
      dim: tempPdfFiles.dim,
      runs: tempPdfFiles.runs,
    }
    this.isFormSaved = false
    this.createHeader(this.dialogConfig.config.previewUrl, pdfFiles);
  }
}