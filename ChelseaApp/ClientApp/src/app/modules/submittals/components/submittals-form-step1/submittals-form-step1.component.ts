import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
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
  constructor(private _FormBuilder: FormBuilder, private messageService: MessageService, private router: Router) { }
  ngOnInit(): void {
    this.createForm(() => {

    })
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

  selectAddress = (index: any, id: any) => {
    this.submittalDetailForm.controls['addressId'].setValue(id);
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
      this.toastMsg('success', 'Success', 'Form submitted successfully', 2000);
      setTimeout(() => {
        this.postAjax()
      }, 3000);
    }
  }

  postAjax = () => {
    let data: any = {
      isDialogOpen: false
    }
    let url = '/submittals/form/add/1/step/2';
    this.router.navigate([url]);
    // this.detailFormSubmitCallbck.emit(data)
  }
}
