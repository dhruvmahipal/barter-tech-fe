import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { GlobalService } from 'src/app/services/global.service';
@Component({
  selector: 'app-addaddress',
  templateUrl: './addaddress.page.html',
  styleUrls: ['./addaddress.page.scss'],
})
export class AddaddressPage implements OnInit {
  @ViewChild('searchInput') sInput;
  addAddressForm: FormGroup;
  userAddress: any;
  mobileNo: any;
  searchItems: any = [];
  query: any;
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private global: GlobalService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.addAddressForm = this.fb.group({
      tag: ['home', [Validators.required]],
      address: [null, [Validators.required]],
      pincode: [null, [Validators.required]],
      landmark: [null, [Validators.required]],
      mobile: [null, [Validators.required, Validators.maxLength(10)]],
    });
    this.route.params.subscribe((res) => {
      this.mobileNo = JSON.parse(localStorage.getItem('userNo'));
      this.mobileNo = this.mobileNo
        .split('')
        .splice(3, 13)
        .toString()
        .replaceAll(',', '');
      console.log(this.mobileNo);
      this.addAddressForm.controls['mobile'].patchValue(this.mobileNo);
    });
  }

  ngOnInit() {
    // setTimeout(() => {
    //   this.sInput.setFocus();
    // }, 500);
    this.getzipCode();
  }
  getzipCode() {
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
        this.global.hideLoader();
      },
      error: (err) => {
        this.global.hideLoader();
        console.log(err);
      },
    });
  }
  // async onSearchChange(event) {
  //   console.log(event.target.value);
  //   this.query = event.target.value;
  //   console.log(this.query);
  //   if (this.query.length >= 3) {
  //     this.global.showLoader('Loading Data');
  //     let data = {
  //       keyword: this.query,
  //     };
  //     this.authService.searchSuburb(data).subscribe({
  //       next: (data: any) => {
  //         console.log(data);
  //         if (data.data == '') {
  //           this.searchItems = [];
  //         } else {
  //           this.searchItems = data.data;
  //         }
  //         this.global.hideLoader();
  //       },
  //       error: (err) => {
  //         this.global.hideLoader();
  //         console.log(err);
  //       },
  //     });
  //   } else {
  //     this.searchItems = [];
  //   }
  // }

  addAddress() {
    if (
      this.mobile_FormControl.value.toString().length < 10 ||
      this.mobile_FormControl.value.toString().length > 10
    ) {
      this.toastService.presentToast('Please enter a valid no');
    } else {
      let data = {
        tag: this.tag_FormControl.value,
        address: this.address_FormControl.value,
        zipcode: this.pincode_FormControl.value.postal_code.postal_code,
        suburb: this.pincode_FormControl.value.suburb_name,
        landmark: this.landmark_FormControl.value,
        mobile: '+61' + this.mobile_FormControl.value,
      };
      console.log(data);
      this.global.showLoader(' Saving Data');
      this.authService.addAddress(data).subscribe({
        next: (data) => {
          console.log(data);
          if (data.status) {
            this.global.hideLoader();
            this.toastService.presentToast(data.message);
            this.addAddressForm.reset();
            this.router.navigate(['/manageaddress']);
          } else {
            this.global.hideLoader();
            this.toastService.presentToast('Error in User Details');
          }
        },
        error: (err) => {
          this.global.hideLoader();
          console.log(err);
          const { address, landmark, mobile, tag, zipcode } = err.error;
          this.toastService.presentToast(
            tag || address || zipcode || landmark || mobile
          );
        },
      });
    }
  }

  changeRoute() {
    this.addAddressForm.reset();
    this.router.navigate(['/manageaddress']);
  }
  portChange(event) {
    console.log(event, '--event-');
  }

  // onChangeOfOptions(event){
  //   if(!event){
  //     this.items = this.origItems;
  // } // when nothing has typed*/
  // if (typeof event === 'string') {
  //     console.log(event);
  //     this.userAddress = this.userAddress.filter(a => a.toLowerCase()
  //                                        .startsWith(event.toLowerCase()));
  // }
  // console.log(this.userAddress.length);

  // }

  get tag_FormControl(): FormControl | null {
    return (this.addAddressForm?.get('tag') as FormControl) ?? null;
  }
  get address_FormControl(): FormControl | null {
    return (this.addAddressForm?.get('address') as FormControl) ?? null;
  }
  get pincode_FormControl(): FormControl | null {
    return (this.addAddressForm?.get('pincode') as FormControl) ?? null;
  }
  get landmark_FormControl(): FormControl | null {
    return (this.addAddressForm?.get('landmark') as FormControl) ?? null;
  }
  get mobile_FormControl(): FormControl | null {
    return (this.addAddressForm?.get('mobile') as FormControl) ?? null;
  }
}
