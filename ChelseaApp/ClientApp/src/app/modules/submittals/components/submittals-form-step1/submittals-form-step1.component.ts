import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { HttpService } from '../../../../components/http.service';

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
  
  constructor(private _FormBuilder: FormBuilder, private messageService: MessageService, private router: Router, private httpService: HttpService) { }
  ngOnInit(): void {
    this.createForm(() => {

    })

    this.bindAddressOptions();
    this.bindCityOptions();
    this.bindStateOptions();
  }
  
  bindAddressOptions() {
    this.httpService.get("Home/master/data/address").toPromise().then(value => {
      this.addressMaster = value;
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
        }),
        projectManager: this._FormBuilder.group({
          name: ['', [Validators.required]],
          phone: ['', [Validators.required]],
          email: ['', [Validators.required]],
        }),
        contractor: this._FormBuilder.group({
          name: ['', [Validators.required]],
          addressLine1: ['', [Validators.required]],
          addressLine2: [''],
          state: ['', [Validators.required]],
          city: ['', [Validators.required]],
          postalCode: ['', [Validators.required]],
        }),
      }
    )
    if (callback) {
      callback()
    }
  }
  get formControl() { return this.submittalDetailForm.controls };

  selectAddress = (index: any, item: any) => {
    for (let i = 0; i < this.addressMaster.length; i++) {
      this.addressMaster[i].isPrimary = false;
    }
    item.isPrimary = true;
    this.submittalDetailForm.controls['addressId'].setValue(item.id);
    this.activeAddressInde = index;
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
      console.log('postDto====', postDto)
      this.httpService.post("Home/coverpage/save", postDto).toPromise().then(value => {
        this.toastMsg('success', 'Success', 'Form submitted successfully', 2000);
        setTimeout(() => {
          this.postAjax(value);
        }, 3000);
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