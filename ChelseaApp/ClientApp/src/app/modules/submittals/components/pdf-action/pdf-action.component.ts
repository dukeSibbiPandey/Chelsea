import { Component, ViewChild, OnInit, ElementRef, Input } from '@angular/core';
import WebViewer from '@pdftron/pdfjs-express';
import { HttpService } from 'src/app/components/http.service';
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib'
@Component({
  selector: 'app-pdf-action',
  templateUrl: './pdf-action.component.html',
  styleUrls: ['./pdf-action.component.scss']
})
export class PdfActionComponent implements OnInit {
  @ViewChild('viewer', { static: false }) viewer: ElementRef;
  @Input() previewUrl: any = "";
  wvInstance: any;
  constructor(private httpService: HttpService) { }
  ngOnInit() {
    this.wvDocumentLoadedHandler = this.wvDocumentLoadedHandler.bind(this);
  }
  handleClick=()=>{
    debugger
    console.log(this.wvInstance)
  }

  initialDocker = () => {
    debugger
    WebViewer({
      path: '../lib',
      initialDoc: this.previewUrl
    }, this.viewer.nativeElement).then(instance => {
      this.wvInstance = instance;
      instance.setFitMode('FitWidth')
      instance.disableFeatures([instance.Feature.Print, instance.Feature.FilePicker]);
      instance.disableElements(['menuButton', 'searchButton', 'miscToolGroupButton', 'signatureToolButton', 'eraserToolButton', 'selectToolButton', 'panToolButton', 'viewControlsButton', 'outlinesPanelButton', 'notesPanelButton']);
      instance.openElements(['notesPanel']);
      // now you can access APIs through this.webviewer.getInstance()
      // see https://www.pdftron.com/documentation/web/guides/ui/apis for the full list of APIs

      // or listen to events from the viewer element
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
  customReduIcon = (docViewer) => {
    const icon = {
      type: 'actionButton',
      img: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#EEEEEE"/>
      <path d="M20.2 23.25C20.4833 23.25 20.7167 23.1542 20.9 22.9625C21.0833 22.7709 21.175 22.5334 21.175 22.25C21.175 21.9667 21.0833 21.7292 20.9 21.5375C20.7167 21.3459 20.4833 21.25 20.2 21.25H13.725C12.625 21.25 11.675 20.8875 10.875 20.1625C10.075 19.4375 9.675 18.5334 9.675 17.45C9.675 16.3667 10.075 15.4625 10.875 14.7375C11.675 14.0125 12.625 13.65 13.725 13.65H20.525L18.6 15.55C18.4 15.75 18.3 15.9834 18.3 16.25C18.3 16.5167 18.4 16.75 18.6 16.95C18.8 17.15 19.0333 17.25 19.3 17.25C19.5667 17.25 19.8 17.15 20 16.95L23.6 13.35C23.7 13.25 23.7708 13.1417 23.8125 13.025C23.8542 12.9084 23.875 12.7834 23.875 12.65C23.875 12.5167 23.8542 12.3917 23.8125 12.275C23.7708 12.1584 23.7 12.05 23.6 11.95L20 8.35005C19.8 8.15005 19.5667 8.05005 19.3 8.05005C19.0333 8.05005 18.8 8.15005 18.6 8.35005C18.4 8.55005 18.3 8.78338 18.3 9.05005C18.3 9.31672 18.4 9.55005 18.6 9.75005L20.525 11.65H13.75C12.1 11.65 10.6792 12.2125 9.4875 13.3375C8.29583 14.4625 7.7 15.8334 7.7 17.45C7.7 19.0667 8.29583 20.4375 9.4875 21.5625C10.6792 22.6875 12.1 23.25 13.75 23.25H20.2Z" fill="#333333"/>
      </svg>`,
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
      img: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#EEEEEE"/>
      <path d="M11.8 23.25C11.5167 23.25 11.2833 23.1542 11.1 22.9625C10.9167 22.7709 10.825 22.5334 10.825 22.25C10.825 21.9667 10.9167 21.7292 11.1 21.5375C11.2833 21.3459 11.5167 21.25 11.8 21.25H18.275C19.375 21.25 20.325 20.8875 21.125 20.1625C21.925 19.4375 22.325 18.5334 22.325 17.45C22.325 16.3667 21.925 15.4625 21.125 14.7375C20.325 14.0125 19.375 13.65 18.275 13.65H11.475L13.4 15.55C13.6 15.75 13.7 15.9834 13.7 16.25C13.7 16.5167 13.6 16.75 13.4 16.95C13.2 17.15 12.9667 17.25 12.7 17.25C12.4333 17.25 12.2 17.15 12 16.95L8.4 13.35C8.3 13.25 8.22917 13.1417 8.1875 13.025C8.14583 12.9084 8.125 12.7834 8.125 12.65C8.125 12.5167 8.14583 12.3917 8.1875 12.275C8.22917 12.1584 8.3 12.05 8.4 11.95L12 8.35005C12.2 8.15005 12.4333 8.05005 12.7 8.05005C12.9667 8.05005 13.2 8.15005 13.4 8.35005C13.6 8.55005 13.7 8.78338 13.7 9.05005C13.7 9.31672 13.6 9.55005 13.4 9.75005L11.475 11.65H18.25C19.9 11.65 21.3208 12.2125 22.5125 13.3375C23.7042 14.4625 24.3 15.8334 24.3 17.45C24.3 19.0667 23.7042 20.4375 22.5125 21.5625C21.3208 22.6875 19.9 23.25 18.25 23.25H11.8Z" fill="#333333"/>
      </svg>`,
      onClick: () => {
        const historyManager = docViewer.getAnnotationHistoryManager();
        historyManager.undo();
      },
      dataElement: 'undo',
    }
    return icon
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
    this.wvInstance.setHeaderItems(function (header) {
      var items = header.getItems();
      items.push({
        type: 'customElement',
        title: 'Page',
        render: function () {
          let slider: any = document.createElement('input');
          slider.type = 'text';
          slider.value = currentPage;
          slider.tabIndex = "-1";
          slider.style = "width: 11.5px; border:1px red solid; font-size: medium; margin-top: -1px;";
          slider.oninput = function () {
            console.log('---oninput---');
          };
          slider.addEventListener("focusout", function (event) {
            console.log('---onfocusout---');
            if (slider.value == '' || (slider.value > TotalPageNumber) || (slider.value != docViewer.getCurrentPage())) {
              slider.value = docViewer.getCurrentPage();
            }
          });
          slider.addEventListener("keyup", function (event) {
            console.log('---keyup---', slider.value, event.key);
            if (event.key == 'Enter') {
              if (slider.value != '' && (slider.value <= TotalPageNumber)) {
                docViewer.setCurrentPage(slider.value);
              }
              else {
                slider.value = docViewer.getCurrentPage();
              }
            }
          });
          var pageNum: any = document.createElement('input');
          pageNum.type = 'text';
          pageNum.value = " /  " + TotalPageNumber;
          pageNum.tabindex = "-1";
          pageNum.class='go_to_index  '
          pageNum.style = "width: 30px; border:none; font-size: medium; margin-top: -1px;background-color: white;";
          pageNum.disabled = true;
          var form: any = document.createElement('div');
          form.style = "display: flex; border-radius: 10px;padding: 10px;cursor: pointer;";
          form.appendChild(slider);
          form.appendChild(pageNum);
          return form;
        }

      });

      header.update(items);

    });
  }

  handleSaveAction=async ()=>{
    const { docViewer, annotManager, annotations } = this.wvInstance;

    debugger;

    const annotationList = annotManager.getAnnotationsList();

    const existingPdfBytes = await fetch(this.previewUrl).then(res => res.arrayBuffer())

    const pdfDoc = await PDFDocument.load(existingPdfBytes)
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  
    const pages = pdfDoc.getPages()
    const firstPage = pages[0]
    const { width, height } = firstPage.getSize()
    annotationList.forEach(function(obj){
      if(obj.ToolName=="AnnotationCreateFreeTextswqwd")
      {
        firstPage.drawText(obj.HY, {
          x: obj.Xt,
          y: height-obj.Yt,
          size: parseInt(obj.OE.replace('pt', '')),
          font: helveticaFont,
          color: rgb(1, 0, 0),//rgb(obj.jk.R, obj.jk.G, obj.jk.B),
          rotate: degrees(-45),
        })
     }else if(obj.ToolName=="AnnotationCreateRectangle")
     {
      firstPage.drawRectangle({
        x: obj.Xt,
        y: height-obj.Yt,
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
    const file  =  new File([pdfBytes], "test.pdf");
    // // Get the resulting blob from the merge operation
     let url = 'home/auto/save';  
     const formData = new FormData();
    formData.append('file',  file);
    // trigger a download for the user!
    this.httpService.fileupload(url, formData, null, null).subscribe(res => {
      
    })
  }
}


