import { Component, ViewChild, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import WebViewer from '@pdftron/pdfjs-express';
import { HttpService } from 'src/app/components/http.service';
import { SubmittalService } from '../../submittal.service';
import { HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { DomSanitizer } from "@angular/platform-browser";
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
  previewUrl: any;
  wvInstance: any;
  isFormSubmit = false;
  id: any
  dialogConfig: any = null;
  icon: any = {
    BACK_ICON: ''
  }

  constructor(private httpService: HttpService, private _SubmittalService: SubmittalService, public activatedRoute: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer, private messageService: MessageService) { }
  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    const data = localStorage.getItem('submittalObject') && JSON.parse(localStorage.getItem('submittalObject')) || null;
    if (!data) {
      this.isFormSubmit = true;
      this.handleBack();
    } else {
      this.dialogConfig = data;
      this.previewUrl = this.dialogConfig.previewUrl;
      this.wvDocumentLoadedHandler = this.wvDocumentLoadedHandler.bind(this);
      this.updatePagnation = this.updatePagnation.bind(this);
      this.BACK_ICON()
    }

  }
  canDeactivate(): Observable<boolean> | boolean {

    return this.isFormSubmit
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
    this.previewUrl = this.dialogConfig.previewUrl;
    WebViewer({
      path: '../lib',
      initialDoc: this.previewUrl,
      licenseKey: 'irld89CMAcwPvMz4SJzz',
    }, this.viewer1.nativeElement).then(instance => {
      this.wvInstance = instance;
      this.createHeader();
      instance.setFitMode('FitWidth')
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
      instance.openElements(['notesPanel']);
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
        console.log('annotations loaded');
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
      id: 'undo-button',
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
    this.wvInstance.setHeaderItems((header) => {
      header.push(reduIcon);
      header.push(unduIcon);
    })
    let currentPage = docViewer.getCurrentPage();
    let TotalPageNumber = docViewer.getPageCount();
    this.wvInstance.setHeaderItems((header) => {
      var items = header.getItems();
      items.push({
        type: 'customElement',
        title: 'Page',
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

          /* Go to Preview */
          let button: any = document.createElement('button');
          button.innerHTML = 'Preview';
          button.setAttribute("type", "button");
          button.setAttribute("id", "preview");
          button.style = "background: #e8442d; color: white;cursor: pointer; border:1px #e8442d solid; border-radius:4px";
          button.onclick = () => {
            this.handlePreview()
          };

          var form: any = document.createElement('div');
          form.style = "display: flex; border-radius: 10px;padding: 10px;cursor: pointer;";
          form.appendChild(pager);
          form.appendChild(customPagerFirst);
          form.appendChild(customPagerPrev);
          form.appendChild(customPagerNext);
          form.appendChild(customPagerlast);
          // form.appendChild(button);
          return form;
        }
      });

      header.update(items);

    });

    const { annotManager } = this.wvInstance;
    //var xfdfData = localStorage.getItem('annotations');
    let submitalData = this.dialogConfig.submitalData;
    let xfdfData = submitalData.files.annotations;
    if (xfdfData) {
      annotManager.importAnnotations(xfdfData).then(importedAnnotations => { });
    }
  }


  handleSaveAction = async () => {
    const { annotManager } = this.wvInstance;
    const xfdf = await annotManager.exportAnnotations({ links: false, widgets: false });
    localStorage.setItem('annotations', xfdf);
    let submitalData = this.dialogConfig.submitalData;
    submitalData.submittalId = this.dialogConfig.submittalId;
    let url = 'home/auto/save';
    let formData = {
      ...submitalData
    }
    formData.files.annotations = xfdf
    formData.files.annotation = xfdf
    this.httpService.fileupload(url, formData, null, null).subscribe(res => {
      this.toastMsg('success', 'Success', 'PDF Submitted Successfully', 2000);
      this.isFormSubmit = true
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
    this.router.navigate([`/submittals/preview/${this.id}`]);
  }

  createHeader = async () => {
    let blobDoc = await PdfHelperService.CreatePdfHeader(this.previewUrl, this.dialogConfig.submitalData);
    this.wvInstance.loadDocument(blobDoc);
    setTimeout(() => {
      this.wvInstance.setFitMode('FitWidth')
    }, 100);
  }
}