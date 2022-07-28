import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { CommonService } from 'src/app/common.service';
import { HttpService } from 'src/app/components/http.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SubmittalService } from '../../../submittal.service';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
@Component({
  selector: 'app-submittals-sections',
  templateUrl: './submittals-sections.component.html',
  styleUrls: ['./submittals-sections.component.scss']
})
export class SubmittalsSectionsComponent implements OnInit {
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

  icon: any = {
    DEL_ICON: '',
    MOVE_UP_ICON: '',
    MOVE_DOWN_ICON: ''
  }
  constructor(private httpService: HttpService, private router: Router, private _CommonService: CommonService, public dialogService: DialogService, private _SubmittalService: SubmittalService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.items = [
      { label: 'Update', icon: 'pi pi-refresh' },
      { label: 'Delete', icon: 'pi pi-times' },
      { label: 'Angular.io', icon: 'pi pi-info' },
      { label: 'Setup', icon: 'pi pi-cog' }
    ];
    this.DEL_ICON();
    this.MOVE_UP_ICON();
    this.MOVE_DOWN_ICON();
    this.COLLAPSE_MINUS_ICON();
    this.COLLAPSE_PLUS_ICON();
  }
  DEL_ICON = () => {
    const icon = this._SubmittalService.DEL_ICON();
    this.icon.DEL_ICON = this.sanitizer.bypassSecurityTrustHtml(
      icon
    );
  }

  MOVE_UP_ICON = () => {
    const icon = this._SubmittalService.MOVE_UP_ICON();
    this.icon.MOVE_UP_ICON = this.sanitizer.bypassSecurityTrustHtml(
      icon
    );
  }
  MOVE_DOWN_ICON = () => {
    const icon = this._SubmittalService.MOVE_DOWN_ICON();
    this.icon.MOVE_DOWN_ICON = this.sanitizer.bypassSecurityTrustHtml(
      icon
    );
  }
  COLLAPSE_MINUS_ICON = () => {
    const icon = this._SubmittalService.COLLAPSE_MINUS_ICON();
    this.icon.COLLAPSE_MINUS_ICON = this.sanitizer.bypassSecurityTrustHtml(
      icon
    );
  }
  COLLAPSE_PLUS_ICON = () => {
    const icon = this._SubmittalService.COLLAPSE_PLUS_ICON();
    this.icon.COLLAPSE_PLUS_ICON = this.sanitizer.bypassSecurityTrustHtml(
      icon
    );
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
    this.previewUrl = "https://chelsea.skdedu.in/api/Home/download?bloburl=" + fileName + ""
    this.pdfActionTitle = 'Preview';
    this.isPreviewDialog = true;
  }
  handleActionEdit = (index) => {
    let submitalData = JSON.parse(JSON.stringify(this.submittal))
    submitalData['files'] = submitalData.files[index]
    // this.previewUrl = "https://chelsea.skdedu.in/api/Home/download?bloburl=" + this.submittal['files'][index]['fileName'] + "";
    this.previewUrl = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
    let config = {
      title: 'Edit PDF',
      previewUrl: this.previewUrl,
      width: '90%',
      submitalData: submitalData,
      itemIndex: index,
      submittalIndex: this.itmindex
    }
    localStorage.removeItem('submittalObject');
    localStorage.setItem('submittalObject', JSON.stringify(config));
    this.router.navigate([`/submittals/pdf-edit/${this.id}`]);
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
