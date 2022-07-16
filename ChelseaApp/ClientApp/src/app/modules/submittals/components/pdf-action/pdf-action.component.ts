import { Component, ViewChild, OnInit, ElementRef, Input } from '@angular/core';
import WebViewer from '@pdftron/pdfjs-express';

@Component({
  selector: 'app-pdf-action',
  templateUrl: './pdf-action.component.html',
  styleUrls: ['./pdf-action.component.scss']
})
export class PdfActionComponent implements OnInit{
  @ViewChild('viewer', { static: false }) viewer: ElementRef;
  @Input() previewUrl: any = "";
  wvInstance: any;
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
}


