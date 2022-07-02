import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../../../components/http.service';
const submittalItem: any = {
  name: 'F1',
  status: '',
  mfg: '',
  part: '',
  description: '',
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

  submittalsTpl: any = [
    {
      name: 'F1',
      status: '',
      mfg: '',
      part: '',
      description: '',
      files: [
      //   {
      //   "fileName": "sample_fed134ff-99aa-454c-af49-5169c5262939.pdf",
      //   "filePath": "https://submittalappstorage.blob.core.windows.net/chelseatemp/Content/sample_fed134ff-99aa-454c-af49-5169c5262939.pdf",
      //   "fileSize": "3028",
      //   "thumbnail": "https://submittalappstorage.blob.core.windows.net/chelseapublicurl/Content/sample_fed134ff-99aa-454c-af49-5169c5262939.png",
      //   "orgFileName": "sample.pdf",
      //   "noSamples": 0,
      //   "owner": "John Smith",
      //   "createdAt": "2022-07-02T15:32:15.209Z",
      //   "itmindex": "0"
      // },{
      //   "fileName": "sample_fed134ff-99aa-454c-af49-5169c5262939.pdf",
      //   "filePath": "https://submittalappstorage.blob.core.windows.net/chelseatemp/Content/sample_fed134ff-99aa-454c-af49-5169c5262939.pdf",
      //   "fileSize": "3028",
      //   "thumbnail": "https://submittalappstorage.blob.core.windows.net/chelseapublicurl/Content/sample_fed134ff-99aa-454c-af49-5169c5262939.png",
      //   "orgFileName": "sample.pdf",
      //   "noSamples": 0,
      //   "owner": "John Smith",
      //   "createdAt": "2022-07-02T15:32:15.209Z",
      //   "itmindex": "0"
      // }
    ],
      isOpen:true
    }
  ]
  constructor(private route: ActivatedRoute, private httpService: HttpService) { }
  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getSubmittalData(this.id);
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
  }

  addMoreOption = () => {
    let item = JSON.parse(JSON.stringify(submittalItem));
    item.name = "F" + (this.submittalsTpl.length + 1);
    this.submittalsTpl.push(item)
  }
  removePdfOption = (res: any) => {
    this.submittalsTpl[res.submittalIndex]['files'].splice(res.itemIndex, 1)
    // this.submittalsTpl.splice(idx, 1);
    // for (let i = 0; i < this.submittalsTpl.length; i++) {
    //   this.submittalsTpl[i].name = "F" + (i + 1);
    // }
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
        files: ele.files
      }
      temp.push(item)
    })
    let postDto = {
      submittalId: this.id,
      pdfFiles: temp
    }
    this.httpService.post("home/files/merge", postDto).toPromise().then(value => {

    });
  }
  toggleCallbackHandler=(res:any)=>{
    this.submittalsTpl[res.itmindex]['isOpen']=res.isOpen
  }
  removeSubmittals=(res:any)=>{
    res.selectedIndex.map((item:any, index:number)=>{
      this.submittalsTpl[res.itmindex]['files'].splice(res.itemIndex, 1)
    })
    this.submittalsTpl[res.itmindex]['files']
  }
  selectedActionCallbackAction=(res:any)=>{
    // if(res.action=='delete'){
    //   this.removeSubmittals(res)
    // }
  }
}
