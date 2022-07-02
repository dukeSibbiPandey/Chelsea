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
      files: [],
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
}
