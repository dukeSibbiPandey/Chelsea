import { Component, Input, Output, OnInit, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { HttpService } from 'src/app/components/http.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SubmittalService } from '../../../submittal.service';
import { DomSanitizer } from "@angular/platform-browser";
import { SubmittalsPreviewComponent } from '../../submittals-preview/submittals-preview.component';

@Component({
  selector: 'app-submittals-sections',
  templateUrl: './submittals-sections.component.html',
  styleUrls: ['./submittals-sections.component.scss'],
  providers: [ConfirmationService]
})
export class SubmittalsSectionsComponent implements OnInit {
  @Input() submittal: any;
  @Input() itmindex = '0';
  @Input() id = '0';
  @Input() totalSubmittals = '0';
  @Input() openIndex = [];
  @Output() removeFn = new EventEmitter();
  @ViewChild(SubmittalsPreviewComponent, { static: false }) _SubmittalsPreviewComponent: SubmittalsPreviewComponent;
  @Output() uploadSubmittalsCallback: EventEmitter<any> = new EventEmitter();
  @Output() toggleCallback: EventEmitter<any> = new EventEmitter();
  @Output() selectedActionCallback: EventEmitter<any> = new EventEmitter();
  @ViewChild('publicSearchBox') searchBoxField: ElementRef;
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
  pdfActionConfig: any = {};

  icon: any = {
    DEL_ICON: '',
    MOVE_UP_ICON: '',
    MOVE_DOWN_ICON: ''
  }
  constructor(private httpService: HttpService, private router: Router, public dialogService: DialogService, private _SubmittalService: SubmittalService, private sanitizer: DomSanitizer, private confirmationService: ConfirmationService) { }

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
    this.DUPLICATE_ICON();
  }
  ngAfterViewInit(): void {
    this.searchBoxField.nativeElement.focus();
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
  DUPLICATE_ICON = () => {
    const icon = this._SubmittalService.DUPLICATE_ICON();
    this.icon.DUPLICATE_ICON = this.sanitizer.bypassSecurityTrustHtml(
      icon
    );
  }

  handleEdit = (value: boolean) => {
    this.selectedActionCallback.emit({
      subIdx: this.itmindex,
      action: 'edit_name'
    })
  }
  callSaveAsDraft(pdfActionConfig, actionType) {
    this.selectedActionCallback.emit({
      action: 'SaveAsDraft',
      data: {
        pdfActionConfig: pdfActionConfig,
        actionType: actionType,
        action: 'SaveAsDraft',
      }
    })
  }
  handleDelete(index: number) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
        let res = {
          submittalIndex: this.itmindex,
          itemIndex: index
        }
        this.removeFn.emit(res);
      }
    });

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
    this.toggleCallback.emit({
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
  handleRemoveSelectedSubmittal = () => {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this record ?',
      accept: () => {
        this.selectedActionCallback.emit({
          idx: this.itmindex,
          action: 'delete'
        })
      }
    });
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



  handleViewAction = (item: any, index) => {
    this.previewUrl = this.httpService.getBaseUrl() + "Home/download?bloburl=" + item.fileName + ""
    let pdfFiles = JSON.parse(JSON.stringify(this.submittal));
    pdfFiles['files'] = item;
    let config = {
      itemIndex: index,
      submittalIndex: this.itmindex,
      submittalId: this.id,
      previewUrl: this.previewUrl,
      title: 'Preview',
      returnUrl: `/submittals/form/preview/${this.id}/${item.id}`
    }
    let pdfActionConfig = {
      pdfFiles: pdfFiles,
      config: config
    }
    if (pdfFiles.files.id) {
      localStorage.removeItem('submittalObject');
      localStorage.setItem('submittalObject', JSON.stringify(pdfActionConfig));
      this.router.navigate([`/submittals/form/preview/${this.id}/${item.id}`]);
    } else {
      this.callSaveAsDraft(pdfActionConfig, 'view');
    }

  }
  handleActionEdit = (item: any, index: number) => {
    this.previewUrl = this.httpService.getBaseUrl() + "Home/download?bloburl=" + item.fileName + ""
    let pdfFiles = JSON.parse(JSON.stringify(this.submittal));
    pdfFiles['files'] = item;
    let submitalData = JSON.parse(JSON.stringify(this.submittal))
    submitalData['files'] = item;
    let config = {
      title: 'Edit PDF',
      width: '90%',
      itemIndex: index,
      submittalIndex: this.itmindex,
      submittalId: this.id,
      previewUrl: this.previewUrl,
      returnUrl: `/submittals/pdf-edit/${this.id}`
    }
    let pdfActionConfig = {
      pdfFiles: pdfFiles,
      config: config,

    }
    if (pdfFiles.files.id) {
      localStorage.removeItem('submittalObject');
      localStorage.setItem('submittalObject', JSON.stringify(pdfActionConfig));
      this.router.navigate([`/submittals/pdf-edit/${this.id}`]);
    } else {
      this.callSaveAsDraft(pdfActionConfig, 'edit');
    }
  }

  handleChangeSubmittalName = (event: any) => {
    this.selectedActionCallback.emit({
      subIdx: this.itmindex,
      value: this.submittal['name'],
      action: 'change_name'
    })
    // if (this.submittal['name']) {
    //   this.handleEdit(false)
    // }

  }

  niceBytes(x: any) {
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let l = 0, n = parseInt(x, 10) || 0;
    while (n >= 1024 && ++l) {
      n = n / 1024;
    }
    return (n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
  }

  previewSubmitCallbackHandler = (res: any) => {
    const old = {
      ...this.submittal
    };
    this.submittal = {
      ...old,
      mfg: res.pdfFiles.mfg,
      part: res.pdfFiles.part,
      description: res.pdfFiles.description,
      volt: res.pdfFiles.volt,
      lamp: res.pdfFiles.lamp,
      dim: res.pdfFiles.dim,
      runs: res.pdfFiles.runs,
    }
    this.isPreviewDialog = false;
  }
}
