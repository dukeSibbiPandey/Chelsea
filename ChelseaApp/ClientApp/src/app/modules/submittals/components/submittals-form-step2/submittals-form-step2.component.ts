import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../../../components/http.service';
@Component({
  selector: 'app-submittals-form-step2',
  templateUrl: './submittals-form-step2.component.html',
  styleUrls: ['./submittals-form-step2.component.scss']
})
export class SubmittalsFormStep2Component implements OnInit {
  activeAddressInde = 1;
  id: any = 0;
  submittalData: any;
  template=[
    {
      name:'F1'
    },
    {
      name:'F2'
    }
  ]
  constructor(private route: ActivatedRoute, private httpService: HttpService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getSubmittalData(this.id);
  }
  getSubmittalData(id: any) {
    this.httpService.get("Home/submittal/get/" + id+"").toPromise().then(value => {
      this.submittalData = value;
    });
  }
  selectAddress = (index: any) => {
    this.activeAddressInde = index;
  }

  addMoreOption = () => {
    this.template.push({ name: "F" + (this.template.length+1)})
  }
  removePdfOption = (idx: any) => {
    console.log("parent delete called", idx);
    this.template.splice(idx, idx + 1);
    for (let i = 0; i < this.template.length; i++) {
      this.template[i].name = "F" + (i + 1);
    }
  }
}
