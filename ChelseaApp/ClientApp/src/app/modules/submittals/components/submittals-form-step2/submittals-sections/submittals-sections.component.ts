import { Component, Input, Output, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { CommonService } from 'src/app/common.service';
import { HttpService } from 'src/app/components/http.service';
import { PdfActionComponent } from '../../pdf-action/pdf-action.component';
import { DialogService } from 'primeng/dynamicdialog';
import { PdfEditorActionComponent } from '../../pdf-editor-action/pdf-editor-action.component';

@Component({
  selector: 'app-submittals-sections',
  templateUrl: './submittals-sections.component.html',
  styleUrls: ['./submittals-sections.component.scss']
})
export class SubmittalsSectionsComponent implements OnInit {
  @ViewChild(PdfActionComponent, { static: false }) _PdfActionComponent: PdfActionComponent;
  @Input() submittal: any;
  @Input() itmindex = '0';
  @Input() id = '0';
  @Input() totalSubmittals = '0';
  @Output() removeFn = new EventEmitter();
  @Output() uploadSubmittalsCallback: EventEmitter<any> = new EventEmitter();
  @Output() toggleCallback: EventEmitter<any> = new EventEmitter();
  @Output() selectedActionCallback: EventEmitter<any> = new EventEmitter();
  selectedIndex: any = [];
  position: string = "right";
  isProgressBarIndex: any = -1
  multiple = true;
  isEdit = false;
  items: MenuItem[] = [];
  uploadedFiles: any[] = [];
  fileData: any = null;
  isPreviewDialog = false;
  previewUrl: any = '';
  pdfActionTitle = '';
  constructor(private httpService: HttpService, private router: Router, private _CommonService:CommonService, public dialogService: DialogService) { }

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
    let res = {
      submittalIndex: this.itmindex,
      itemIndex: index
    }
    this.removeFn.emit(res);
  }
  onUpload = (event: any) => {
    this.isProgressBarIndex = this.itmindex
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
        this.isProgressBarIndex = -1;
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

  handleMoveItem = (idx: number, action: any) => {
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



  handleViewAction = (position: string, previewUrl: any, type: number, fileName: string) => {
    this.position = position;
    this.previewUrl = "https://localhost:44339/api/Home/download?bloburl=" + fileName + ""
    this.pdfActionTitle = 'Preview';
    this.isPreviewDialog = true;
  }
  handleActionEdit = (position: string) => {
    this.previewUrl = "https://chelsea.skdedu.in/api/Home/download?bloburl=" + this.submittal['files'][this.itmindex]['fileName'] + "";
    //this.router.navigate([`/submittals/pdf-edit/${this.id}`, { url: this.previewUrl }]);
    // this.position = position;
    // this.pdfActionTitle = 'Edit PDF';
    // this.isPreviewDialog = true;  
    // setTimeout(() => {
    //   this._PdfActionComponent.initialDocker();
    // }, 200)
    // this.isPreviewDialog = true;
    let config={
      title:'Edit PDF',
      previewUrl:this.previewUrl,
      width:'90%'

    }
    this._CommonService.dialogComponentConfig(config, PdfEditorActionComponent).subscribe(res => {
      if (res != undefined) {

      } else {

      }
    })

  }

  handleChangeSubmittalName = (event: any) => {
    this.selectedActionCallback.emit({
      subIdx: this.itmindex,
      value: this.submittal['name'],
      action: 'change_name'
    })
    this.handleEdit(false)
  }

  niceBytes(x: any) {
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let l = 0, n = parseInt(x, 10) || 0;
    while (n >= 1024 && ++l) {
      n = n / 1024;
    }
    return (n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
  }
}
