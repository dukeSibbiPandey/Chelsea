import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../../../components/http.service';
import { PdfHelperService } from '../../pdfhelper.service';
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { CommonService } from 'src/app/common.service';
import { SubmittalService } from '../../submittal.service';
import { DomSanitizer } from '@angular/platform-browser';
const submittalItem: any = {
  name: 'Type 1',
  status: '',
  mfg: '',
  part: '',
  description: '',
  volt: '',
  lamp: '',
  dim: '',
  runs: '',
  files: []
}
@Component({
  selector: 'app-submittals-form-step2',
  templateUrl: './submittals-form-step2.component.html',
  styleUrls: ['./submittals-form-step2.component.scss'],
  providers: [PrimeNGConfig, MessageService]
})
export class SubmittalsFormStep2Component implements OnInit {
  @Input() title: any;
  activeAddressInde = 1;
  id: any = 0;
  submittalData: any;
  tempSubmittalsTpl: any = [];
  openIndex = []
  submittalsTpl: any = [
    {
      name: 'Type 1',
      status: '',
      mfg: '',
      part: '',
      description: '',
      volt: '',
      lamp: '',
      dim: '',
      runs: '',
      isEdit: true,
      isDuplicate: false,
      files: [

      ]
    }
  ]
  icon: any = {

  }
  isDisabled = false;

