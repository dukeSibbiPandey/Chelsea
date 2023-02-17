import { Component, ViewChild, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import WebViewer from '@pdftron/pdfjs-express';
import { HttpService } from 'src/app/components/http.service';
import { SubmittalService } from '../../submittal.service';
import { HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { DomSanitizer } from "@angular/platform-browser";
import { ConfirmationService, MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { PdfHelperService } from '../../pdfhelper.service';
import { CommonService } from 'src/app/common.service';
import { async } from '@angular/core/testing';
import { AuthService } from '../../../../auth.service';
import { from } from 'rxjs';
@Component({
  selector: 'app-pdf-editor-action',
  templateUrl: './pdf-editor-action.component.html',
  styleUrls: ['./pdf-editor-action.component.scss'],
  providers: [PrimeNGConfig, MessageService, ConfirmationService]
})
export class PdfEditorActionComponent implements OnInit, AfterViewInit {
  @ViewChild('viewer1', { static: false }) viewer1: ElementRef;
  @HostListener('window:beforeunload')
  isSavePdfDialog = false;
  isEditHeader: any = true;
  wvInstance: any;
  isFormSaved = true;
  fileBytes: ArrayBuffer;
  id: any
  reorderData = []
  pdfSaveForm: any = {
    pdfFileName: ''
  }
  user: string = 'JD'
  dialogConfig: any = null;
  icon: any = {
    BACK_ICON: ''
  }
  constructor(private httpService: HttpService, private _SubmittalService: SubmittalService, public activatedRoute: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer, private messageService: MessageService, private _CustomService: CommonService, private authService: AuthService, private confirmationService: ConfirmationService) { }
  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.user = this.authService.getFormatedName();
    PdfHelperService.RemoveDataLocalStorage();
    const data = localStorage.getItem('submittalObject') && JSON.parse(localStorage.getItem('submittalObject')) || null;
    if (!data) {
      this.isFormSaved = true;
      this.handleBack();
    } else {
      this.dialogConfig = data;
      this.pdfSaveForm.pdfFileName = this.dialogConfig.pdfFiles.files.orgFileName && this.dialogConfig.pdfFiles.files.orgFileName.split('.pdf')[0]
      this.wvDocumentLoadedHandler = this.wvDocumentLoadedHandler.bind(this);
      this.updatePagnation = this.updatePagnation.bind(this);
      this.BACK_ICON()
    }

  }
  canDeactivate(): Observable<boolean> | boolean {

    return this.isFormSaved
  }
  okCallback = async () => {
    this.handleSaveAction();
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
      //initialDoc: this.dialogConfig.config.previewUrl,
      initialDoc: 'https://submittalappstg.azurewebsites.net/api/Home/download?bloburl=Update_d810adcf-fb46-41f0-9f0f-e2246cc86399.pdf',
      licenseKey: 'irld89CMAcwPvMz4SJzz',
    }, this.viewer1.nativeElement).then(instance => {
      this.wvInstance = instance;
      this.wvInstance.annotManager.setCurrentUser(this.user)
      var files = this.dialogConfig && this.dialogConfig['pdfFiles'];
      if (files && files.files && files.files.reorderIndexes) {
        try {
          let reorder = JSON.parse(files.files.reorderIndexes)
          if (Array.isArray(reorder)) {
            this.reorderData = files.reorderData = reorder
          }
        }
        catch { }
      }
      this.createHeader(this.dialogConfig.config.previewUrl, files);
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
        'documentControl',
        'toolbarGroup-Shapes',
        'toolbarGroup-Insert',
        'toolbarGroup-FillAndSign'

      ]);
      const ToolNames = this.wvInstance.Tools.ToolNames;
      this.wvInstance.setColorPalette({
        toolNames: [ToolNames['TEXT'], ToolNames['FREETEXT'], ToolNames['LINE'], ToolNames['RECTANGLE'], ToolNames['FREEHAND'], ToolNames['HIGHLIGHT']],
        colors: [
          '#ffffff',
          '#FF0000',
          '#0000FF',
          'transparency'
        ],
        defaults: [{ StrokeColor: '#FF0000' }]
      });
      this.wvInstance.setColorPalette({
        toolNames: [ToolNames['HIGHLIGHT']],
        colors: [
          '#FFFF00'
        ],
        defaults: [{ StrokeColor: '#FFFF00' }]
      });
      this.wvInstance.setColorPalette({
        toolNames: [ToolNames['RECTANGLE']],
        colors: [
          '#ffffff',
          '#FF0000',
          '#0000FF', '#008000'
        ],
        defaults: [{ StrokeColor: '#008000' }]
      });
      this.wvInstance.updateTool(ToolNames['FREEHAND'], {
        buttonImage: this._SubmittalService.FREEHAND_ICON(),

      });
      this.viewer1.nativeElement.addEventListener('pageChanged', (e) => {
        const [pageNumber] = e.detail;
        console.log(`Current page is ${pageNumber}`);
        this.updatePagnation(instance)
      });
      // instance.docViewer.on('annotationsLoaded', () => {
      //   // const annots = this.wvInstance.annotManager.getAnnotationsList;
      //   // if (annots.length > 0) {
      //   //   this.wvInstance.annotManager.deleteAnnotations(annots);
      //   // }
      // });
      instance.docViewer.on('documentLoaded', this.wvDocumentLoadedHandler)
    })
  }
  updatePagnation = (instance) => {


  }
  adjustSelectedAnnot = (x, y, event) => {
    const { annotManager } = this.wvInstance;
    const selectedAnnots = annotManager.getSelectedAnnotations();

    if (!selectedAnnots || selectedAnnots.length === 0) {
      return;
    }

    event.preventDefault()

    selectedAnnots.forEach(annot => {
      annot.X += x;
      annot.Y += y;
      annotManager.redrawAnnotation(annot);
    })

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
  customRedoIcon = (docViewer) => {
    const icon = {
      type: 'actionButton',
      title: "Redo",
      img: this._SubmittalService.REDO_ICON(),
      onClick: () => {
        const historyManager = docViewer.getAnnotationHistoryManager();
        historyManager.redo();
      },
      dataElement: 'redo',
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
  customDeleteIcon = (docViewer) => {
    const icon = {
      type: 'actionButton',
      title: "Delete",
      img: this._SubmittalService.DEL_ICON_EDIT(),
      onClick: async () => {
        let currentPage = docViewer.getCurrentPage();
        //this.confirmationService.confirm({
        //  message: `Are you sure that you want to delete page ${currentPage} from document ?`,
        //  accept: async () => {
        //    await this.setDelete(currentPage);
        //    await this.handleUpdateDetail()
        //  }
        //});
        if (confirm(`Are you sure that you want to delete page ${currentPage} from document ?`)) {
          this.wvInstance.openElements(['loadingModal']);
          await this.setDelete(currentPage);
          await this.handleUpdateDetail();
        }
      },
      dataElement: 'delete',
    }
    return icon
  }
  customRotateIcon = (instance) => {
    const icon = {
      type: 'actionButton',
      title: "Rotate",
      img: this._SubmittalService.ROTATE_ICON_EDIT(),
      onClick: async () => {
        this.wvInstance.openElements(['loadingModal']);
        let currentPage = instance.getCurrentPage();
        await this.setRotate(currentPage, 90);
        await this.handleUpdateDetail();
      },
      dataElement: 'rotate',
    }
    return icon
  }
  customPaginator = (docViewer) => {
    let currentPage = docViewer.getCurrentPage();
    let TotalPageNumber = docViewer.getPageCount();
    return `Page ${currentPage}/${TotalPageNumber}`
  }
  wvDocumentLoadedHandler = async () => {
    const { docViewer } = this.wvInstance;
    const redoIcon = this.customRedoIcon(docViewer);
    const unduIcon = this.customUnduIcon(docViewer);
    const deleteIcon = this.customDeleteIcon(docViewer);
    const rotateIcon = this.customRotateIcon(docViewer);
    let TotalPageNumber = docViewer.getPageCount();
    const contextMenuItems = this.wvInstance.contextMenuPopup.getItems();
    this.wvInstance.setHeaderItems((header) => {
      let items = [];
      items = header.getItems();
      let undoCount = 0;
      let redoCount = 0;
      let deleteCount = 0;
      let paging = 0;
      items && items.length > 0 && items.map((el, i) => {
        if ((el.type == "actionButton" && el.title == "Undu")) {
          undoCount = undoCount + 1
        }
        if ((el.type == "actionButton" && el.title == "redo")) {
          redoCount = redoCount + 1
        }
        if ((el.type == "actionButton" && el.title == "Delete")) {
          deleteCount = deleteCount + 1
        }
        if (el.type == "customElement" && el.title == "Paging") {
          paging = paging + 1
        }
      })
      if (undoCount == 0 && redoCount == 0 && paging == 0 && deleteCount == 0) {
        header.push(redoIcon);
        header.push(unduIcon);
        header.push(deleteIcon);
        header.push(rotateIcon);
        if (TotalPageNumber > 1) {
          items.push({
            type: 'customElement',
            title: 'Paging',
            render: () => {
              /* Paginator Nav */
              let rotade: any = document.createElement('span');
              rotade.id = 'rotade';
              rotade.innerHTML = this._SubmittalService.CUSTOMPAGER_FIRST();
              rotade.onclick = () => {
                this.wvInstance.rotateClockwise();
              };
              /* Paginator Nav */
              let pager: any = document.createElement('span');
              pager.id = 'pager';
              pager.innerHTML = this.customPaginator(docViewer);

              let partition: any = document.createElement('div');
              partition.classList.add("divider", "hide-in-tablet", "hide-in-mobile");
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

              var input: any = document.createElement('input');
              input.type = "number";
              input.style = "width:30px; border:1px solid gray; margin-right:5px;";
              let customReorderButton: any = document.createElement('div');
              customReorderButton.id = 'customReorderButton';
              customReorderButton.classList.add("Button", "hide-in-tablet", "hide-in-mobile", 'down-arrow');
              customReorderButton.innerHTML = '<span style="background: rgb(117, 117, 117);color: rgb(255, 255, 255);border: 1px solid rgb(117, 117, 117);border-radius: 2px;height: 30px;font-size: 12px;padding: 3px; margin-right: 3px; white-space:nowrap; line-height:20px">Change Page #</span>'
              customReorderButton.onclick = (evt) => {
                let currentPage = docViewer.getCurrentPage();
                input.value = currentPage;
                input.min = 1;
                input.max = TotalPageNumber;
                var tool = evt.currentTarget.closest('#app').querySelectorAll('[data-element="toolsOverlays"]');
                if (tool.length > 0) {
                  tool[0].classList.toggle("closed");
                  tool[0].classList.toggle("open");
                }
                else {
                  var div: any = document.createElement('div');
                  div.style = "position: absolute;right: 20px;background: #fff;padding: 15px;";
                  div.classList.add("Overlay", "ToolsOverlay", "open");
                  div.dataset.element = "toolsOverlays";

                  div.appendChild(input);

                  var span: any = document.createElement('span');
                  span.style = "padding-top:3px;";
                  span.innerText = "To";
                  div.appendChild(span);

                  var input1: any = document.createElement('input');
                  input1.type = "number";
                  input1.style = "width:30px; border:1px solid gray; margin-right:5px; margin-left:5px;";
                  input1.min = 1;
                  input1.max = TotalPageNumber;
                  div.appendChild(input1);

                  var button: any = document.createElement('button');
                  button.type = "button";
                  button.style = "background: #757575;color: #fff;border: 1px solid #757575; border-radius:2px;"
                  button.innerText = "Move"
                  button.onclick = async () => {
                    let s = parseInt(input.value) || 0;
                    let d = parseInt(input1.value) || 0;
                    if (s == 0 || d == 0 || s > TotalPageNumber || d > TotalPageNumber || s == d) {
                      /*this.toastMsg('error', 'Validation Error', 'Please input correct field value.', 2000);*/
                      alert("Please input correct field value.");
                      return false;
                    }
                    this.wvInstance.openElements(['loadingModal']);
                    annotManager.getAnnotationsList()
                      .map((annot) => {
                        let pageno = annot.PageNumber;
                        if (annot.PageNumber == s) {
                          annot.setPageNumber(d);
                        }
                        else if (annot.PageNumber == d) {
                          s < d && annot.setPageNumber(d - 1);
                          s > d && annot.setPageNumber(d + 1);
                        }
                        else if (s < d && pageno > s && pageno < d) {
                          annot.setPageNumber(pageno - 1);
                        }
                        else if (s > d && pageno < s && pageno > d) {
                          annot.setPageNumber(pageno + 1);
                        }
                      });

                    await this.setReorderData(s, d);
                    input.value = input1.value;
                    input1.value = '';
                    await this.handleUpdateDetail();
                    return true;
                  }
                  div.appendChild(button);

                  evt.currentTarget.closest('#app').querySelectorAll('div')[0].appendChild(div);
                }



              };

              var form: any = document.createElement('div');
              form.style = "display: flex; align-items:center; border-radius: 10px;padding: 10px;cursor: pointer;";
              // form.appendChild(rotade);
              form.appendChild(pager);
              form.appendChild(customPagerFirst);
              form.appendChild(customPagerPrev);
              form.appendChild(customPagerNext);
              form.appendChild(customPagerlast);
              form.appendChild(partition);
              form.appendChild(customReorderButton);

              return form;
            }
          });
        }

        header.update(items);
      }
    });

    // this.wvInstance.docViewer.setColorPalette({
    //     StrokeColor: new this.wvInstance.Core.Annotations.Color(0, 221, 255)
    // });

    // this.wvInstance.docViewer.getTool('AnnotationCreateFreeText').setDe({
    //   StrokeThickness: 5,
    //   StrokeColor: new this.wvInstance.Core.Annotations.Color(0, 0, 255),
    //   TextColor: new this.wvInstance.Core.Annotations.Color(0, 0, 0),
    //   FontSize: '20pt'
    // });

    const { annotManager } = this.wvInstance;
    //var xfdfData = localStorage.getItem('annotations');
    let submitalData = this.dialogConfig && this.dialogConfig['pdfFiles'];
    let xfdfData = submitalData.files.annotations;
    if (xfdfData) {
      //xfdfData = xfdfData.replaceAll(",readonly,locked,lockedcontents", "");
      await annotManager.importAnnotations(xfdfData);
      const list = annotManager.getAnnotationsList();
      list.forEach((item) => {
        item.ReadOnly = false;
        item.Locked = false;
        item.LockedContents = false;
      });
      //annotManager.setReadOnly(list);
      annotManager.setIsAdminUser(list);
      //const list = annotManager.getAnnotationsList();
      //list.forEach((item) => {
      //  item.ReadOnly = false;
      //  item.Locked = false;
      //  item.LockedContents = false;
      //});
    }
    this.wvInstance.iframeWindow.window.addEventListener('keydown', event => {
      var pageinfo = PdfHelperService.GetPageInfo();
      let angle = 0;
      if (pageinfo && pageinfo.length > 0)
        angle = pageinfo[this.wvInstance.docViewer.getCurrentPage() - 1];
      switch (event.key) {
        case 'ArrowRight':
          {
            if (angle == 90 && angle % 90 == 0)
              this.adjustSelectedAnnot(0, -1, event)
            else if (angle == 180 && angle % 180 == 0)
              this.adjustSelectedAnnot(-1, 0, event)
            else if (angle == 270 && angle % 270 == 0)
              this.adjustSelectedAnnot(0, 1, event)
            else
              this.adjustSelectedAnnot(1, 0, event)

            break;
          }
        case 'ArrowLeft':
          {
            if (angle == 90 && angle % 90 == 0)
              this.adjustSelectedAnnot(0, 1, event)
            else if (angle == 180 && angle % 180 == 0)
              this.adjustSelectedAnnot(1, 0, event)
            else if (angle == 270 && angle % 270 == 0)
              this.adjustSelectedAnnot(0, -1, event)
            else
              this.adjustSelectedAnnot(-1, 0, event)
            break;
          }
        case 'ArrowUp':
          {
            if (angle == 90 && angle % 90 == 0)
              this.adjustSelectedAnnot(-1, 0, event)
            else if (angle == 180 && angle % 180 == 0)
              this.adjustSelectedAnnot(0, 1, event)
            else if (angle == 270 && angle % 270 == 0)
              this.adjustSelectedAnnot(1, 0, event)
            else
              this.adjustSelectedAnnot(0, -1, event)
            break
          }
        case 'ArrowDown':
          {
            if (angle == 90 && angle % 90 == 0)
              this.adjustSelectedAnnot(1, 0, event)
            else if (angle == 180 && angle % 180 == 0)
              this.adjustSelectedAnnot(0, -1, event)
            else if (angle == 270 && angle % 270 == 0)
              this.adjustSelectedAnnot(-1, 0, event)
            else
              this.adjustSelectedAnnot(0, 1, event)
            break;
          }
      }
    })
  }

  haveStep1 = async () => {
    //this.isSavePdfDialog = true;
    await this.handleSaveAction();
  }
  saveCancel = () => {
    this.isSavePdfDialog = false;
  }

  handleSaveAction = async (callBack?) => {
    this._CustomService.show();
    if (this.pdfSaveForm.pdfFileName) {
      const orgFileName = `${this.pdfSaveForm.pdfFileName}.pdf`;
      const { annotManager } = this.wvInstance;
      const list = annotManager.getAnnotationsList();
      //list.forEach((item) => {
      //  item.ReadOnly = true;
      //  item.Locked = true;
      //  item.LockedContents = true;
      // });
      //annotManager.setReadOnly(list);
      annotManager.setIsAdminUser(list);
      const xfdf = await annotManager.exportAnnotations({ links: false, widgets: false });
      localStorage.setItem('annotations', xfdf);
      let submitalData = this.dialogConfig && this.dialogConfig['pdfFiles'];
      submitalData.submittalId = this.dialogConfig.config.submittalId;
      submitalData.files.orgFileName = orgFileName;
      let url = 'home/auto/save';
      let formData = {
        ...submitalData
      }
      if (this.fileBytes) {
        const data = new FormData();
        data.append('fileName', "Update.pdf");
        data.append('file', new Blob([this.fileBytes], { type: 'application/pdf' }));
        await this.httpService.fileupload('home/upload/header', data, null, null).toPromise().then(value => {
          formData.files.updateFileName = value.fileName;
        });
      }
      formData.files.annotations = xfdf
      //formData.files.reorderIndexes = JSON.stringify(this.reorderData);
      this.httpService.fileupload(url, formData, null, null).subscribe(res => {
        this.toastMsg('success', 'Success', 'PDF Submitted Successfully', 2000);
        if (callBack) callBack();
        this.isFormSaved = true
        this._CustomService.hide();
        //setTimeout(() => {
        //  localStorage.removeItem('submittalObject');
        //  this.handleBack();
        //}, 3000)
      })
    } else {
      this.toastMsg('error', 'Validation Error', 'PDF name cannot be empty ', 2000);
      this._CustomService.hide();
    }

  }
  setReorderData = async (fromSource: number, fromTo: number) => {

    if (!this.fileBytes) {
      this.fileBytes = await PdfHelperService.GetPdfBytes(this.dialogConfig.config.previewUrl);
    }
    let bblob = await PdfHelperService.DoReOrderPages(this.fileBytes, fromSource, fromTo);
    this.fileBytes = await new Response(bblob).arrayBuffer();
    //this.reRenderDoc(bblob);
  }
  setRotate = async (pageNumber: number, angle: number) => {

    if (!this.fileBytes) {
      this.fileBytes = await PdfHelperService.GetPdfBytes(this.dialogConfig.config.previewUrl);
    }
    let bblob = await PdfHelperService.DoPagesRotate(this.fileBytes, pageNumber, angle);
    this.fileBytes = await new Response(bblob).arrayBuffer();
    //this.reRenderDoc(bblob);
  }
  setDelete = async (pageNumber: number) => {

    if (!this.fileBytes) {
      this.fileBytes = await PdfHelperService.GetPdfBytes(this.dialogConfig.config.previewUrl);
    }
    let bblob = await PdfHelperService.DoDeletePages(this.fileBytes, pageNumber);
    this.fileBytes = await new Response(bblob).arrayBuffer();
    const anotmanager = this.wvInstance.docViewer.getAnnotationManager();
    const annots = anotmanager.getAnnotationsList().filter(x => x.getPageNumber() == pageNumber);
    if (annots.length > 0) {
      anotmanager.deleteAnnotations(annots);
    }
    //this.reRenderDoc(bblob);
  }
  handleBack = () => {
    this.router.navigate([`/submittals/form/${this.id}/step/2`]);
  }
  handlePreview = async () => {
    await this.handleSaveAction(() => {
      localStorage.removeItem('submittalObject');
      localStorage.setItem('submittalObject', JSON.stringify(this.dialogConfig));
      this.router.navigate([`/submittals/form/preview/${this.id}/${this.dialogConfig.pdfFiles.id}`]);
    });
  }

  createHeader = async (previewUrl, pdfFiles) => {
    let blobDoc;
    if (this.fileBytes) {
      blobDoc = await PdfHelperService.SetPdfHeader(this.fileBytes, pdfFiles);
    }
    else {
      blobDoc = await PdfHelperService.CreatePdfHeader(previewUrl, pdfFiles);
    }
    this.reRenderDoc(blobDoc);
  }
  reRenderDoc(blob: Blob) {
    this.wvInstance.loadDocument(blob);
    setTimeout(() => {
      this.wvInstance.setFitMode('FitWidth');
      this.wvInstance.openElements(['notesPanel']);

    }, 100); this._CustomService.hide();
  }
  handleUpdateDetail = async () => {
    this.wvInstance.openElements(['loadingModal']);

    setTimeout(() => {
      this.wvInstance.closeElements(['loadingModal']);
    }, 5000)
    const tempPdfFiles = this.dialogConfig && this.dialogConfig['pdfFiles'];
    let pdfFiles = {
      name: tempPdfFiles.name,
      mfg: tempPdfFiles.mfg,
      part: tempPdfFiles.part,
      description: tempPdfFiles.description,
      volt: tempPdfFiles.volt,
      lamp: tempPdfFiles.lamp,
      dim: tempPdfFiles.dim,
      runs: tempPdfFiles.runs,
      reorderData: this.reorderData
    }
    this.isFormSaved = false;
    this._CustomService.show();
    const { annotManager } = this.wvInstance;
    const xfdf = await annotManager.exportAnnotations({ links: false, widgets: false });
    this.dialogConfig['pdfFiles'].files.annotations = xfdf;
    this.createHeader(this.dialogConfig.config.previewUrl, pdfFiles);
  }
}
