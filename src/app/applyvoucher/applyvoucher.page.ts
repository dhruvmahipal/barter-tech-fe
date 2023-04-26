import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { GlobalService } from '../services/global.service';
@Component({
  selector: 'app-applyvoucher',
  templateUrl: './applyvoucher.page.html',
  styleUrls: ['./applyvoucher.page.scss'],
})
export class ApplyvoucherPage implements OnInit {
  isDataVisible: boolean;
  couponList: any[] = [];
  getBalance: any;
  totalBalance: any;
  pointsApplied: number;
  pointTobeRedeemed: any[] = [];
  maxPointUse: any;
  minPointUse: any;
  rulePurchaseAmount: any;
  pointsToShow: any;
  point_PerAmount: any;
  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private global: GlobalService,
    private _route: ActivatedRoute
  ) {
    this._route.params.subscribe((res) => {
      this.getVouchers();
      this.getBalanceData();
    });
  }

  ngOnInit() {
    // this.getVouchers();
  }

  getVouchers() {
    this.global.showLoader('Loading Data');
    this.authService.getVouchers().subscribe({
      next: (data: any) => {
        console.log(data);
        if (data.status) {
          data.data.map((ele) => {
            let objData = {
              couponCode: ele.couponcode.trim(),
              couponValue: ele.couponvalue,
              couponName: ele.couponName,
              couponTitle: ele.couponTitle,
              // couponDesc: ele.couponDesc,
              couponRulePurchaseAmount: ele.rule_PurchaseAmt,
              couponType: ele.couponType,
              couponId: ele.id,
            };
            this.couponList.push(objData);
          });
        } else {
          // this.toastService.presentToast(data.message);
          this.isDataVisible = true;
        }
        console.log(this.couponList);
      },
      error: (err) => {
        this.global.hideLoader();
        this.toastService.presentToast(err);
      },
    });
  }
  applyCoupon(value) {
    console.log(value);
    this.couponList.map((ele) => {
      if (ele.couponCode.toLowerCase() == value.toLowerCase()) {
        console.log('Entered');
        this.authService.couponSubject.next(ele);
      } else {
        this.authService.couponSubject.next('invalid');
      }
      this.router.navigate(['/cart']);
      this.couponList = [];
    });
  }
  getBalanceData() {
    this.pointTobeRedeemed = [];
    this.authService.getBalance().subscribe({
      next: (data: any) => {
        this.getBalance = data.data;
        this.maxPointUse = this.getBalance.pointSetup.maxPointuse;
        this.minPointUse = this.getBalance.pointSetup.minPointUse;
        this.point_PerAmount =
          this.getBalance.pointSetup.point_toRedeem_PerAmount;
        this.rulePurchaseAmount =
          this.getBalance.pointSetup.apply_point_overAmount;
        this.totalBalance = this.getBalance.availableBalance;
        this.pointsToShow = this.getBalance.availableBalance;
        this.totalBalance =
          this.totalBalance > this.maxPointUse ? 10 : this.totalBalance;
        for (
          let i = Number(this.minPointUse);
          i <= Number(this.totalBalance);
          i++
        ) {
          this.pointTobeRedeemed.push(i);
        }
        console.log(this.getBalance);
        this.global.hideLoader();
      },
      error: (err) => {
        this.global.hideLoader();
        console.log(err);
      },
    });
  }
  onApplyPointsChange(event) {
    console.log(event.target.value);
    this.pointsApplied = event.target.value;
    this.authService.pointSubject.next({
      pointApplied: this.pointsApplied,
      rulePurcharse: this.rulePurchaseAmount,
      pointTobeRedeemedAmount: this.point_PerAmount,
    });
    this.couponList = [];
    this.router.navigate(['/cart']);
  }

  existedCouponApplied(element: any) {
    this.authService.couponSubject.next(element);
    this.router.navigate(['/cart']);
    this.couponList = [];
  }
}

// applyCoupon(coupon, i) {
//     let couponValue = 0;
//     const totalInvoiceAmnt = this.grandTotal + this.couponAmount;
//     this.appliedCoupon = coupon;
//     if (this.appliedCoupon) {
//       // console.log('appliedCoupon', this.appliedCoupon);
//       if (this.appliedCoupon.couponType
//         && this.appliedCoupon.couponType === 'P'
//         && this.appliedCoupon.rule_PurchaseAmt
//         && totalInvoiceAmnt > parseFloat(this.appliedCoupon.rule_PurchaseAmt)) {
//         couponValue = totalInvoiceAmnt * ((parseFloat(Number(this.appliedCoupon.couponvalue).toFixed(2))) / 100);
//         this.couponAmount = couponValue;
//         this.grandTotal = totalInvoiceAmnt - couponValue;
//         this.selectedCoupon = this.appliedCoupon;
//         this.activeCouponIndex = i;
//         this.isLoyalty = true;
//         this.isOffer = true;
//         this.showAlert('Coupon Applied', this.appliedCoupon.couponcode + '-' + this.appliedCoupon.couponName + ': Applied');
//       } else if (this.appliedCoupon.couponType
//         && this.appliedCoupon.couponType === 'F'
//         && this.appliedCoupon.rule_PurchaseAmt
//         && totalInvoiceAmnt > parseFloat(this.appliedCoupon.rule_PurchaseAmt)) {
//         couponValue = parseFloat(Number(this.appliedCoupon.couponvalue).toFixed(2));
//         this.couponAmount = couponValue;
//         this.grandTotal = totalInvoiceAmnt - couponValue;
//         this.selectedCoupon = this.appliedCoupon;
//         this.showAlert('Coupon Applied', this.appliedCoupon.couponcode + '-' + this.appliedCoupon.couponName + ': Applied');
//         this.activeCouponIndex = i;
//         this.isLoyalty = true;
//         this.isOffer = true;
//       } else {
//         this.showAlert('Coupon Not Applied', 'Your total purchase amount doest not satisfy the minimum purchase condition $' +
//                         this.appliedCoupon.rule_PurchaseAmt);
//         this.appliedCoupon = null;
//         this.appliedCouponCode = '';
//       }
//     } else {
//       this.showAlert('Enter Coupon Code', 'Please enter coupon code');
//     }
//   }

// couponId: this.selectedCoupon && this.selectedCoupon.id ? this.selectedCoupon.id : '',
//       totalCouponAmt: this.couponAmount ? this.couponAmount : 0,
