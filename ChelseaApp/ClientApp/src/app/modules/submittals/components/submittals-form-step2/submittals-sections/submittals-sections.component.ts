import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { HttpService } from 'src/app/components/http.service';

@Component({
  selector: 'app-submittals-sections',
  templateUrl: './submittals-sections.component.html',
  styleUrls: ['./submittals-sections.component.scss']
})
export class SubmittalsSectionsComponent implements OnInit {
  @Input() submittal: any;
  @Input() itmindex = '0';
  @Output() removeFn = new EventEmitter();
  templateList: any = [];
  multiple = true;
  isEdit = false;
  items: MenuItem[] = [];
  transmittedFor: string = '';
  uploadedFiles: any[] = [];
  fileData: any = null;
  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
    this.items = [
      { label: 'Update', icon: 'pi pi-refresh' },
      { label: 'Delete', icon: 'pi pi-times' },
      { label: 'Angular.io', icon: 'pi pi-info' },
      { label: 'Setup', icon: 'pi pi-cog' }
    ];
    this.templateList = [
      {
        info: {
          image: 'thumb_1.jpg',
          fileName: '010622 Sample file.pdf',
          fileSize: '2.5 mb'
        },
        noSamples: 5,
        owner: 'John Smith',
        createdAt: '06/06/2022'
      },
      {
        info: {
          image: 'thumb_2.jpg',
          fileName: '020622 Sample file.pdf',
          fileSize: '3.0 mb'
        },
        noSamples: 4,
        owner: 'Jane Doe',
        createdAt: '06/05/2022'
      }
    ]
  }
  handleEdit = (value: boolean) => {
    this.isEdit = value
  }
  handleDelete() {
    console.log("chaild delete called");
    this.removeFn.emit(this.itmindex);
  }


  onUpload = (event: any) => {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    let url = 'home/upload';
    event.files.forEach((element: any, index: any) => {
      this.fileData = <File>event.files[index];
      const formData = new FormData();
      formData.append('file', this.fileData);
      this.httpService.fileupload(url, formData, null, null).subscribe(res => {
        debugger
      })

    })
  }
  onFileSelected = (event: any) => {
    debugger
  }
  myUploader = (event: any, control: any) => {
    debugger
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    // event.files.forEach((element: any, index: any) => {
    //   this.fileData = <File>event.files[index];
    //   let url = '/';
    //   const formData = new FormData();
    //   formData.append('file', this.fileData);
    //   debugger
    //   formData.append('entityKey', this.entityKey);
    //   formData.append('entityType', this.entityType);
    //   this.fileUploadNumber = 0;
    //   this.isUploadBar = true;
    //   var headers = { entityKey: this.entityKey, entityType: this.entityType, reportProgress: true, observe: 'events' }
    //   this._AgentService.httpCall(url, 'FileUpload', formData, null, headers).subscribe(res => {
    //     if (res && res['responseCode'] == 200) {
    //       this.fileUploadNumber = this.fileUploadNumber + 1;
    //       const newArray = [res.result].concat(this.documentList)
    //       this.documentList = newArray;
    //       if (this.fileUploadNumber == event.files.length) {
    //         this.isUploadBar = false;
    //         this.toastMsg('success', 'Success', 'Files uploaded successfully')
    //       }
    //     }
    //   }, (errors) => {
    //     var res = errors.error;
    //     this.toastMsg('error', 'Error', `${res.messege || 'Faliure'}`)
    //   })
    // });
  }
  removeImage = (target: any, str: string) => {
  }
}
