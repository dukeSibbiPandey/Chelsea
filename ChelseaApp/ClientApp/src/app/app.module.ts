import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PdfEditorComponent } from './pdf-editor/pdf-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    PdfEditorComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
