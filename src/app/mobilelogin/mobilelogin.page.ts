import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
@Component({
  selector: 'app-mobilelogin',
  templateUrl: './mobilelogin.page.html',
  styleUrls: ['./mobilelogin.page.scss'],
})
export class MobileloginPage implements OnInit {
  mobileLoginForm: FormGroup;
  isLoading = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.mobileLoginForm = this.fb.group({
      mobile: [
        null,
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10),
        ],
      ],
    });
  }

  ngOnInit() {}
  submitForm() {
    if (
      this.mobile_FormControl.value.toString().length < 10 ||
      this.mobile_FormControl.value.toString().length > 10
    ) {
      this.toastService.presentToast('Please enter a valid no');
    } else {
      this.isLoading = true;
      this.mobileLoginForm.get('mobile').disable();
      let obj = {
        mobileNo: '+61' + this.mobile_FormControl.value,
      };
      console.log(obj);
      this.authService.requestOtp(obj).subscribe({
        next: (data) => {
          console.log(data);
          if (data.status) {
            this.isLoading = false;
            this.toastService.presentToast('OTP sent successfully');
            this.authService.mobileNumberSubject.next(obj);
            setTimeout(() => {
              this.router.navigate(['/mobileloginverify']);
              this.mobileLoginForm.reset();
              this.mobile_FormControl.enable();
            }, 2000);
          } else {
            this.toastService.presentToast('User is Not registered');
            this.isLoading = false;
            this.mobileLoginForm.reset();
            this.mobile_FormControl.enable();
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.toastService.presentToast(err);
        },
      });
    }
  }

  get mobile_FormControl(): FormControl | null {
    return (this.mobileLoginForm?.get('mobile') as FormControl) ?? null;
  }
}
