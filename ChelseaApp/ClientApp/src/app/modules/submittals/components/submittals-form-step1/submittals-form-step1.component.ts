import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { HttpService } from '../../../../components/http.service';
const emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
const mobilePattern = "^(\([0-9]{3}\)|[0-9]{3}-)[0-9]{3}-[0-9]{4}$";

@Component({
  selector: 'app-submittals-form-step1',
  templateUrl: './submittals-form-step1.component.html',
  styleUrls: ['./submittals-form-step1.component.scss'],
  providers: [PrimeNGConfig, MessageService]
})
export class SubmittalsFormStep1Component implements OnInit {
  activeAddressInde = -1;
  submittalDetailForm: FormGroup;
  submitted = false;
  addressMaster: any = [];
  cityMaster: any = [];
  stateMaster: any = [];
  id: any;
  constructor(private _FormBuilder: FormBuilder, private messageService: MessageService, private router: Router, private httpService: HttpService, private _ActivatedRoute: ActivatedRoute) { }
  ngOnInit(): void {
    this.id = this._ActivatedRoute.snapshot.params['id'];
    this.createForm(() => {
      if (this.id > 0) {
        this.getSubmittalData(this.id);
      }
    })
    this.bindAddressOptions();
    this.bindCityOptions();
    this.bindStateOptions();
  }
  createForm = (callback: any): void => {
    this.submitted = false;
    this.submittalDetailForm = this._FormBuilder.group(
      {
        id: [0],
        submittalDate: ['', Validators.required],
        jobName: ['', Validators.required],
        submittals: ['', Validators.required],
        addressId: ['', Validators.required],
        address: this._FormBuilder.group({
          addressLine1: [''],
          addressLine2: [''],
          state: [''],
          city: [''],
          postalCode: [''],
          phone: [''],
          fax: [''],
        }),
        projectManager: this._FormBuilder.group({
          name: [''],
          phone: [''],
          email: ['', [Validators.pattern(emailPattern)]],
        }),
        contractor: this._FormBuilder.group({
          name: [''],
          addressLine1: [''],
          addressLine2: [''],
          state: [''],
          city: [''],
          postalCode: ['']
        }),
        stateName: [''],
        cityName: [''],
      }
    )
    if (callback) {
      callback()
    }
  }
  get formControl() { return this.submittalDetailForm.controls };
  getSubmittalData(id: any) {
    this.httpService.get("Home/submittal/get/" + id + "").toPromise().then((value: any) => {
      this.setFormData(value)
    })
  }
  setFormData = (res) => {
    this.submittalDetailForm.controls['id'].setValue(res['id']);
    this.submittalDetailForm.controls['submittalDate'].setValue(res['submittedDate'] && new Date(res['submittedDate']));
    this.submittalDetailForm.controls['jobName'].setValue(res['jobName']);
    this.submittalDetailForm.controls['submittals'].setValue(res['submittals']);
    this.submittalDetailForm.controls['addressId'].setValue(res['addressId']);
    this.submittalDetailForm.controls['stateName'].setValue(res['stateId']);
    this.submittalDetailForm.controls['cityName'].setValue(res['city']);

    /* project manager */
    this.submittalDetailForm.controls['projectManager']['controls']['name'].setValue(res['projectManagerName'])
  }
  bindAddressOptions() {
    this.httpService.get("Home/master/data/address").toPromise().then(value => {
      this.addressMaster = value;
      this.selectAddress(0, this.addressMaster[0]);
    });
  }
  bindCityOptions() {
    this.httpService.get("Home/master/data/city").toPromise().then(value => {
      this.cityMaster = value;
    });
  }
  bindStateOptions() {
    this.httpService.get("Home/master/data/state").toPromise().then(value => {
      this.stateMaster = value;
    });
  }
  selectAddress = (index: any, item: any) => {
    for (let i = 0; i < this.addressMaster.length; i++) {
      this.addressMaster[i].isPrimary = false;
    }
    item.isPrimary = true;
    this.submittalDetailForm.controls['addressId'].setValue(item.id);
    this.submittalDetailForm.controls['address'].setValue({ addressLine1: item.address, addressLine2: item.name, state: item.state, city: item.city, postalCode: item.zipCode, phone: item.phone, fax: item.fax });
    this.activeAddressInde = index;
  }
  selectCity = () => {
    let cityId = this.submittalDetailForm.controls['contractor'].value.city;
    let cityObj = this.cityMaster.filter(function (item: any) {
      return item.id >= cityId;
    });
    this.submittalDetailForm.controls['cityName'].setValue(cityObj[0].name);
  }
  selectState = () => {
    let stateId = this.submittalDetailForm.controls['contractor'].value.state;
    let stateObj = this.stateMaster.filter(function (item: any) {
      return item.id >= stateId;
    });
    this.submittalDetailForm.controls['stateName'].setValue(stateObj[0].name);
  }

  toastMsg(severity: any, summary: any, detail: any, life: any) {
    this.messageService.add({ key: 'detailFormToast', severity: severity, summary: summary, detail: detail, life: life, closable: true });
  }


  setFormValue = () => {
    const res: any = {};
    // this.submittalDetailForm.controls['types'].setValue(res['types']);
  }

  handleSubmit = () => {
    if (this.submittalDetailForm.invalid) {
      this.toastMsg('error', 'Form Validation Error', 'Please fill all required fields', 1000)
      this.submitted = true;
      return
    } else {
      this.submitted = false;
      let postDto: any = {
        ... this.submittalDetailForm.value
      }
      this.httpService.post("Home/coverpage/save", postDto).toPromise().then(value => {
        try {
          if (value) {
            this.toastMsg('success', 'Success', 'Form submitted successfully', 2000);
            setTimeout(() => {
              this.postAjax(value);
            }, 3000);
          }
        } catch (err) {

        }

      });
    }
  }

  postAjax = (id: any) => {
    let data: any = {
      isDialogOpen: false
    }
    let url = '/submittals/form/add/' + id + '/step/2';
    this.router.navigate([url]);
    // this.detailFormSubmitCallbck.emit(data)
  }
}
