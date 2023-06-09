import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { GlobalService } from 'src/app/services/global.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-editaddress',
  templateUrl: './editaddress.page.html',
  styleUrls: ['./editaddress.page.scss'],
})
export class EditaddressPage implements OnInit, OnDestroy {
  editAddressForm: FormGroup;
  userAddress: any;
  subscribeObject = new Subscription();
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private router: Router,
    private global: GlobalService
  ) {
    this.editAddressForm = this.fb.group({
      tag: [null, [Validators.required]],
      address: [null, [Validators.required]],
      zipcode: [null, [Validators.required]],
      landmark: [null, [Validators.required]],
      mobile: [null, [Validators.required, Validators.maxLength(10)]],
      address_id: [null],
    });
  }
  ngOnDestroy(): void {
    this.subscribeObject.unsubscribe();
  }

  ngOnInit() {
    this.geteditTable();
  }

  geteditTable() {
    this.subscribeObject = this.authService.addressSubject.subscribe(
      (res: any) => {
        console.log(res);
        this.getzipCode(res);
        if (res) {
          this.editAddressForm.controls['address'].patchValue(res.addressLine1);
          this.editAddressForm.controls['landmark'].patchValue(
            res.addressLine2
          );
          this.editAddressForm.controls['mobile'].patchValue(
            res.address_mobile
          );
          this.editAddressForm.controls['address_id'].patchValue(res.id);
          this.editAddressForm.patchValue(res);
        }
      }
    );
  }
  getzipCode(res) {
    this.global.showLoader('Loading Data');
    this.authService.getZipCode().subscribe({
      next: (data: any) => {
        this.userAddress = data.data;
        let address = this.userAddress.map((x) => {
          x.namewithpostal = x.suburb_name + '-' + x?.postal_code?.postal_code;
          return x;
        });
        this.userAddress = address;
        console.log(this.userAddress);
        let obj = this.userAddress.find((x) => {
          return x.suburb_name === res.suburb;
        });
        console.log(obj);
        this.editAddressForm.controls['zipcode'].patchValue(obj);
        this.global.hideLoader();
      },
      error: (err) => {
        console.log(err);
        this.global.hideLoader();
      },
    });
  }
  editAddress() {
    if (
      this.mobile_FormControl.value.toString().length < 10 ||
      this.mobile_FormControl.value.toString().length > 10
    ) {
      this.toastService.presentToast('Please enter a valid no');
    } else {
      // console.log(this.editAddressForm.value);
      let obj = {
        address_id: this.editAddressForm.controls['address_id'].value,
        address: this.address_FormControl.value,
        landmark: this.landmark_FormControl.value,
        mobile: '+61' + this.mobile_FormControl.value,
        tag: this.tag_FormControl.value,
        zipcode:
          this.editAddressForm.controls['zipcode'].value.postal_code
            .postal_code,
        suburb: this.editAddressForm.controls['zipcode'].value.suburb_name,
      };
      console.log(obj);
      this.global.showLoader(' Saving Data');
      this.authService.editAddress(obj).subscribe({
        next: (data) => {
          console.log(data);
          if (data.status) {
            this.global.hideLoader();
            this.toastService.presentToast(data.message);
            this.editAddressForm.reset();
            this.router.navigate(['/manageaddress']);
          } else {
            this.global.hideLoader();
            this.toastService.presentToast('Error in User Details');
          }
        },
        error: (err) => {
          this.global.hideLoader();
          this.toastService.presentToast(
            'Something Went Wrong Please Try Again Later!'
          );
        },
      });
    }
  }
  get tag_FormControl(): FormControl | null {
    return (this.editAddressForm?.get('tag') as FormControl) ?? null;
  }
  get address_FormControl(): FormControl | null {
    return (this.editAddressForm?.get('address') as FormControl) ?? null;
  }
  get zipcode_FormControl(): FormControl | null {
    return (this.editAddressForm?.get('pincode') as FormControl) ?? null;
  }
  get landmark_FormControl(): FormControl | null {
    return (this.editAddressForm?.get('landmark') as FormControl) ?? null;
  }
  get mobile_FormControl(): FormControl | null {
    return (this.editAddressForm?.get('mobile') as FormControl) ?? null;
  }
}
