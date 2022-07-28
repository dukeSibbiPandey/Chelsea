import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../../../components/http.service';
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
  files: [],
  isOpen: true
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

      ],
      isOpen: true
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
  getSubmittalData(id: any) {
    this.httpService.get("Home/submittal/get/" + id + "").toPromise().then((value: any) => {
      if (value.pdfFiles) {
        value.pdfFiles[0].isOpen = true
      }
      const tempData = JSON.parse(localStorage.getItem('submittalObject'));
      debugger
      if (tempData) {
        const index = tempData.submittalIndex;
        const itemIndex = tempData.itemIndex;
        const item = tempData.submitalData;

        value.pdfFiles[index]['description'] = item['description'];
        value.pdfFiles[index]['dim'] = item['dim'];
        value.pdfFiles[index]['fileTmpPath'] = item['fileTmpPath'];
        value.pdfFiles[index]['id'] = item['id'];
        value.pdfFiles[index]['isOpen'] = item['isOpen'];
        value.pdfFiles[index]['mfg'] = item['mfg'];
        value.pdfFiles[index]['name'] = item['name'];
        value.pdfFiles[index]['part'] = item['part'];
        value.pdfFiles[index]['runs'] = item['runs'];
        value.pdfFiles[index]['status'] = item['status'];
        value.pdfFiles[index]['volt'] = item['volt'];
        if (value.pdfFiles[index]['files'].length >= itemIndex) {
          value.pdfFiles[index]['files'][itemIndex] = item['files']
        } else {
          value.pdfFiles[index]['files'][itemIndex].push(item['files'])
        }

      }
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
    item.name = "F" + (this.submittalsTpl.length + 1);
    this.submittalsTpl.push(item);
    this.updateOldState();
  }
  removePdfOption = (res: any) => {
    this.submittalsTpl[res.submittalIndex]['files'].splice(res.itemIndex, 1)
    this.updateOldState();
  }

  toggleCallbackHandler = (res: any) => {
    this.submittalsTpl[res.idx]['isOpen'] = res.isOpen;
    this.updateOldState();
  }
  removeSubmittals = (res: any) => {
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
  handleMergePdp = () => {
    let temp: any = [];
    this.submittalsTpl.map((ele: any, index: number) => {
      let item: any = {
        name: ele.name,
        status: ele.status,
        mfg: ele.mfg,
        part: ele.part,
        description: ele.description,
        volt: ele.volt,
        lamp: ele.lamp,
        dim: ele.dim,
        runs: ele.cruns,
        files: ele.files
      }
      temp.push(item)
    })
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
}
