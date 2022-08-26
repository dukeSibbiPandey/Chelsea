import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { HttpService } from '../../../../components/http.service';
import { SubmittalService } from '../../submittal.service';
const emailPattern = "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$";

@Component({
  selector: 'app-submittals-form-step1',
  templateUrl: './submittals-form-step1.component.html',
  styleUrls: ['./submittals-form-step1.component.scss'],
  providers: [PrimeNGConfig, MessageService]
})
export class SubmittalsFormStep1Component implements OnInit {
  @Input() title: any;
  activeAddressInde = -1;
  keyword = 'name';
  submittalDetailForm: FormGroup;
  submitted = false;
  addressMaster: any = [];
  cityMaster: any = [];
  stateMaster: any = [];
  id: any;
  initialValue: any = '';
  masters: any = {
    projectManagers: [],
    contractors: []
  }
  entity: any = {
    addressId: 0
  }
  filteredCountries: any[];
  icon: any = {

  }
  constructor(private _FormBuilder: FormBuilder, private messageService: MessageService, private router: Router, private httpService: HttpService, private _ActivatedRoute: ActivatedRoute, private _SubmittalService: SubmittalService, private sanitizer: DomSanitizer) { }
  ngOnInit(): void {
    this.id = this._ActivatedRoute.snapshot.params['id'];
    this.BACK_ICON();
    this.createForm(() => {
      if (this.id > 0) {
        this.getSubmittalData(this.id);
      } else {

      }
    })
    this.gerProjectManagerMasters();
    this.gerContractorMasters();
    this.bindAddressOptions();
    this.bindCityOptions();
    this.bindStateOptions();
  }
  BACK_ICON = () => {
    const icon = this._SubmittalService.BACK_ICON();
    this.icon.BACK_ICON = this.sanitizer.bypassSecurityTrustHtml(
      icon
    );
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
        status: ['Approval'],
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
          stateId: ['0'],
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
  gerProjectManagerMasters() {
    this.httpService.get("Global/projectManagers").toPromise().then(value => {
      debugger
      this.masters.projectManagers = value
    });
  }
  gerContractorMasters() {
    this.httpService.get("Global/customers").toPromise().then(value => {
      debugger
      this.masters.contractors = value
    });
  }
  getSubmittalData(id: any) {
    this.httpService.get("Home/submittal/get/" + id + "").toPromise().then((value: any) => {
      this.entity = value
      this.setFormData(value)
    })
  }
  getAddress = () => {
    if (this.addressMaster && this.addressMaster.length > 0 && this.entity.addressId) {
      this.addressMaster.map((item) => {
        if (item.id == this.entity.addressId) {
          this.selectAddress(item)
        }
      })
    }

  }
  onFocused(e) {
    // do something
  }
  selectEvent(item) {
    this.submittalDetailForm.controls['cityName'].setValue(item['name']);
  }
  selectProjecetManager(item) {
    this.submittalDetailForm.controls['projectManager']['controls']['name'].setValue(item['name'])
    this.submittalDetailForm.controls['projectManager']['controls']['phone'].setValue(item['phone'])
    this.submittalDetailForm.controls['projectManager']['controls']['email'].setValue(item['email'])
  }
  selectContractor(item) {
    this.submittalDetailForm.controls['contractor']['controls']['name'].setValue(item['name']);
    this.submittalDetailForm.controls['contractor']['controls']['addressLine1'].setValue(item['address1']);
    this.submittalDetailForm.controls['contractor']['controls']['addressLine2'].setValue(item['address2']);
    this.submittalDetailForm.controls['contractor']['controls']['stateId'].setValue(item['stateId']);
    this.submittalDetailForm.controls['contractor']['controls']['city'].setValue(item['city']);
    this.submittalDetailForm.controls['contractor']['controls']['postalCode'].setValue(item['zip'] || '');
  }
  onChangeSearch() {
    this.submittalDetailForm.controls['cityName'].setValue('');
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }
  setFormData = (res) => {
    this.submittalDetailForm.controls['id'].setValue(res['id']);
    this.submittalDetailForm.controls['status'].setValue(res['status']);
    this.submittalDetailForm.controls['submittalDate'].setValue(res['submittedDate'] && new Date(res['submittedDate']));
    this.submittalDetailForm.controls['jobName'].setValue(res['jobName']);
    this.submittalDetailForm.controls['submittals'].setValue(res['submittals']);
    this.submittalDetailForm.controls['addressId'].setValue(res['addressId']);
    if (res['addressId']) {
      this.getAddress()
    }

    /* project manager */
    this.submittalDetailForm.controls['projectManager']['controls']['name'].setValue(res['projectManagerName'])
    this.submittalDetailForm.controls['projectManager']['controls']['phone'].setValue(res['phone'])
    this.submittalDetailForm.controls['projectManager']['controls']['email'].setValue(res['email'])


    /* contractor */

    this.submittalDetailForm.controls['contractor']['controls']['name'].setValue(res['contractorName']);
    this.submittalDetailForm.controls['contractor']['controls']['addressLine1'].setValue(res['addressLine1']);
    this.submittalDetailForm.controls['contractor']['controls']['addressLine2'].setValue(res['addressLine2']);
    this.submittalDetailForm.controls['contractor']['controls']['stateId'].setValue(res['stateId']);
    this.submittalDetailForm.controls['contractor']['controls']['city'].setValue(res['city']);
    this.submittalDetailForm.controls['contractor']['controls']['postalCode'].setValue(res['zip'] || '');
    this.submittalDetailForm.controls['cityName'].setValue(res['city']);
    this.selectState();
  }

  bindAddressOptions() {
    this.httpService.get("Home/master/data/address").toPromise().then(value => {
      this.addressMaster = value;
      this.getAddress()
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
  selectAddress = (item: any) => {
    this.entity['addressId'] = item.id;
    this.submittalDetailForm.controls['addressId'].setValue(item.id);
    this.submittalDetailForm.controls['address'].setValue({ addressLine1: item.address, addressLine2: item.name, state: item.state, city: item.city, postalCode: item.zipCode, phone: item.phone, fax: item.fax });
  }
  selectCity = () => {
    let cityId = this.submittalDetailForm.controls['contractor'].value.city;
    let cityObj = this.cityMaster.filter(function (item: any) {
      return item.id >= cityId;
    });
    this.submittalDetailForm.controls['cityName'].setValue(cityObj[0].name);
  }
  selectState = () => {
    let stateId = this.submittalDetailForm.controls['contractor'].value.stateId;
    let stateObj = this.stateMaster.filter(function (item: any) {
      return item.id >= stateId;
    });
    this.submittalDetailForm.controls['stateName'].setValue(stateObj[0].name);
  }

  toastMsg(severity: any, summary: any, detail: any, life: any) {
    this.messageService.add({ key: 'detailFormToast', severity: severity, summary: summary, detail: detail, life: life, closable: true });
  }
  filterCountry(event) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.cityMaster.length; i++) {
      let country = this.cityMaster[i];
      if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(country);
      }
    }

    this.filteredCountries = filtered;
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
      if (postDto.contractor && postDto.contractor.postalCode) {
        postDto.contractor.postalCode = postDto.contractor.postalCode.toString();
      }
      if (postDto.projectManager && postDto.projectManager.name && postDto.projectManager.name.name) {
        postDto.projectManager.name = postDto.projectManager.name.name
      }
      if (postDto.contractor && postDto.contractor.name && postDto.contractor.name.name) {
        postDto.contractor.name = postDto.contractor.name.name
      }
      if (postDto.contractor && postDto.contractor.city && postDto.contractor.city.name) {
        postDto.contractor.city = postDto.contractor.city.name
      }

      postDto.contractor.stateId = postDto.contractor.stateId ? parseInt(postDto.contractor.stateId) : null;
      if (postDto.contractor.stateId == 0) {
        postDto.contractor.stateId = null;
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
          this.toastMsg('error', 'Error', err || 'Somethign went wrong', 2000)
        }
      }, error => {
        this.toastMsg('error', 'Error', error, 2000)
      });
    }
  }

  postAjax = (id: any) => {
    let data: any = {
      isDialogOpen: false
    }
    let url = '/submittals/form/' + id + '/step/2';
    this.router.navigate([url]);
  }
}
