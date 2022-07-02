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
      files: []
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
    this.submittalsTpl[res.itmindex].files.push(res.fileName)
  }

  addMoreOption = () => {
    let item = submittalItem;
    item.name = "F" + (this.submittalsTpl.length + 1);
    this.submittalsTpl.push(item)
  }
  removePdfOption = (idx: any) => {
    this.submittalsTpl.splice(idx, 1);
    for (let i = 0; i < this.submittalsTpl.length; i++) {
      this.submittalsTpl[i].name = "F" + (i + 1);
    }
  }
  handleMergePdp = () => {
    let postDto = {
      submittalId: this.id,
      pdfFiles: this.submittalsTpl
    }
    this.httpService.post("home/files/merge", postDto).toPromise().then(value => {

    });
  }
}
