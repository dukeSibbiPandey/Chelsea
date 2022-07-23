import { Component, ViewChild, OnInit, ElementRef, Input } from '@angular/core';
import WebViewer from '@pdftron/pdfjs-express';
import { HttpService } from 'src/app/components/http.service';
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib'
import { SubmittalService } from '../../submittal.service';
@Component({
  selector: 'app-pdf-action',
  templateUrl: './pdf-action.component.html',
  styleUrls: ['./pdf-action.component.scss']
})
export class PdfActionComponent implements OnInit {
  @ViewChild('viewer', { static: true }) viewer: ElementRef;
  @Input() previewUrl: any = "";
  wvInstance: any;
  currentIndex = 0;
  constructor(private httpService: HttpService, private _SubmittalService: SubmittalService) { }
  ngOnInit() {
    this.wvDocumentLoadedHandler = this.wvDocumentLoadedHandler.bind(this);
  }
  handleClick = () => {
    console.log(this.wvInstance)
  }

  initialDocker = () => {
    WebViewer({
      path: '../lib',
      initialDoc: this.previewUrl,
      licenseKey: 'irld89CMAcwPvMz4SJzz',
    }, this.viewer.nativeElement).then(instance => {
      this.wvInstance = instance;
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
        toolNames: [ToolNames['TEXT'], ToolNames['FREETEXT'], ToolNames['LINE'], ToolNames['RECTANGLE'], ToolNames['FREEHAND']],
        colors: [
          '#FF0000',
          '#0000FF',
        ],
      });
      this.wvInstance.updateTool(ToolNames['FREEHAND'], {
        buttonImage: this._SubmittalService.FREEHAND_ICON()
      });
      // this.wvInstance.updateTool(ToolNames['FREETEXT'], {
      //   buttonImage: this._SubmittalService.FREETEXT_ICON()
      // });
      this.viewer.nativeElement.addEventListener('pageChanged', (e) => {
        const [pageNumber] = e.detail;
        console.log(`Current page is ${pageNumber}`);
      });
      instance.docViewer.on('annotationsLoaded', () => {
        console.log('annotations loaded');
      });

      instance.docViewer.on('documentLoaded', this.wvDocumentLoadedHandler)
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
    // you can access docViewer object for low-level APIs
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

    });
  }

  handleSaveAction = async () => {
    debugger;
    const { docViewer, annotManager } = this.wvInstance;
    const xfdf = await annotManager.exportAnnotations({ links: false, widgets: false });
    /*const fileData = await docViewer.getDocument().getFileData({});
    const blob = new Blob([fileData], {type: 'application/pdf'});

    const data = new FormData();
    data.append('xfdf', xfdf);
    data.append('file', blob);
    data.append('license', "irld89CMAcwPvMz4SJzz");

    // Process the file
    const response = await fetch('https://api.pdfjs.express/xfdf/merge', {
      method: 'post',
      body: data
    }).then(resp => resp.json());

    const { url, key, id } = response;

    // Download the file
    const mergedFileBlob = await fetch(url, {
      headers: {
        Authorization: key
      }
    }).then(resp => resp.blob())*/

    // const formData = new FormData();
    // const submittalObj  = JSON.stringify({submittalId: 1});
    // formData.append('file', mergedFileBlob);
    // formData.append('saveModel', submittalObj);
    let url = 'home/auto/save';
    this.httpService.fileupload(url, {}, null, null).subscribe(res => {
    })

    /*const { docViewer, annotManager, annotations } = this.wvInstance;
    const annotationList = annotManager.getAnnotationsList();
    const existingPdfBytes = await fetch(this.previewUrl).then(res => res.arrayBuffer())
    const pdfDoc = await PDFDocument.load(existingPdfBytes)
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const pages = pdfDoc.getPages()
    const firstPage = pages[0]
    const { width, height } = firstPage.getSize()
    annotationList.forEach(function (obj) {
      if (obj.ToolName == "AnnotationCreateFreeTextswqwd") {
        firstPage.drawText(obj.HY, {
          x: obj.Xt,
          y: height - obj.Yt,
          size: parseInt(obj.OE.replace('pt', '')),
          font: helveticaFont,
          color: rgb(1, 0, 0),
          rotate: degrees(-45),
        })
      } else if (obj.ToolName == "AnnotationCreateRectangle") {
        firstPage.drawRectangle({
          x: obj.Xt,
          y: height - obj.Yt,
          width: obj.qq,
          height: obj.pq,
          borderColor: rgb(1, 0, 0),
          borderWidth: 1.5,
        })
      }
    })


    const pdfBytes = await pdfDoc.save()
    // const documentStream = await docViewer.getDocument().getFileData({});
    // const documentBlob = new Blob([documentStream], { type: 'application/pdf' });
    // window.open(URL.createObjectURL(documentBlob))
    // //const fileArray = await documentBlob.arrayBuffer();
    const file = new File([pdfBytes], "test.pdf");
    // // Get the resulting blob from the merge operation
    let url = 'home/auto/save';
    const formData = new FormData();
    formData.append('file', file);
    // trigger a download for the user!
    this.httpService.fileupload(url, formData, null, null).subscribe(res => {
    })*/
  }
}