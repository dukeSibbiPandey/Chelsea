import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../../../components/http.service';
import { PDFDocument } from 'pdf-lib';
import { PdfHelperService } from '../../pdfhelper.service';

const submittalItem: any = {
  name: 'F1',
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
  styleUrls: ['./submittals-form-step2.component.scss']
})
export class SubmittalsFormStep2Component implements OnInit {
  activeAddressInde = 1;
  id: any = 0;
  submittalData: any;
  tempSubmittalsTpl: any = [];
  openIndex = []
  submittalsTpl: any = [
    {
      name: 'F1',
      status: '',
      mfg: '',
      part: '',
      description: '',
      volt: '',
      lamp: '',
      dim: '',
      runs: '',
      files: [

      ]
    }
  ]
  constructor(private route: ActivatedRoute, private httpService: HttpService, private router: Router) { }
  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getSubmittalData(this.id);
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
      debugger
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
      this.submittalsTpl = value.pdfFiles;
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
    let name = "F" + (this.submittalsTpl.length + 1);
    let arr = this.tempSubmittalsTpl;
    let temp = 0;
    arr.map((ele: any, index: number) => {
      if (ele['name'] == name) {
        temp = temp + 1
      }
    })
    if (temp == 0) {
      item.name = name
    } else {
      item.name = name + `_` + new Date().getTime()
    }

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
    item.name = "F" + (this.submittalsTpl.length + 1);
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
    let arr = this.tempSubmittalsTpl;
    let temp = 0;
    arr.map((item: any, index: number) => {
      if (item['name'] == res.value) {
        temp = temp + 1
      }
    })
    if (temp == 0) {
      this.submittalsTpl[res.subIdx]['name'] = res.value
    } else {
      this.submittalsTpl[res.subIdx]['name'] = this.tempSubmittalsTpl[res.subIdx]['name'];
    }
    this.updateOldState();

  }
  selectedActionCallbackAction = (res: any) => {
    if (res.action == 'delete') {
      this.removeSubmittals(res)
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
    }
  }
  handleMergePdp = async () => {
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
        let fileurl = this.httpService.getBaseUrl()+"Home/download?bloburl=" + element.fileName;
        if (element.annotations) {
          let expressObj = await this.getMergedPdfWithAnnotations(element.annotations, item, fileurl);
          item.files[j].expressKey = expressObj.key;
          item.files[j].expressUrl = expressObj.url;
          item.files[j].expressId = expressObj.id;
        }
        else {
          let expressObj = await this.createPdfHeaders(item, fileurl, 2, element.orgFileName);
          item.files[j].tempFileName = expressObj.fileName;
        }
      }
      //});
      temp.push(item)
    }
    //})
    this.updateOldState();
    let postDto = {
      submittalId: this.id,
      pdfFiles: temp
    }
    this.httpService.post("home/files/merge", postDto).toPromise().then(value => {
      this.postAjax()
    });
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
