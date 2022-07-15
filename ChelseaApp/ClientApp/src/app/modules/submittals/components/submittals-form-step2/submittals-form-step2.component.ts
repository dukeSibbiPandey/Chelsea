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
        //{
        //   "fileName": "two.pdf",
        //   "filePath": "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf",
        //   "fileSize": "3028",
        //   "thumbnail": "https://submittalappstorage.blob.core.windows.net/chelseapublicurl/Content/sample_fed134ff-99aa-454c-af49-5169c5262939.png",
        //   "orgFileName": "sample.pdf",
        //   "noSamples": 0,
        //   "owner": "John Smith",
        //   "createdAt": "2022-07-02T15:32:15.209Z",
        //   "itmindex": "0"
        // },
        // {
        //   "fileName": "threee.pdf",
        //   "filePath": "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf",
        //   "fileSize": "3028",
        //   "thumbnail": "https://submittalappstorage.blob.core.windows.net/chelseapublicurl/Content/sample_fed134ff-99aa-454c-af49-5169c5262939.png",
        //   "orgFileName": "sample.pdf",
        //   "noSamples": 0,
        //   "owner": "John Smith",
        //   "createdAt": "2022-07-02T15:32:15.209Z",
        //   "itmindex": "0"
        // }
      ],
      isOpen: true
    }
  ]
  constructor(private route: ActivatedRoute, private httpService: HttpService, private router: Router) { }
  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.updateOldState();
    this.getSubmittalData(this.id);
  }
  updateOldState = () => {
    this.tempSubmittalsTpl = JSON.parse(JSON.stringify(this.submittalsTpl))
  }
  getSubmittalData(id: any) {
    this.httpService.get("Home/submittal/get/" + id + "").toPromise().then(value => {
      this.submittalData = value;
    });
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
    // this.submittalsTpl.splice(idx, 1);
    // for (let i = 0; i < this.submittalsTpl.length; i++) {
    //   this.submittalsTpl[i].name = "F" + (i + 1);
    // }
  }

  toggleCallbackHandler = (res: any) => {
    this.submittalsTpl[res.idx]['isOpen'] = res.isOpen;
    this.updateOldState();
  }
  removeSubmittals = (res: any) => {
    // const ids = res.selectedIndex;
    // this.submittalsTpl[res.itmindex]['files'] = this.submittalsTpl[res.itmindex]['files'].filter((object: any, index: number) => !ids.includes(index));
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
      localStorage.setItem('pdfRes', JSON.stringify(value))
      this.postAjax()
    });
  }

  postAjax = () => {
    let url = `/submittals/merge/${this.id}`;
    this.router.navigate([url]);
  }
}
