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
  @Input() totalSubmittals = '0';
  @Output() removeFn = new EventEmitter();
  @Output() uploadSubmittalsCallback: EventEmitter<any> = new EventEmitter();
  @Output() toggleCallback: EventEmitter<any> = new EventEmitter();
  @Output() selectedActionCallback: EventEmitter<any> = new EventEmitter();
  selectedIndex: any = [];
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
  handleToggle = () => {
    this.submittal.isOpen = !this.submittal.isOpen;
    this.toggleCallback.emit({
      isOpen: this.submittal.isOpen,
      idx: this.itmindex
    })
  }
  handleSelectTiles = () => {
    let temp: any = [];
    this.submittal.files.map((item: any, index: number) => {
      if (item.isSelected && item.isSelected.length > 0) {
        temp.push(index)
      }
    })
    this.selectedIndex = temp;
  }
  handleRemoveSelected = () => {
    this.selectedActionCallback.emit({
      selectedIndex: this.selectedIndex,
      itmindex: this.itmindex,
      action: 'delete'
    })
  }
  handleRemoveSelectedSubmittal = () => {
    this.selectedActionCallback.emit({
      idx: this.itmindex,
      action: 'delete'
    })
  }
  handleDuplicate = (item: any) => {
    this.selectedActionCallback.emit({
      submittal: item,
      itmindex: this.itmindex,
      action: 'duplicate'
    })
  }
  handleCopySubmittalItem = (item: any) => {
    this.selectedActionCallback.emit({
      file: item,
      idx: this.itmindex,
      action: 'copyItem'
    })
  }

  handleMoveItem = (idx:number, action: any) => {
    let fIdx: any = idx;
    let toIdx: any;
    if (action == 'left') {
      toIdx = fIdx - 1
    } else if (action == 'right') {
      toIdx = fIdx + 1
    }
    this.selectedActionCallback.emit({
      subIdx: this.itmindex,
      fIdx: fIdx,
      toIdx: toIdx,
      action: 'move_item'
    })
  }
  handleMove = (action: any) => {
    let fIdx: any = this.itmindex;
    let toIdx: any;
    if (action == 'down') {
      toIdx = fIdx + 1
    } else if (action == 'up') {
      toIdx = fIdx - 1
    }
    this.selectedActionCallback.emit({
      idx: this.itmindex,
      fIdx: fIdx,
      toIdx: toIdx,
      action: 'move'
    })
  }
}
