import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { GlobalService } from '../services/global.service';
import { ToastService } from '../services/toast.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profileForm: FormGroup;
  datePipe = new DatePipe('es-US');
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  array = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25',
    '26',
    '27',
    '28',
    '29',
    '30',
    '31',
  ];
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private router: Router,
    private global: GlobalService
  ) {
    this.profileForm = this.fb.group({
      fname: [null, [Validators.required, Validators.minLength(4)]],
      lname: [null, [Validators.required, Validators.minLength(3)]],
      email: [
        null,
        [Validators.required, Validators.pattern(this.emailPattern)],
      ],
      mobile: [
        null,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      dateOfBirth: [null, [Validators.required]],
      monthOfBirth: [null, [Validators.required]],
      gender: [null],
      anniversary: [null],
    });
  }

  ngOnInit() {
    this.getProfileData();
  }

  getProfileData() {
    this.authService.accountSubject.subscribe((res: any) => {
      console.log(res);
      res.dateOfBirth = new Date(res.dateOfBirth);
      if (res) {
        this.profileForm.patchValue(res);
        this.profileForm.controls['mobile'].patchValue(res.mobileNo);
        this.profileForm.controls['fname'].patchValue(res.name);
        this.profileForm.controls['lname'].patchValue(res.lastName);
        this.profileForm.controls['dateOfBirth'].patchValue(res.date);
        this.profileForm.controls['monthOfBirth'].patchValue(res.month);
        this.profileForm.controls['anniversary'].patchValue(
          res.anniversary_date
        );
        this.profileForm.controls['gender'].patchValue(res.gender);
      }
    });
  }

  private formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  saveForm() {
    if (this.profileForm.invalid) {
      return;
    }
    let data = {
      name: this.fname_FormControl.value,
      lastName: this.lname_FormControl.value,
      gender: this.gender_FormControl.value,
      email: this.email_FormControl.value,
      anniversary_date: this.anniversary_FormControl.value,
      mobile: '+61' + this.mobile_FormControl.value,
      dateOfbirth:
        this.monthOfBirth_FormControl.value +
        '-' +
        this.dateOfBirth_FormControl.value,
    };
    this.global.showLoader('Saving Data');

    console.log(data);
    this.authService.editProfile(data).subscribe({
      next: (data) => {
        this.global.hideLoader();
        if (data.status) {
          this.toastService.presentToast(data.message);
          this.profileForm.reset();
          this.router.navigate(['/account']);
        } else {
          this.toastService.presentToast('Error in User Details');
        }
      },
      error: (err) => {
        this.global.hideLoader();
        this.toastService.presentToast(err);
      },
    });
  }
  get officialEmail() {
    return this.profileForm.get('email');
  }
  get fname_FormControl(): FormControl | null {
    return (this.profileForm?.get('fname') as FormControl) ?? null;
  }
  get lname_FormControl(): FormControl | null {
    return (this.profileForm?.get('lname') as FormControl) ?? null;
  }
  get gender_FormControl(): FormControl | null {
    return (this.profileForm?.get('gender') as FormControl) ?? null;
  }
  get email_FormControl(): FormControl | null {
    return (this.profileForm?.get('email') as FormControl) ?? null;
  }
  get anniversary_FormControl(): FormControl | null {
    return (this.profileForm?.get('anniversary') as FormControl) ?? null;
  }
  get mobile_FormControl(): FormControl | null {
    return (this.profileForm?.get('mobile') as FormControl) ?? null;
  }
  get dateOfBirth_FormControl(): FormControl | null {
    return (this.profileForm?.get('dateOfBirth') as FormControl) ?? null;
  }
  get monthOfBirth_FormControl(): FormControl | null {
    return (this.profileForm?.get('monthOfBirth') as FormControl) ?? null;
  }
}
