import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { ToastService } from '../services/toast.service';

import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  quantity: number = 1;
  isCouponApplied: boolean;
  isCouponUsed: boolean = false;
  appliedCoupon: any;
  customer_name: any;
  customer_email: any;
  customer_mobile: any;
  userAddress: any;
  currentAddress: any;
  selectedAddress: any;
  optionSelected: any;
  cartItems: any[] = [];
  itemTotal: any = 0;
  deliveryCharges: number = 0;
  gst = 0;
  totalPayable: number = 0;
  currentRoute: any;
  preorderCheckbox: boolean = false;
  checkboxBoolean: boolean = false;
  preorder: any;
  customValuesPrice: number = 0;
  tempdata: any;
  distance: any;
  suburb_name: any;
  showWarning: boolean = false;
  couponAmount: number = 0;
  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private global: GlobalService,
    private alertController: AlertController,
    private toastService: ToastService
  ) {
    console.log('cartttttttttt');
    this.route.params.subscribe((res) => {
      this.cartItems = JSON.parse(localStorage.getItem('cartItems'));
      console.log('cartttttttttt', this.cartItems);

      this.customer_name = JSON.parse(localStorage.getItem('userDetails')).name;
      this.customer_email = JSON.parse(
        localStorage.getItem('userDetails')
      ).email;
      this.customer_mobile = JSON.parse(localStorage.getItem('userNo'));
      // console.log(this.cartItems);

      this.currentRoute = localStorage.getItem('currentRoute');
      this.getAddress();
      // if (this.cartItems?.length > 0 && this.currentRoute == 'delivery') {
      //   this.getAddress();
      // }
    });
    // this.cartItems.map(x =>{
    //   this.customPriceValidate(x);
    // })
  }

  ngOnInit() {
    this.route.params.subscribe((res) => {
      this.cartItems = JSON.parse(localStorage.getItem('cartItems'))
        ? JSON.parse(localStorage.getItem('cartItems'))
        : [];
      let showFoodItems = {};
      for (let i = 0; i < this.cartItems.length; i++) {
        const elem = this.cartItems[i];
        if (showFoodItems[elem.menuItemId]) {
          if (elem?.options?.optionGroups?.length == 0) {
            showFoodItems[elem.menuItemId]['product_quantity'] =
              showFoodItems[elem.menuItemId]['product_quantity'] + 1;
          } else {
            showFoodItems[`${elem.menuItemId}-${i}`] = elem;
          }
        } else if (!showFoodItems[elem.menuItemId]) {
          showFoodItems[elem.menuItemId] = elem;
        }
      }
      localStorage.removeItem('cartItems');
      this.cartItems = Object.values(showFoodItems);
      console.log(this.cartItems);

      this.cartItems.map((x) => {
        if (this.currentRoute == 'delivery') {
          if (x?.options?.size[0] == null) {
            x.displaySizeValue = x.deliveryPrice;
            x.unitPrice = x.displaySizeValue;
          } else {
            x.displaySizeValue = x.options.size[0].size_deliveryPrice;
            x.unitPrice = x.displaySizeValue;
          }
        } else if (this.currentRoute == 'takeaway') {
          if (x.options.size[0] == null) {
            x.displaySizeValue = x.takeAwayPrice;
            x.unitPrice = x.displaySizeValue;
          } else {
            x.displaySizeValue = x.options.size[0].size_takeawayPrice;
            x.unitPrice = x.displaySizeValue;
          }
        } else if (this.currentRoute == 'dinein') {
          if (x.options.size[0] == null) {
            x.displaySizeValue = x.dineInPrice;
            x.unitPrice = x.displaySizeValue;
          } else {
            x.displaySizeValue = x.options.size[0].size_dineInPrice;
            x.unitPrice = x.displaySizeValue;
          }
        }
        // console.log(x.displaySizeValue);
        // console.log(x.taxrate);
        if (x.taxvalue_type === 'P' && x.IsPriceTaxInclusive === '1') {
          x.taxdisplayAmount = (x.displaySizeValue * x.taxrate) / 100;
          console.log(x.taxdisplayAmount);
        } else {
          x.taxdisplayAmount = 0;
          console.log(x.taxdisplayAmount);
        }
      });
      localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
      this.customer_name = JSON.parse(localStorage.getItem('userDetails')).name;
      this.customer_email = JSON.parse(
        localStorage.getItem('userDetails')
      ).email;
      this.customer_mobile = JSON.parse(localStorage.getItem('userNo'));
      console.log(this.cartItems);

      this.currentRoute = localStorage.getItem('currentRoute');
      this.customValuesPrice = 0;
      let currentvalue = 0;

      this.customValuesPrice = this.customPriceValidate(
        this.cartItems,
        currentvalue
      );
      if (this.cartItems) {
        this.getItemTotal();
      } else {
        this.cartItems = [];
      }
      for (var key in localStorage) {
        if (key == 'preorder') {
          this.preorder = JSON.parse(localStorage.getItem('preorder'));
          console.log(this.preorder);
        } else {
          this.checkboxBoolean = false;
        }
      }
    });

    if (this.preorder) {
      this.checkboxBoolean = true;
    }
    this.authService.pointSubject.subscribe((res: any) => {
      console.log(res);

      if (Object.keys(res).length != 0) {
        if (this.itemTotal > res.rulePurcharse) {
          this.isCouponApplied = true;
          this.isCouponUsed = true;
          this.couponAmount =
            Number(res.pointApplied) * Number(res.pointTobeRedeemedAmount);
          console.log(this.couponAmount);
          this.appliedCoupon = {};
          this.appliedCoupon.couponCode = 'Loyalty Point';
        } else {
          this.isCouponUsed = false;
          this.isCouponApplied = false;
          this.toastService.presentToast(
            ' Your total purchase amount doest not satisfy the minimum purchase condition'
          );
        }
      } else {
        this.isCouponUsed = false;
        this.isCouponApplied = false;
      }
    });
    console.log({ test: this.isCouponApplied, test2: this.isCouponUsed });
    this.authService.couponSubject.subscribe((res: any) => {
      console.log({ res });
      if (res != 'invalid' && Object.keys(res).length != 0) {
        this.isCouponApplied = true;
        this.isCouponUsed = true;
        this.appliedCoupon = res;
        let couponValue = 0;
        console.log(this.itemTotal);
        const totalInvoiceAmnt = this.itemTotal;
        if (this.appliedCoupon) {
          // console.log('appliedCoupon', this.appliedCoupon);
          if (
            !!this.appliedCoupon?.couponType &&
            this.appliedCoupon?.couponType === 'P' &&
            this.appliedCoupon?.couponRulePurchaseAmount &&
            totalInvoiceAmnt >
              parseFloat(this.appliedCoupon.couponRulePurchaseAmount)
          ) {
            couponValue =
              totalInvoiceAmnt *
              (parseFloat(Number(this.appliedCoupon.couponValue).toFixed(2)) /
                100);
            this.couponAmount = couponValue;
            console.log('--211');

            // this.grandTotal = totalInvoiceAmnt - couponValue;
            // this.selectedCoupon = this.appliedCoupon;
          } else if (
            !!this.appliedCoupon?.couponType &&
            this.appliedCoupon?.couponType === 'F' &&
            this.appliedCoupon?.couponRulePurchaseAmount &&
            totalInvoiceAmnt >
              parseFloat(this.appliedCoupon.couponRulePurchaseAmount)
          ) {
            couponValue = parseFloat(
              Number(this.appliedCoupon.couponValue).toFixed(2)
            );
            this.couponAmount = couponValue;
            console.log('--225');

            // this.grandTotal = totalInvoiceAmnt - couponValue;
            // this.selectedCoupon = this.appliedCoupon;
          } else {
            this.isCouponUsed = false;
            this.isCouponApplied = false;
            console.log('--230');
            this.toastService.presentToast(
              ' Your total purchase amount doest not satisfy the minimum purchase condition'
            );
            res = null;
            // this.authService.couponSubject.next(null);
            this.appliedCoupon = null;

            // this.appliedCouponCode = '';
          }
        } else {
          this.toastService.presentToast('Enter Coupon Code');
        }

        this.getItemTotal();
      } else if (Object.keys(res).length == 0) {
        this.isCouponUsed = false;
        this.isCouponApplied = false;
      } else if (res == 'invalid') {
        this.isCouponUsed = true;
      }
      console.log(res);
    });
    // this.getAddress();
    // setTimeout(() => {
    //   if (this.currentRoute == 'delivery' && this.cartItems.length > 0) {
    //     this.presentAlert();
    //   }
    // }, 7000);
  }

  changeRoute() {
    this.remove();
    let route = !this.currentRoute ? 'delivery' : this.currentRoute;
    this.router.navigate(['/maindelivery/' + route]);
  }

  subQty(product, index) {
    let removeItems = [];
    let remainingItems = [];
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    if (product.product_quantity < 2) {
      product.product_quantity = product.product_quantity - 1;
      let latestCartItems = JSON.parse(localStorage.getItem('cartItems'));
      latestCartItems.forEach((element) => {
        if (element.menuItemId == product.menuItemId) {
          removeItems.push(element);
        } else {
          remainingItems.push(element);
        }
      });
      removeItems.pop();
      latestCartItems = removeItems.concat(remainingItems);
      this.cartItems = latestCartItems;
      // localStorage.setItem('cartItems', JSON.stringify(latestCartItems));
      let productLength = 0;
      latestCartItems.forEach((element) => {
        productLength += element.product_quantity;
      });
      this.authService.badgeDataSubject.next(productLength);
      // this.customPriceValidateForSub(product);
    } else {
      product.product_quantity = product.product_quantity - 1;
      // localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
      let productLength = 0;
      this.cartItems.forEach((element) => {
        productLength += element.product_quantity;
      });
      this.authService.badgeDataSubject.next(productLength);
    }
    this.customPriceValidateForSub(product);
    this.getItemTotal();
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    if (this.cartItems.length == 0) {
      this.authService.couponSubject.next({});
      this.authService.pointSubject.next({});
    }
  }

  addQty(product, index) {
    product.product_quantity = product.product_quantity + 1;
    this.customValuesPrice = this.customPriceValidate(this.cartItems, 0);
    let productLength = 0;
    this.cartItems.forEach((element) => {
      productLength += element.product_quantity;
    });
    this.getItemTotal();
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    this.authService.badgeDataSubject.next(productLength);
  }

  async makePayment() {
    let obj;
    this.preorder = JSON.parse(localStorage.getItem('preorder'));
    if (this.currentRoute == 'delivery') {
      obj = {
        merchant_Id: 45,
        company_id: 1,
        customer_BillingAddress_id: this.selectedAddress.id,
        billing_addressline1: this.selectedAddress.addressLine1,
        billing_addressline2: this.selectedAddress.addressLine2,
        takeAwayPrice: this.totalPayable,
        taxAmount: this.gst,
        deliveryCharge: this.deliveryCharges,
        couponId:
          this.appliedCoupon && this.appliedCoupon.couponId
            ? this.appliedCoupon.couponId
            : 0,
        totalCouponAmt: this.appliedCoupon?.couponValue
          ? this.appliedCoupon?.couponValue
          : 0,
        redeemPoints:
          this.appliedCoupon?.couponCode == 'Loyalty Point'
            ? this.couponAmount
            : 0,
      };
    } else {
      obj = {
        merchant_Id: 45,
        company_id: 1,
        customer_BillingAddress_id: '',
        billing_addressline1: '',
        billing_addressline2: '',
        takeAwayPrice: this.totalPayable,
        taxAmount: this.gst,
        deliveryCharge: this.deliveryCharges,
        couponId:
          this.appliedCoupon && this.appliedCoupon?.couponId
            ? this.appliedCoupon?.couponId
            : '',
        totalCouponAmt: this.appliedCoupon?.couponValue
          ? this.appliedCoupon?.couponValue
          : 0,
        redeemPoints:
          this.appliedCoupon?.couponCode == 'Loyalty Point'
            ? this.couponAmount
            : 0,
      };
    }
    if (!this.preorderCheckbox && this.preorder) {
      const alert = await this.alertController.create({
        message: 'Confirm to place Preorder',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              this.authService.totalDataSubject.next(obj);

              localStorage.removeItem('preorder');
              this.router.navigate([this.router.url, 'payment-option']);
            },
          },
          {
            text: 'OK',
            role: 'confirm',
            handler: () => {
              this.preorderCheckbox = true;
              obj.isPreorder = '1';
              obj.delivery_date = this.preorder.selectedDate;
              obj.delivery_time = this.preorder.selectedTime;
              if ((this.preorder.type = 'dinein')) {
                obj.dinein_Customer_count = this.preorder.selectedPeople;
              }
              this.authService.totalDataSubject.next(obj);
              this.router.navigate([this.router.url, 'payment-option']);
            },
          },
        ],
      });

      await alert.present();
    } else if (this.preorderCheckbox && this.preorder) {
      obj.isPreorder = '1';
      obj.delivery_date = this.preorder.selectedDate;
      obj.delivery_time = this.preorder.selectedTime;
      if ((this.preorder.type = 'dinein')) {
        obj.dinein_Customer_count = this.preorder.selectedPeople;
      }
      this.authService.totalDataSubject.next(obj);
      this.router.navigate([this.router.url, 'payment-option']);
    } else {
      this.authService.totalDataSubject.next(obj);
      this.router.navigate([this.router.url, 'payment-option']);
    }
    this.authService.couponSubject.next({});
    this.authService.pointSubject.next({});
  }

  customPriceValidate(product, calculateSubItemPrice: number) {
    // this.customValuesPrice = 0;
    if (Array.isArray(product)) {
      product.map((x) => {
        let perItemPrice = Number(x.displaySizeValue);
        x?.options?.optionGroups.map((y) => {
          let subPerItemPrice = 0;
          y.optionItems.map((z) => {
            if (z.selected) {
              if (this.currentRoute == 'delivery') {
                subPerItemPrice += Number(z.deliveryPrice);
                calculateSubItemPrice =
                  calculateSubItemPrice + z.deliveryPrice * x.product_quantity;

                z.displayValue = z.deliveryPrice;
                z.displayOptionValue = z.deliveryPrice;
              } else if (this.currentRoute == 'takeaway') {
                subPerItemPrice += Number(z.takeawayPrice);
                calculateSubItemPrice =
                  calculateSubItemPrice + z.takeawayPrice * x.product_quantity;
                z.displayValue = z.takeawayPrice;
                z.displayOptionValue = z.takeawayPrice;
              } else if (this.currentRoute == 'dinein') {
                subPerItemPrice += Number(z.dineinPrice);
                calculateSubItemPrice =
                  calculateSubItemPrice + z.dineinPrice * x.product_quantity;
                z.displayValue = z.dineinPrice;
                z.displayOptionValue = z.dineinPrice;
              }
            }
          });
          console.log({ subPerItemPrice });
          perItemPrice += subPerItemPrice;
        });
        console.log({
          perItemPrice,
          grossPrice: perItemPrice * x.product_quantity,
        });
        x.perItemTotalPrice = perItemPrice * x.product_quantity;
        if (x.taxvalue_type === 'P' && x.IsPriceTaxInclusive === '1') {
          x.perItemgst = x.perItemTotalPrice / 11;
        } else {
          x.perItemgst = 0;
        }
      });
    }
    console.log(product, '------');
    return calculateSubItemPrice;
  }

  customPriceValidateForSub(product) {
    product.perItemTotalPrice -= product.displaySizeValue;
    product.options.optionGroups.map((y) => {
      y.optionItems.map((z) => {
        if (z.selected) {
          if (this.currentRoute == 'delivery') {
            product.perItemTotalPrice -= z.deliveryPrice;
            this.customValuesPrice = this.customValuesPrice - z.deliveryPrice;
          } else if (this.currentRoute == 'takeaway') {
            product.perItemTotalPrice -= z.takeawayPrice;
            this.customValuesPrice = this.customValuesPrice - z.takeawayPrice;
          } else if (this.currentRoute == 'dinein') {
            product.perItemTotalPrice -= z.dineinPrice;
            this.customValuesPrice = this.customValuesPrice - z.dineinPrice;
          }
        }
        console.log({ customValue: this.customValuesPrice });
      });
    });
    if (product.taxvalue_type === 'P' && product.IsPriceTaxInclusive === '1') {
      product.perItemgst = product.perItemTotalPrice / 11;
    } else {
      product.perItemgst = 0;
    }
    console.log(product, '------');

    // this.router.navigate([this.router.url, 'payment-option']);
    // let obj = {
    //   merchant_Id: 68,
    //   company_id: 1,
    //   customer_BillingAddress_id: this.selectedAddress.id,
    //   billing_addressline1: this.selectedAddress.addressLine1,
    //   billing_addressline2: this.selectedAddress.addressLine2,
    //   takeAwayPrice: this.totalPayable,
    // };
    // this.authService.totalDataSubject.next(obj);
  }

  getItemTotal() {
    this.itemTotal = 0;
    this.gst = 0;
    // if(this.currentRoute=='delivery'){
    //   this.cartItems.map((ele) => {
    //     this.itemTotal = this.itemTotal + ele.deliveryPrice * ele.product_quantity;
    //   });
    // }
    // else if(this.currentRoute=='takeaway'){
    //   this.cartItems.map((ele) => {
    //     this.itemTotal = this.itemTotal + ele.takeAwayPrice * ele.product_quantity;
    //   });
    // }
    // else if(this.currentRoute=='dinein'){
    //   this.cartItems.map((ele) => {
    //     this.itemTotal = this.itemTotal + ele.dineInPrice * ele.product_quantity;
    //   });
    // }

    this.cartItems.map((ele) => {
      this.itemTotal =
        this.itemTotal + Number(ele.displaySizeValue) * ele.product_quantity;
      // (ele.taxdisplayAmount + this.gst) * ele.product_quantity;
      // this.gst = this.gst + ele.taxdisplayAmount * ele.product_quantity;
      this.gst += ele.perItemgst;
    });
    console.log(this.customValuesPrice);
    this.itemTotal = this.itemTotal + this.customValuesPrice;

    console.log(this.gst);
    if (this.currentRoute == 'dinein' || this.currentRoute == 'takeaway') {
      this.totalPayable = this.itemTotal - this.couponAmount;
      // (this.appliedCoupon ? this.appliedCoupon.couponValue : 0);
    } else {
      this.totalPayable =
        this.itemTotal + this.deliveryCharges - this.couponAmount;
      // Number(this.appliedCoupon.couponvalue);
      // (this.appliedCoupon ? this.appliedCoupon.couponValue : 0);
    }
  }

  remove() {
    this.couponAmount = 0;
    if (this.appliedCoupon) {
      this.appliedCoupon.couponValue = 0;
      this.appliedCoupon.couponCode = undefined;
      this.appliedCoupon.couponId = 0;
    }
    this.authService.couponSubject.next({});
    this.authService.pointSubject.next({});
    this.isCouponApplied = false;
    this.isCouponUsed = false;
    console.log(this.isCouponApplied);
    console.log(this.isCouponUsed);
    this.getItemTotal();
  }

  getAddress() {
    this.global.showLoader('Loading Data');
    this.authService.getAddress().subscribe({
      next: (data: any) => {
        this.userAddress = data.data;
        let getselectedAddress = JSON.parse(
          localStorage.getItem('selectedUserAddress')
        );
        if (getselectedAddress) {
          this.selectedAddress = getselectedAddress;
        } else {
          this.selectedAddress = this.userAddress[0];
        }

        console.log(this.userAddress);
        this.getDeliveryCharges();
      },
      error: (err) => {
        this.global.hideLoader();
        console.log(err);
      },
    });
  }

  getDeliveryCharges() {
    this.authService.getZipCode().subscribe({
      next: (data: any) => {
        console.log(data.data);
        this.tempdata = data.data;
        this.tempdata.map((x) => {
          if (x.suburb_name == this.selectedAddress.suburb) {
            this.suburb_name = x.suburb_name;
            // this.distance = x.distance_in_km;
            let obj = {
              suburb_name: this.suburb_name,
            };
            console.log(obj);
            this.authService.getDeliveryCharges(obj).subscribe({
              next: (data: any) => {
                this.deliveryCharges = Number(data.data);
                if (
                  this.deliveryCharges == 0 &&
                  this.currentRoute == 'delivery'
                ) {
                  this.showWarning = true;
                  console.log(this.showWarning);
                } else {
                  this.showWarning = false;
                }
                console.log(this.deliveryCharges);
                this.getItemTotal();
                this.global.hideLoader();
              },
              error: (err) => {
                console.log(err);
                this.global.hideLoader();
              },
            });
          }
        });
      },
      error: (err) => {
        this.global.hideLoader();
        console.log(err);
      },
    });
  }

  onAddressChange(event) {
    this.global.showLoader('Loading Data');
    console.log(event.target.value);
    this.selectedAddress = event.target.value;
    localStorage.setItem(
      'selectedUserAddress',
      JSON.stringify(this.selectedAddress)
    );
    this.getDeliveryCharges();
    setTimeout(() => {
      this.global.hideLoader();
    }, 6000);
  }
  // async presentAlert() {
  //   const alert = await this.alertController.create({
  //     message: 'Please reconfirm your delivery address',
  //     buttons: ['OK'],
  //   });
  //   await alert.present();
  // }
  // saveCustomerOrder() {
  //   let obj = {
  //     merchant_Id: 4,
  //     company_id: 1,
  //     billing_addressline1: this.selectedAddress.addressLine1,
  //     billing_addressline2: this.selectedAddress.addressLine2,
  //   };
  // }
}
