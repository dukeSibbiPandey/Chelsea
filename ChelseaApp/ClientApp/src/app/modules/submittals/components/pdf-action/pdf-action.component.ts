import { Component, ViewChild, OnInit, ElementRef, Input } from '@angular/core';
import WebViewer from '@pdftron/pdfjs-express';
import { HttpService } from 'src/app/components/http.service';
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib'
@Component({
  selector: 'app-pdf-action',
  templateUrl: './pdf-action.component.html',
  styleUrls: ['./pdf-action.component.scss']
})
export class PdfActionComponent implements OnInit{
  @ViewChild('viewer', { static: false }) viewer: ElementRef;
  @Input() previewUrl: any = "";
  wvInstance: any;
  constructor(private httpService: HttpService) { }
  ngOnInit() {
    this.wvDocumentLoadedHandler = this.wvDocumentLoadedHandler.bind(this);
  }
  
  initialDocker = () => {
    WebViewer({
      path: '../lib',
      initialDoc: this.previewUrl
    }, this.viewer.nativeElement).then(instance => {
      this.wvInstance = instance;

      // now you can access APIs through this.webviewer.getInstance()
      instance.openElements(['notesPanel']);
      // see https://www.pdftron.com/documentation/web/guides/ui/apis for the full list of APIs

      // or listen to events from the viewer element
      this.viewer.nativeElement.addEventListener('pageChanged', (e) => {
        const [pageNumber] = e.detail;
        console.log(`Current page is ${pageNumber}`);
      });

      // or from the docViewer instance
      instance.docViewer.on('annotationsLoaded', () => {
        console.log('annotations loaded');
      });

      instance.docViewer.on('documentLoaded', this.wvDocumentLoadedHandler)      
    })
  }
  wvDocumentLoadedHandler(): void {
    // you can access docViewer object for low-level APIs
    const docViewer = this.wvInstance;
    const annotManager = this.wvInstance.annotManager;
    // and access classes defined in the WebViewer iframe
    const { Annotations } = this.wvInstance;
    const rectangle = new Annotations.RectangleAnnotation();
    rectangle.PageNumber = 1;
    rectangle.X = 100;
    rectangle.Y = 100;
    rectangle.Width = 250;
    rectangle.Height = 250;
    rectangle.StrokeThickness = 5;
    rectangle.Author = annotManager.getCurrentUser();
    annotManager.drawAnnotations(rectangle.PageNumber);
    //annotManager.addAnnotation(rectangle);
    // see https://www.pdftron.com/api/web/WebViewer.html for the full list of low-level APIs
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


