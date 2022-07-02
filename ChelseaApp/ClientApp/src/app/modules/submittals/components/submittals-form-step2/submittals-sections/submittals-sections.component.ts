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
  multiple = true;
  isEdit = false;
  items: MenuItem[] = [];
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
  }
  handleEdit = (value: boolean) => {
    this.isEdit = value
  }
  handleDelete(index: number) {
    console.log("chaild delete called");
    let res = {
      submittalIndex: this.itmindex,
      itemIndex: index
    }
    this.removeFn.emit(res);
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
        let data: any = {
          formData: {
            ...res,
          },
          info: {
            noSamples: 0,
            owner: 'John Smith',
            createdAt: new Date(),
            itmindex: this.itmindex
          }
        }
        this.uploadSubmittalsCallback.emit(data)
      })
    })
  }
  removeImage = (target: any, str: string) => {
  }
}