  constructor(private route: ActivatedRoute, private messageService: MessageService, private httpService: HttpService, private router: Router, private _CustomService: CommonService, private _SubmittalService: SubmittalService, private sanitizer: DomSanitizer) { }
  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getSubmittalData(this.id);
    this.BACK_ICON();
  }
  BACK_ICON = () => {
    const icon = this._SubmittalService.BACK_ICON();
    this.icon.BACK_ICON = this.sanitizer.bypassSecurityTrustHtml(
      icon
    );
  }
  updateOldState = () => {
    this.tempSubmittalsTpl = JSON.parse(JSON.stringify(this.submittalsTpl))
  }
  updateLocalVariables = () => {

  }
  getSubmittalData(id: any) {
    this.httpService.get("Home/submittal/get/" + id + "").toPromise().then((value: any) => {
      const tempData = JSON.parse(localStorage.getItem('submittalObject'));
      const updatedHeader = JSON.parse(localStorage.getItem('updatedHeader'));
      if (updatedHeader) {
        const index = updatedHeader.config.submittalIndex;
        const itemIndex = updatedHeader.config.itemIndex;
        const item = updatedHeader.pdfFiles;
        if (item) {
          value.pdfFiles[index]['description'] = item['description'];
          value.pdfFiles[index]['dim'] = item['dim'];
          value.pdfFiles[index]['fileTmpPath'] = item['fileTmpPath'];
          value.pdfFiles[index]['id'] = item['id'];
          value.pdfFiles[index]['mfg'] = item['mfg'];
          value.pdfFiles[index]['name'] = item['name'];
          value.pdfFiles[index]['part'] = item['part'];
          value.pdfFiles[index]['runs'] = item['runs'];
          value.pdfFiles[index]['status'] = item['status'];
          value.pdfFiles[index]['volt'] = item['volt'];
          localStorage.removeItem('updatedHeader');
        }
      }
      // if (tempData) {
      //   const index = tempData.submittalIndex;
      //   const itemIndex = tempData.itemIndex;
      //   const item = tempData.submitalData;
      //   if (item) {
      //     value.pdfFiles[index]['description'] = item['description'];
      //     value.pdfFiles[index]['dim'] = item['dim'];
      //     value.pdfFiles[index]['fileTmpPath'] = item['fileTmpPath'];
      //     value.pdfFiles[index]['id'] = item['id'];
      //     value.pdfFiles[index]['mfg'] = item['mfg'];
      //     value.pdfFiles[index]['name'] = item['name'];
      //     value.pdfFiles[index]['part'] = item['part'];
      //     value.pdfFiles[index]['runs'] = item['runs'];
      //     value.pdfFiles[index]['status'] = item['status'];
      //     value.pdfFiles[index]['volt'] = item['volt'];
      //     if (value.pdfFiles[index]['files'].length >= itemIndex) {
      //       value.pdfFiles[index]['files'][itemIndex] = item['files']
      //     } else {
      //       value.pdfFiles[index]['files'][itemIndex].push(item['files'])
      //     }
      //   }
      // }
      this.openIndex = [];
      value.pdfFiles && value.pdfFiles.map((item, index) => {
        this.openIndex.push(index.toString())
      })
      if (value.pdfFiles.length > 0) {
        this.submittalsTpl = value.pdfFiles;
      } else {
        this.openIndex.push('0')
      }

      this.updateOldState();
      this.submittalData = value;
    })
  }
  selectAddress = (index: any) => {
    this.activeAddressInde = index;
  }

  uploadSubmittalsCallbackHandler = (res: any) => {
    const index = res.info.itmindex;
    this.submittalsTpl[index].files.push(res.formData);
    this.updateOldState();
  }

  addMoreOption = () => {
    let item = JSON.parse(JSON.stringify(submittalItem));
    item.name = " ";
    item.isEdit = true;
    this.openIndex.push(this.submittalsTpl.length.toString());
    this.submittalsTpl.push(item);
    this.updateOldState();
  }
  removePdfOption = (res: any) => {
    this.submittalsTpl[res.submittalIndex]['files'].splice(res.itemIndex, 1)
    this.updateOldState();
  }

  toggleCallbackHandler = (res: any) => {
    const index = this.openIndex.indexOf(res.idx);
    if (index > -1) {
      this.openIndex.splice(index, 1);
    } else {
      this.openIndex.push(res.idx)
    }
  }
  removeSubmittals = (res: any) => {
    this.toggleCallbackHandler(res.idx)
    this.submittalsTpl.splice(res.idx, 1);
  }
  duplicateSubmittals = (res: any) => {
    let item = JSON.parse(JSON.stringify(res.submittal));
    // item.name = "Type " + (this.submittalsTpl.length + 1);
    item.name = " ";
    item.isDuplicate = true;
    item.files = [];
    item.isEdit = true;
    const nextIndex = this.submittalsTpl.length;
    this.openIndex.push(nextIndex.toString())
    this.submittalsTpl.push(item);
    this.updateOldState();
  }
  duplicateSubmittalItem = (res: any) => {
    let item = JSON.parse(JSON.stringify(res['file']));
    this.submittalsTpl[res.idx].files.push(item);
    this.updateOldState();
  }
  arraymove = (res: any) => {
    let arr = this.submittalsTpl;
    const fIdx = res.fIdx;
    const toIdx = res.toIdx;
    var element = arr[fIdx];
    arr.splice(fIdx, 1);
    arr.splice(toIdx, 0, element);
    this.updateOldState();
  }
  move_sub_itms = (res: any) => {
    let arr = this.submittalsTpl[res.subIdx].files;
    const fIdx = res.fIdx;
    const toIdx = res.toIdx;
    var element = arr[fIdx];
    arr.splice(fIdx, 1);
    arr.splice(toIdx, 0, element);
    this.updateOldState();
  }

  change_submittal_name = (res: any) => {
    debugger
    if (res.value && res.value !== ' ' && res.value !== " ") {
      let arr = this.tempSubmittalsTpl;
      let temp = 0;
      arr.map((item: any, index: number) => {
        if (item['name'] == res.value) {
          temp = temp + 1
        }
      })
      this.submittalsTpl[res.subIdx]['isEdit'] = false;
      if (temp == 0) {
        this.submittalsTpl[res.subIdx]['name'] = res.value
      } else {
        this.submittalsTpl[res.subIdx]['name'] = this.tempSubmittalsTpl[res.subIdx]['name'];
      }
      this.isDisabled = false
      this.updateOldState();
    } else {
      res.event.target.focus();
      this.isDisabled = true
    }


  }
  selectedActionCallbackAction = (res: any) => {
    if (res.action == 'delete') {
      this.removeSubmittals(res)
    } else if (res.action == 'SaveAsDraft') {
      this.handleSaveAction(res.data)
      // this.handleMergePdp(true);
    } else if (res.action == 'duplicate') {
      this.duplicateSubmittals(res)
    } else if (res.action == 'move') {
      this.arraymove(res)
    } else if (res.action == 'move_item') {
      this.move_sub_itms(res)
    } else if (res.action == 'copyItem') {
      this.duplicateSubmittalItem(res)
    } else if (res.action == 'change_name') {
      this.change_submittal_name(res)
    } else if (res.action == 'edit_name') {
      this.submittalsTpl[res.subIdx]['isEdit'] = true;
    }

  }

  handleSaveAction = async (config) => {
    const pdfFiles = config.pdfActionConfig.pdfFiles;
    const fileObj = config.pdfActionConfig.pdfFiles.files;
    const orgFileName = fileObj.orgFileName;
    let submitalData = pdfFiles;
    submitalData.submittalId = config.pdfActionConfig.config.submittalId;
    submitalData.files.orgFileName = orgFileName;
    let url = 'home/auto/save';
    let formData = {
      ...submitalData
    }
    formData.files.annotations = ''
    formData.files.annotation = ''
    this.httpService.fileupload(url, formData, null, null).subscribe(res => {
      config.pdfActionConfig.pdfFiles = res;
      localStorage.removeItem('submittalObject');
      localStorage.setItem('submittalObject', JSON.stringify(config.pdfActionConfig));
      this.router.navigate([config.pdfActionConfig.config.returnUrl]);
    })

  }
  handleMergePdp = async (isDraft) => {
    this._CustomService.show();
    let temp: any = [];
    //this.submittalsTpl.map((ele: any, index: number) => {
    for (let i = 0; i < this.submittalsTpl.length; i++) {
      let ele = this.submittalsTpl[i];
      let item: any = {
        name: ele.name,
        status: ele.status,
        mfg: ele.mfg,
        id: ele.id,
        part: ele.part,
        description: ele.description,
        volt: ele.volt,
        lamp: ele.lamp,
        dim: ele.dim,
        runs: ele.runs,
        files: ele.files
      }
      //item.files.forEach(async element => {
      for (let j = 0; j < item.files.length; j++) {
        const element = item.files[j];
        if (!isDraft) {
          let fileurl = this.httpService.getBaseUrl() + "Home/download?bloburl=" + element.fileName;
          if (element.annotations) {
            let expressObj = await this.getMergedPdfWithAnnotations(element.annotations, item, fileurl);
            item.files[j].expressKey = expressObj.key;
            item.files[j].expressUrl = expressObj.url;
            item.files[j].expressId = expressObj.id;
            this._CustomService.hide();
          }
          else {
            let expressObj = await this.createPdfHeaders(item, fileurl, 2, element.orgFileName);
            item.files[j].tempFileName = expressObj.fileName;
            this._CustomService.hide();
          }
        }
      }
      //});
      temp.push(item)
    }
    //})
    this.updateOldState();
    let postDto = {
      submittalId: this.id,
      isDraft: isDraft,
      pdfFiles: temp
    }
    this.httpService.post("home/files/merge", postDto).toPromise().then(value => {
      this._CustomService.hide();
      if (!isDraft) {
        this.postAjax()
      } else {
        this.getSubmittalData(this.id);
        this.toastMsg('success', 'Success', 'Submittal saved successfully', 2000);
      }
    });
  }
  toastMsg(severity: any, summary: any, detail: any, life: any) {
    this.messageService.add({ key: 'detailFormToast', severity: severity, summary: summary, detail: detail, life: life, closable: true });
  }
  postAjax = () => {
    let url = `/submittals/merge/${this.id}`;
    this.router.navigate([url]);
  }
  getMergedPdfWithAnnotations = async (xfdf: string, item: any, fileUrl: string): Promise<any> => {
    // const fileData = await fetch(fileUrl).then(res => res.arrayBuffer());
    // const blob = new Blob([fileData], {type: 'application/pdf'});
    const blob = await this.createPdfHeaders(item, fileUrl, 1, "");

    const data = new FormData();
    data.append('xfdf', xfdf);
    data.append('file', blob);
    //data.append('license', my_license_key);

    // Process the file
    const response = await fetch('https://api.pdfjs.express/xfdf/merge', {
      method: 'post',
      body: data
    }).then(resp => resp.json());

    const { url, key, id } = response;

    // Download the file
    /*const mergedFileBlob = await fetch(url, {
      headers: {
        Authorization: key
      }
    }).then(resp => resp.blob())*/

    // Do something with blob...
    // save(mergedFileBlob)

    return response;
  }
  createPdfHeaders = async (item: any, fileUrl: string, type: any, fileName: string): Promise<any> => {
    let blobDoc = await PdfHelperService.CreatePdfHeader(fileUrl, item);
    if (type == 2) {
      let response = {};
      const data = new FormData();
      data.append('fileName', fileName);
      data.append('file', blobDoc);
      await this.httpService.fileupload('home/upload/header', data, null, null).toPromise().then(value => {
        response = value;
      });
      return response;
    }
    return blobDoc;
  }
}
