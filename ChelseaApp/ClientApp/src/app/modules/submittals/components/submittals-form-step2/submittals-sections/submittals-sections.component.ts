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
  @Output() uploadSubmittalsCallback: EventEmitter<any> = new EventEmitter();
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
    let data: any = {
      name: this.submittal.name,
      fileName: 'abc.png',
      itmindex:this.itmindex
    }
    this.uploadSubmittalsCallback.emit(data)
    // event.files.forEach((element: any, index: any) => {
    //   this.fileData = <File>event.files[index];
    //   const formData = new FormData();
    //   formData.append('file', this.fileData);
    //   this.httpService.fileupload(url, formData, null, null).subscribe(res => {
    //     debugger
    //   })

    // })
  }
  onFileSelected = (event: any) => {
    debugger
  }
  myUploader = (event: any, control: any) => {

  }
  removeImage = (target: any, str: string) => {
  }
}
