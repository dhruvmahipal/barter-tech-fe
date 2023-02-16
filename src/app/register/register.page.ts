import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { Device } from '@capacitor/device';
import { StorageService } from '../services/storage.service';
import { ToastService } from '../services/toast.service';
import { AlertController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { matchValidator } from '../validators/match.validator';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

export class RegisterPage implements OnInit {
  device_model: any;
  device_platform: any;
  device_uuid: any;
  device_version: any;
  device_manufacturer: any;
  device_serial: any;
  registration_id: any;
  validateForm1: FormGroup;
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private storage: StorageService,
    private router: Router,
    private _alertController: AlertController,
    private global: GlobalService,
  ) {
    this.validateForm1 = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.pattern(this.emailPattern)],],
      password: ['', [Validators.required,Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required,Validators.minLength(6)]],
      gender: [null],
      mobile: [null, [Validators.required,Validators.maxLength(10)]],
      dateOfBirth: [null, [Validators.required]],
    },
    { validators: matchValidator('password', 'confirmPassword') });
  }

  ngOnInit() {
    this.getDeviceInfo();
    this.authService.getFCMTOKEN();
  }
  getDeviceInfo() {
    Device.getInfo().then((val: any) => {
      this.device_model = val.model;
      this.device_platform = val.platform;
      this.device_uuid = val.uuid;
      if(this.device_uuid==undefined){
        this.device_uuid='ND'
      }
      this.device_version = val.appVersion;
      if(this.device_version==undefined){
        this.device_version='ND'
      }
      this.device_manufacturer = val.manufacturer;
    });
  }
  numberOnly(event){
    console.log(event.target.value);
  }
  // numberOnly(event) {
  //   // Check input length
  //   if (event.target.value.length <=10) {
  //     console.log("Input must be at least 10 characters long.");
  //     return;
  //   }
  //   // Remove dots
  //   event.target.value = event.target.value.replace(/\./g,'');
  //   // Check if input is a number
  //   if (!/^\d+$/.test(event.target.value)) {
  //     console.log("Input must contain only numbers.");
  //     return;
  //   }
  //   console.log("Input is valid.");
  //   // Update the input field
  //   let inputField = event.target
  //   inputField.value = event.target.value;
  // }


  getToday():string{
     return new Date().toISOString().split('T')[0];
  }

  submitForm() {
    if (!this.validateForm1.valid) return;
    let data = {
      name: this.firstName_FormControl.value,
      lastName: this.lastName_FormControl.value,
      email: this.email_FormControl.value,
      mobileNo: '+61' + this.mobile_FormControl.value,
      gender: this.gender_FormControl.value,
      dob: this.dateOfBirth_FormControl.value,
      password: this.password_FormControl.value,

      merchant_id: 68,
      device_model: this.device_model,
      device_platform: this.device_platform,
      device_uuid: this.device_uuid,
      device_version: this.device_version,
      device_manufacturer: this.device_manufacturer,
      registration_token: JSON.parse(localStorage.getItem('fcm_token')),
    };

    console.log('-----------------data signup-----------', data);
    this.global.showLoader('Registering');
    this.authService.registerUser(data).subscribe(
      (res) => {
        if (res.status) {
          this.global.hideLoader();
          // this.storage.store('token', res.data[0].data.token);
          // this.storage.store('userDetails', res.data[0].data);
          localStorage.setItem('token', res.data[0].data.token);
          localStorage.setItem('userDetails', res.data[0].data);
          this.toastService.presentToast(res.message);
          this.router.navigate(['/account']);
          this.validateForm1.reset();
        }
        // else{
        //   this.toastService.presentToast();
        // }
      },
      (error) => {
        this.global.hideLoader();
        console.log(error.error)
        const {email  } = error.error
        this.toastService.presentToast(email);
      }
    );
  }
  get officialEmail() {
    return this.validateForm1.get('email');
  }
  get firstName_FormControl(): FormControl | null {
    return (this.validateForm1?.get('firstName') as FormControl) ?? null;
  }
  get lastName_FormControl(): FormControl | null {
    return (this.validateForm1?.get('lastName') as FormControl) ?? null;
  }
  get email_FormControl(): FormControl | null {
    return (this.validateForm1?.get('email') as FormControl) ?? null;
  }
  get password_FormControl(): FormControl | null {
    return (this.validateForm1?.get('password') as FormControl) ?? null;
  }
  get mobile_FormControl(): FormControl | null {
    return (this.validateForm1?.get('mobile') as FormControl) ?? null;
  }
  get dateOfBirth_FormControl(): FormControl | null {
    return (this.validateForm1?.get('dateOfBirth') as FormControl) ?? null;
  }
  get gender_FormControl(): FormControl | null {
    return (this.validateForm1?.get('gender') as FormControl) ?? null;
  }
  get confirmpassword_FormControl(): FormControl | null {
    return (this.validateForm1?.get('confirmPassword') as FormControl) ?? null;
  }
}
