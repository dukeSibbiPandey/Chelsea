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
  currentIndex = 0;
  constructor(private httpService: HttpService) { }
  ngOnInit() {
    this.wvDocumentLoadedHandler = this.wvDocumentLoadedHandler.bind(this);
  }
  handleClick = () => {
    console.log(this.wvInstance)
  }

  initialDocker = () => {
    WebViewer({
      path: '../lib',
      initialDoc: this.previewUrl
    }, this.viewer.nativeElement).then(instance => {
      this.wvInstance = instance;
      instance.setFitMode('FitWidth')
      instance.disableFeatures([instance.Feature.Print, instance.Feature.FilePicker]);
      instance.disableElements(['menuButton', 'searchButton', 'miscToolGroupButton', 'signatureToolButton', 'eraserToolButton', 'selectToolButton', 'panToolButton', 'viewControlsButton', 'outlinesPanelButton', 'notesPanelButton', 'zoomOutButton', 'zoomInButton', 'zoomOverlayButton', 'freeHandToolGroupButton', 'textToolGroupButton', 'stickyToolButton', 'ellipseToolButton', 'arrowToolButton', 'polylineToolButton', 'polygonToolButton', 'cloudToolButton']);
      instance.openElements(['notesPanel']);
      // now you can access APIs through this.webviewer.getInstance()
      // see https://www.pdftron.com/documentation/web/guides/ui/apis for the full list of APIs

      // or listen to events from the viewer element
      const ToolNames = this.wvInstance.Tools.ToolNames;
      debugger
      this.wvInstance.setColorPalette({
        toolNames: [ToolNames['FREETEXT'], ToolNames['LINE'], ToolNames['RECTANGLE']],
        colors: [
          '#0000FF',
          '#000000'
        ],
      });
      this.wvInstance.updateTool(ToolNames['FREETEXT'], {
        buttonImage: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="#EEEEEE" />
        <path
            d="M5.67499 27.325C5.39165 27.325 5.15415 27.2292 4.96249 27.0375C4.77082 26.8458 4.67499 26.6083 4.67499 26.325V22.5C4.67499 22.2333 4.77082 22.0042 4.96249 21.8125C5.15415 21.6208 5.39165 21.525 5.67499 21.525H6.64999V10.475H5.67499C5.39165 10.475 5.15415 10.3792 4.96249 10.1875C4.77082 9.99582 4.67499 9.76665 4.67499 9.49999V5.67499C4.67499 5.39165 4.77082 5.15415 4.96249 4.96249C5.15415 4.77082 5.39165 4.67499 5.67499 4.67499H9.49999C9.76665 4.67499 9.99582 4.77082 10.1875 4.96249C10.3792 5.15415 10.475 5.39165 10.475 5.67499V6.64999H21.525V5.67499C21.525 5.39165 21.6208 5.15415 21.8125 4.96249C22.0042 4.77082 22.2333 4.67499 22.5 4.67499H26.325C26.6083 4.67499 26.8458 4.77082 27.0375 4.96249C27.2292 5.15415 27.325 5.39165 27.325 5.67499V9.49999C27.325 9.76665 27.2292 9.99582 27.0375 10.1875C26.8458 10.3792 26.6083 10.475 26.325 10.475H25.35V21.525H26.325C26.6083 21.525 26.8458 21.6208 27.0375 21.8125C27.2292 22.0042 27.325 22.2333 27.325 22.5V26.325C27.325 26.6083 27.2292 26.8458 27.0375 27.0375C26.8458 27.2292 26.6083 27.325 26.325 27.325H22.5C22.2333 27.325 22.0042 27.2292 21.8125 27.0375C21.6208 26.8458 21.525 26.6083 21.525 26.325V25.35H10.475V26.325C10.475 26.6083 10.3792 26.8458 10.1875 27.0375C9.99582 27.2292 9.76665 27.325 9.49999 27.325H5.67499ZM10.475 23.375H21.525V22.5C21.525 22.2333 21.6208 22.0042 21.8125 21.8125C22.0042 21.6208 22.2333 21.525 22.5 21.525H23.375V10.475H22.5C22.2333 10.475 22.0042 10.3792 21.8125 10.1875C21.6208 9.99582 21.525 9.76665 21.525 9.49999V8.62499H10.475V9.49999C10.475 9.76665 10.3792 9.99582 10.1875 10.1875C9.99582 10.3792 9.76665 10.475 9.49999 10.475H8.62499V21.525H9.49999C9.76665 21.525 9.99582 21.6208 10.1875 21.8125C10.3792 22.0042 10.475 22.2333 10.475 22.5V23.375ZM12.8 20.2C12.5167 20.2 12.3042 20.1042 12.1625 19.9125C12.0208 19.7208 12.0083 19.4917 12.125 19.225L15.075 11.15C15.1417 10.9833 15.2625 10.8375 15.4375 10.7125C15.6125 10.5875 15.8 10.525 16 10.525C16.2 10.525 16.3792 10.5875 16.5375 10.7125C16.6958 10.8375 16.8167 10.9833 16.9 11.15L19.925 19.3C20.025 19.55 20.0083 19.7625 19.875 19.9375C19.7417 20.1125 19.5333 20.2 19.25 20.2C19.1 20.2 18.9542 20.15 18.8125 20.05C18.6708 19.95 18.5833 19.825 18.55 19.675L17.8 17.625H14.275L13.55 19.675C13.5 19.8417 13.4042 19.9708 13.2625 20.0625C13.1208 20.1542 12.9667 20.2 12.8 20.2ZM14.625 16.35H17.4L16.075 12.525H15.9L14.625 16.35ZM6.34999 8.82499H8.82499V6.34999H6.34999V8.82499ZM23.175 8.82499H25.65V6.34999H23.175V8.82499ZM23.175 25.65H25.65V23.175H23.175V25.65ZM6.34999 25.65H8.82499V23.175H6.34999V25.65Z"
            fill="black" />
    </svg>`
      });
        this.wvInstance.updateTool(ToolNames['LINE'], {
          buttonImage: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="#EEEEEE" />
          <path
              d="M18.25 25.3C18.0167 25.3 17.8167 25.2167 17.65 25.05C17.4833 24.8833 17.4 24.6833 17.4 24.45C17.4 24.2167 17.4833 24.0208 17.65 23.8625C17.8167 23.7042 18.0167 23.625 18.25 23.625C19.2 23.625 20.0042 23.4333 20.6625 23.05C21.3208 22.6667 21.65 22.2167 21.65 21.7C21.65 21.35 21.4125 20.9958 20.9375 20.6375C20.4625 20.2792 19.8083 20 18.975 19.8L20.25 18.5C21.3167 18.8333 22.0958 19.2792 22.5875 19.8375C23.0792 20.3958 23.325 21.0167 23.325 21.7C23.325 22.85 22.8083 23.7375 21.775 24.3625C20.7417 24.9875 19.5667 25.3 18.25 25.3ZM9.70001 17.5C8.56667 17.25 7.76667 16.8708 7.30001 16.3625C6.83334 15.8542 6.60001 15.3167 6.60001 14.75C6.60001 14.15 6.81251 13.6042 7.23751 13.1125C7.66251 12.6208 8.68334 12.1 10.3 11.55C11.3667 11.2 12.0583 10.9 12.375 10.65C12.6917 10.4 12.85 10.1083 12.85 9.77499C12.85 9.39165 12.6708 9.05832 12.3125 8.77499C11.9542 8.49165 11.4083 8.34999 10.675 8.34999C10.2417 8.34999 9.87084 8.40415 9.56251 8.51249C9.25417 8.62082 8.97501 8.79165 8.72501 9.02499C8.57501 9.19165 8.38751 9.28332 8.16251 9.29999C7.93751 9.31665 7.73334 9.25832 7.55001 9.12499C7.35001 8.97499 7.24584 8.78749 7.23751 8.56249C7.22917 8.33749 7.29167 8.14165 7.42501 7.97499C7.72501 7.60832 8.16251 7.29999 8.73751 7.04999C9.31251 6.79999 9.95834 6.67499 10.675 6.67499C11.825 6.67499 12.75 6.95415 13.45 7.51249C14.15 8.07082 14.5 8.82499 14.5 9.77499C14.5 10.525 14.2583 11.1417 13.775 11.625C13.2917 12.1083 12.35 12.5917 10.95 13.075C9.83334 13.475 9.10417 13.7958 8.76251 14.0375C8.42084 14.2792 8.25001 14.5167 8.25001 14.75C8.25001 15.0167 8.47501 15.2667 8.92501 15.5C9.37501 15.7333 10.075 15.9583 11.025 16.175L9.70001 17.5ZM22.75 13.675L19.325 10.25L20.45 9.12499C20.7667 8.80832 21.1292 8.64582 21.5375 8.63749C21.9458 8.62915 22.325 8.79165 22.675 9.12499L23.875 10.325C24.2083 10.675 24.3708 11.0542 24.3625 11.4625C24.3542 11.8708 24.1917 12.2333 23.875 12.55L22.75 13.675ZM8.35001 25.15C8.21667 25.15 8.10001 25.1 8.00001 25C7.90001 24.9 7.85001 24.7833 7.85001 24.65V21.925C7.85001 21.875 7.89167 21.7583 7.97501 21.575L18.125 11.45L21.55 14.875L11.425 25.025C11.4083 25.0417 11.2917 25.0833 11.075 25.15H8.35001Z"
              fill="#333333" />
      </svg>`
        });
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

  customPagerFirst = (docViewer) => {
    const icon = {
      type: 'actionButton',
      id: 'undo-button',
      img: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
          d="M5.825 18.675C5.54166 18.675 5.30416 18.5792 5.1125 18.3875C4.92083 18.1958 4.825 17.9583 4.825 17.675V6.32501C4.825 6.04168 4.92083 5.80418 5.1125 5.61251C5.30416 5.42085 5.54166 5.32501 5.825 5.32501C6.10833 5.32501 6.34583 5.42085 6.5375 5.61251C6.72916 5.80418 6.825 6.04168 6.825 6.32501V17.675C6.825 17.9583 6.72916 18.1958 6.5375 18.3875C6.34583 18.5792 6.10833 18.675 5.825 18.675ZM17.6 17.575L10.725 12.825C10.4083 12.625 10.25 12.35 10.25 12C10.25 11.65 10.4083 11.375 10.725 11.175L17.6 6.42501C17.9333 6.17501 18.2792 6.14585 18.6375 6.33751C18.9958 6.52918 19.175 6.82501 19.175 7.22501V16.775C19.175 17.175 18.9958 17.4667 18.6375 17.65C18.2792 17.8333 17.9333 17.8083 17.6 17.575Z"
          fill="#333333" />
      </svg>`,
      onClick: () => {
        docViewer.setCurrentPage(1);
        this.updatePager(docViewer)
      },
      dataElement: 'first',
    }
    return icon
  }
  customPagerPrev = (docViewer) => {
    const icon = {
      type: 'actionButton',
      id: 'undo-button',
      img: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="white" />
      <path
          d="M19.325 21.625C19.5083 21.4084 19.6042 21.1667 19.6125 20.9C19.6208 20.6334 19.525 20.4 19.325 20.2L15.1 15.975L19.35 11.725C19.5333 11.5417 19.6208 11.3042 19.6125 11.0125C19.6042 10.7209 19.5083 10.4834 19.325 10.3C19.1083 10.0834 18.8708 9.97919 18.6125 9.98752C18.3542 9.99586 18.125 10.1 17.925 10.3L12.95 15.275C12.85 15.375 12.775 15.4834 12.725 15.6C12.675 15.7167 12.65 15.8417 12.65 15.975C12.65 16.1084 12.675 16.2334 12.725 16.35C12.775 16.4667 12.85 16.575 12.95 16.675L17.9 21.625C18.1 21.825 18.3333 21.9209 18.6 21.9125C18.8667 21.9042 19.1083 21.8084 19.325 21.625Z"
          fill="#333333" />
  </svg>`,
      onClick: () => {
        let currentPage = docViewer.getCurrentPage();
        if (currentPage > 1) {
          docViewer.setCurrentPage(currentPage - 1);
          this.updatePager(docViewer)
        }
      },
      dataElement: 'undo',
    }
    return icon
  }

  customPagerNext = (docViewer) => {
    const icon = {
      type: 'actionButton',
      id: 'undo-button',
      img: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="white" />
      <path
          d="M12.675 21.625C12.4917 21.4084 12.3958 21.1667 12.3875 20.9C12.3792 20.6334 12.475 20.4 12.675 20.2L16.9 15.975L12.65 11.725C12.4667 11.5417 12.3792 11.3042 12.3875 11.0125C12.3958 10.7209 12.4917 10.4834 12.675 10.3C12.8917 10.0834 13.1292 9.97919 13.3875 9.98752C13.6458 9.99586 13.875 10.1 14.075 10.3L19.05 15.275C19.15 15.375 19.225 15.4834 19.275 15.6C19.325 15.7167 19.35 15.8417 19.35 15.975C19.35 16.1084 19.325 16.2334 19.275 16.35C19.225 16.4667 19.15 16.575 19.05 16.675L14.1 21.625C13.9 21.825 13.6667 21.9209 13.4 21.9125C13.1333 21.9042 12.8917 21.8084 12.675 21.625Z"
          fill="#333333" />
  </svg>`,
      onClick: () => {
        let currentPage = docViewer.getCurrentPage();
        let TotalPageNumber = docViewer.getPageCount();
        if (currentPage != TotalPageNumber) {
          docViewer.setCurrentPage(currentPage + 1);
          this.updatePager(docViewer)
        }
      },
      dataElement: 'undo',
    }
    return icon
  }
  customPagerlast = (docViewer) => {
    const icon = {
      type: 'actionButton',
      id: 'undo-button',
      img: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="white" />
      <path
          d="M22.175 22.675C21.8917 22.675 21.6542 22.5792 21.4625 22.3875C21.2708 22.1958 21.175 21.9583 21.175 21.675V10.325C21.175 10.0417 21.2708 9.80418 21.4625 9.61251C21.6542 9.42085 21.8917 9.32501 22.175 9.32501C22.4583 9.32501 22.6958 9.42085 22.8875 9.61251C23.0792 9.80418 23.175 10.0417 23.175 10.325V21.675C23.175 21.9583 23.0792 22.1958 22.8875 22.3875C22.6958 22.5792 22.4583 22.675 22.175 22.675ZM10.4 21.575C10.0667 21.8083 9.72083 21.8333 9.3625 21.65C9.00416 21.4667 8.825 21.175 8.825 20.775V11.225C8.825 10.825 9.00416 10.5292 9.3625 10.3375C9.72083 10.1458 10.0667 10.175 10.4 10.425L17.275 15.175C17.5917 15.375 17.75 15.65 17.75 16C17.75 16.35 17.5917 16.625 17.275 16.825L10.4 21.575Z"
          fill="#333333" />
  </svg>`,
      onClick: () => {
        debugger
        let TotalPageNumber = docViewer.getPageCount();
        docViewer.setCurrentPage(TotalPageNumber);
        this.updatePager(docViewer)
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
    const customPagerFirst = this.customPagerFirst(docViewer);
    const customPagerPrev = this.customPagerPrev(docViewer);
    const customPagerNext = this.customPagerNext(docViewer);
    const customPagerlast = this.customPagerlast(docViewer);
    debugger
    this.wvInstance.setHeaderItems((header) => {
      header.push(reduIcon);
      header.push(unduIcon);
      header.push(customPagerFirst);
      header.push(customPagerPrev);
      header.push(customPagerNext);
      header.push(customPagerlast);
    })
    let currentPage = docViewer.getCurrentPage();
    let TotalPageNumber = docViewer.getPageCount();
    this.wvInstance.setHeaderItems((header) => {
      var items = header.getItems();
      items.push({
        type: 'customElement',
        title: 'Page',
        render: () => {
          let pager: any = document.createElement('span');
          pager.id = 'pager';
          pager.innerHTML = `Page ${this.currentIndex}/${TotalPageNumber}`;
          let slider: any = document.createElement('input');
          slider.type = 'text';
          slider.value = currentPage;
          slider.tabIndex = "-1";
          slider.style = "width: 11.5px; border:1px red solid; font-size: medium; margin-top: -1px;";
          slider.oninput = function () {
            console.log('---oninput---');
          };
          slider.addEventListener("focusout", function (event) {
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
          pageNum.class = 'go_to_index  '
          pageNum.style = "width: 30px; border:none; font-size: medium; margin-top: -1px;background-color: white;";
          pageNum.disabled = true;
          var form: any = document.createElement('div');
          form.style = "display: flex; border-radius: 10px;padding: 10px;cursor: pointer;";
          form.appendChild(pager);
          // form.appendChild(slider);
          // form.appendChild(pageNum);
          return form;
        }

      });

      header.update(items);

    });
  }

  handleSaveAction = async () => {
    const { docViewer, annotManager, annotations } = this.wvInstance;
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
          color: rgb(1, 0, 0),//rgb(obj.jk.R, obj.jk.G, obj.jk.B),
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
    })
  }
}