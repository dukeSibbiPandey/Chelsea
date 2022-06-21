import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-submittals-detail-form',
  templateUrl: './submittals-detail-form.component.html',
  styleUrls: ['./submittals-detail-form.component.scss'],
  providers: [PrimeNGConfig, MessageService]
})
export class SubmittalsDetailFormComponent implements OnInit {
  @Output() detailFormSubmitCallbck: EventEmitter<any> = new EventEmitter();
  submittalDetailForm: FormGroup;
  submitted = false;
  toastPosition = 'top-center';

  constructor(private _FormBuilder: FormBuilder, private messageService: MessageService) { }

  ngOnInit(): void {
    this.createForm(() => {
      // this.setFormValue()
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
        address: this._FormBuilder.group({
          addressLine1: ['', [Validators.required]],
          addressLine2: [''],
          state: ['', [Validators.required]],
          city: ['', [Validators.required]],
          postalCode: ['', Validators.required],
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

  toastMsg(severity: any, summary: any, detail: any, life: any) {
    this.messageService.add({ key: 'detailFormToast', severity: severity, summary: summary, detail: detail, life: life, closable: true });
  }


  setFormValue = () => {
    const res: any = {};
    // this.submittalDetailForm.controls['types'].setValue(res['types']);
  }

  handleSubmit = () => {
    debugger
    if (this.submittalDetailForm.invalid) {
      this.toastMsg('error', 'Form Validation Error', 'Please fill all required fields', 1000)
      this.submitted = true;
      return
    } else {
      this.submitted = false;
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
    this.detailFormSubmitCallbck.emit(data)
  }

}
