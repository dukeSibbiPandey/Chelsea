import { Component, Output, EventEmitter, Input } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [PrimeNGConfig, MessageService]
})
export class FileUploadComponent {
  @Output() uploadCallback: EventEmitter<any> = new EventEmitter();
  @Input() itmindex = '0';
  @Input() isProgressBarIndex = '0';
  files: any[] = [];
  constructor(private messageService: MessageService) { }
  /**
   * on file drop handler
   */
  onFileDropped($event) {
    debugger
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(event) {
    const files = event.target.files;
    this.prepareFilesList(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    this.files = []
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    let data = {
      files: this.files
    };
    if (this.files[0].type.match('application/pdf')) {
      this.uploadCallback.emit(data)
      this.uploadFilesSimulator(0);
    } else {
      this.files = []
      this.toastMsg('error', 'Error', 'Invalid file type', 2000);
    }

  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  toastMsg(severity: any, summary: any, detail: any, life: any) {
    this.messageService.add({ key: 'fileUploadToast', severity: severity, summary: summary, detail: detail, life: life, closable: true });
  }
}
