import { Component, OnInit } from '@angular/core';
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
  registerForm: FormGroup;
  submitted = false;
  toastPosition = 'top-center';

  constructor(private _FormBuilder: FormBuilder, private messageService: MessageService) { }

  ngOnInit(): void {
    this.createForm(() => {
      // this.setFormValue()
    })
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
  
  toastMsg(severity: any, summary: any, detail: any, life: any) {
    this.messageService.add({ key: 'headerFormToast', severity: severity, summary: summary, detail: detail, life: life, closable: true });
  }


  setFormValue = () => {
    const res: any = {};
    // this.registerForm.controls['types'].setValue(res['types']);
  }

}
