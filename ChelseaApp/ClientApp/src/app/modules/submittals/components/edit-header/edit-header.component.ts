
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
@Component({
  selector: 'app-edit-header',
  templateUrl: './edit-header.component.html',
  styleUrls: ['./edit-header.component.scss'],
  providers: [PrimeNGConfig, MessageService]
})
export class EditHeaderComponent implements OnInit {
  @Output() editDialogSubmitCallback: EventEmitter<any> = new EventEmitter();
  transmittedFor: string;
  registerForm: FormGroup;
  submitted = false;
  toastPosition = 'top-center';
  constructor(private _FormBuilder: FormBuilder, private messageService: MessageService) {

  }

  ngOnInit(): void {
    this.createForm(() => {

    })
  }
  toastMsg(severity: any, summary: any, detail: any, life: any) {
    this.messageService.add({ key: 'unitFormToast', severity: severity, summary: summary, detail: detail, life: life, closable: true });
  }
  getDetails = () => {
    const res: any = {};
    // this.registerForm.controls['types'].setValue(res['types']);
  }
  createForm = (callback: any): void => {
    this.registerForm = this._FormBuilder.group(
      {
        types: ['', Validators.required],
        mfg: ['', Validators.required],
        part: ['', Validators.required],
        description: ['', Validators.required],
        id: [0],
      }
    )
    if (callback) {
      callback()
    }
  }
  get formControl() { return this.registerForm.controls };
  postAjax = () => {
    let data: any = {
      isDialogOpen: false
    }
    this.editDialogSubmitCallback.emit(data)
  }
  handleSubmit = () => {
    if (this.registerForm.invalid) {
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
}
