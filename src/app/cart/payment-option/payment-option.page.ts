import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Stripe,
  PaymentSheetEventsEnum,
  ApplePayEventsEnum,
  GooglePayEventsEnum,
} from '@capacitor-community/stripe';
import { AlertController } from '@ionic/angular';
import { async, Subscriber } from 'rxjs';
import { first } from 'rxjs/operators';
import { GlobalService } from 'src/app/services/global.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-payment-option',
  templateUrl: './payment-option.page.html',
  styleUrls: ['./payment-option.page.scss'],
})
export class PaymentOptionPage implements OnInit {
  url: any;

  orderType: any;
  customer_mobile: any;
  items: any[] = [];
  takeAwayPrice: any;
  cartItems: any[] = [];

  payment_method_types: any[] = [];
  platform: any;
  reedempoints: any;

  clientSecretId: any;
  billing_addressline1: any;
  billing_addressline2: any;
  customer_BillingAddress_id: any;
  customer_DeliveryAddress_Id: any;
  company_id: any;
  merchant_Id: any;
  customer_name: any;
  customer_email: any;
  ispreeorder: any;
  deliverydate: any;
  deliverytime: any;
  customercount: any;
  taxAmount: any;
  deliveryCharge: any;
  couponId: any;
  totalCouponAmt: any;
  constructor(
    public router: Router,
    private authService: AuthService,
    private http: HttpClient,
    public alertCtrl: AlertController,
    private global: GlobalService,
    private toastService: ToastService
  ) {
    Stripe.initialize({
      publishableKey: 'pk_test_HQcvhQfP6gImSm0PUpGA1xSf', //clients
      // publishableKey:
      //   'pk_test_51MBdEcSF30jh4yGpir3CLpJIEJvWnNJuqmTwVuxahkANEYzXRzgx8iveT6mI9BK7wMbrfO8oAexXkBohQdN7L7Xx00GQ0s32Nm', //test personal
    });
  }

  ngOnInit() {
    this.authService.totalDataSubject.subscribe((res: any) => {
      console.log(res);
      let preorder = JSON.parse(localStorage.getItem('preorder'));
      let currentRoute = localStorage.getItem('currentRoute');
      if (preorder) {
        this.billing_addressline1 = res.billing_addressline1;
        this.billing_addressline2 = res.billing_addressline2;
        this.customer_BillingAddress_id = res.customer_BillingAddress_id;
        this.customer_DeliveryAddress_Id = res.customer_BillingAddress_id;
        this.company_id = res.company_id;
        this.merchant_Id = res.merchant_Id;
        this.takeAwayPrice = parseFloat(res.takeAwayPrice).toFixed(2);
        this.ispreeorder = res.isPreorder;
        this.deliverydate = res.delivery_date;
        this.deliverytime = res.delivery_time;
        this.customercount = res.dinein_Customer_count;
        this.taxAmount = res.taxAmount;
        this.couponId = res.couponId;
        this.reedempoints = res.redeemPoints;
        this.totalCouponAmt = res.totalCouponAmt;
        this.deliveryCharge =
          currentRoute == 'takeaway' || currentRoute == 'dinein'
            ? '0.00'
            : res.deliveryCharge;
      } else {
        this.billing_addressline1 = res.billing_addressline1;
        this.billing_addressline2 = res.billing_addressline2;
        this.customer_BillingAddress_id = res.customer_BillingAddress_id;
        this.customer_DeliveryAddress_Id = res.customer_BillingAddress_id;
        this.company_id = res.company_id;
        this.merchant_Id = res.merchant_Id;
        this.takeAwayPrice = parseFloat(res.takeAwayPrice).toFixed(2);
        this.ispreeorder = '';
        this.deliverydate = '';
        this.deliverytime = '';
        this.customercount = '';
        this.taxAmount = res.taxAmount;
        this.couponId = res.couponId;
        this.reedempoints = res.redeemPoints;
        this.totalCouponAmt = res.totalCouponAmt;
        this.deliveryCharge =
          currentRoute == 'takeaway' || currentRoute == 'dinein'
            ? '0.00'
            : res.deliveryCharge;
      }
    });
    this.customer_name = JSON.parse(localStorage.getItem('userDetails')).name;
    this.customer_email = JSON.parse(localStorage.getItem('userDetails')).email;
    this.cartItems = JSON.parse(localStorage.getItem('cartItems'));
    this.customer_mobile = JSON.parse(localStorage.getItem('userNo'));

    Stripe.addListener(PaymentSheetEventsEnum.Loaded, () => {
      // this.processSheet = 'Ready';
      console.log('PaymentSheetEventsEnum.Loaded');
    });

    Stripe.addListener(PaymentSheetEventsEnum.FailedToLoad, () => {
      console.log('PaymentSheetEventsEnum.FailedToLoad');
    });

    Stripe.addListener(PaymentSheetEventsEnum.Completed, () => {
      // this.processSheet = 'willReady';
      console.log('PaymentSheetEventsEnum.Completed');
    });

    Stripe.addListener(PaymentSheetEventsEnum.Canceled, () => {
      // this.processSheet = 'willReady';
      console.log('PaymentSheetEventsEnum.Canceled');
    });

    Stripe.addListener(PaymentSheetEventsEnum.Failed, () => {
      // this.processSheet = 'willReady';
      console.log('PaymentSheetEventsEnum.Failed');
    });

    Stripe.addListener(GooglePayEventsEnum.Loaded, () => {
      // this.processSheet = 'Ready';
      console.log('GooglePayEventsEnum.Loaded');
    });

    Stripe.addListener(GooglePayEventsEnum.FailedToLoad, () => {
      console.log('GooglePayEventsEnum.FailedToLoad');
    });

    Stripe.addListener(GooglePayEventsEnum.Completed, () => {
      // this.processSheet = 'willReady';
      console.log('GooglePayEventsEnum.Completed');
    });

    Stripe.addListener(GooglePayEventsEnum.Canceled, () => {
      // this.processSheet = 'willReady';
      console.log('GooglePayEventsEnum.Canceled');
    });

    Stripe.addListener(GooglePayEventsEnum.Failed, () => {
      // this.processSheet = 'willReady';
      console.log('GooglePayEventsEnum.Failed');
    });

    Stripe.addListener(ApplePayEventsEnum.Loaded, () => {
      // this.processSheet = 'Ready';
      console.log('ApplePayEventsEnum.Loaded');
    });

    Stripe.addListener(ApplePayEventsEnum.FailedToLoad, () => {
      console.log('ApplePayEventsEnum.FailedToLoad');
    });

    Stripe.addListener(ApplePayEventsEnum.Completed, () => {
      // this.processSheet = 'willReady';
      console.log('ApplePayEventsEnum.Completed');
    });

    Stripe.addListener(ApplePayEventsEnum.Canceled, () => {
      // this.processSheet = 'willReady';
      console.log('ApplePayEventsEnum.Canceled');
    });

    Stripe.addListener(ApplePayEventsEnum.Failed, () => {
      // this.processSheet = 'willReady';
      console.log('ApplePayEventsEnum.Failed');
    });
  }

  gotoUrl() {
    this.router.navigate(['/cart']);
  }

  presentAlert() {
    var id = document.getElementById('modal');
    id.style.display = 'flex';
  }

  // payWithCard() {
  //   console.log('okk  ');
  //   this.makePaymentWithStripe();
  //   this.saveCustomerOrder();
  // }

  // payWithGpay() {
  //   this.makePaymentWithGpay();
  //   this.saveCustomerOrder();
  // }

  // payWithApplePay() {
  //   this.makePaymentWithApplePay();
  //   this.saveCustomerOrder();
  // }

  // payWithCash(){
  //   this.saveCustomerOrder();
  // }

  payVia(data) {
    this.saveCustomerOrder(data);
  }

  saveCustomerOrder(type: any) {
    let obj: any;
    let sizeInfo: any;
    let finalObj: any;
    this.cartItems.map((x: any) => {
      sizeInfo = x.options?.size[0];
      if (sizeInfo) {
        sizeInfo.sizeName = sizeInfo?.size_name;
        sizeInfo.additionalCost = sizeInfo?.additionalcost;
      }

      obj = {
        menuItemId: x.menuItemId,
        menuItemName: x.menuItemName,
        unitPrice: x.unitPrice,
        IsoptionApplicable: x.IsoptionApplicable,
        IsSizeApplicable: x.IsSizeApplicable,
        taxclassid: x.taxclassid,
        unit: x.unit,
        options: x.options,
        sizeInfo: sizeInfo,
      };
      finalObj = {
        menuItem: obj,
        quantity: x.product_quantity,
      };

      this.items.push(finalObj);
    });

    //console.log(this.items);

    let sendData = {
      merchant_Id: '45',
      company_id: this.company_id,
      billing_addressline1: this.billing_addressline1,
      billing_addressline2: this.billing_addressline2,
      customer_name: this.customer_name,
      customer_mobile: this.customer_mobile,
      customer_email: this.customer_email,
      customer_BillingAddress_id: this.customer_BillingAddress_id,
      customer_DeliveryAddress_Id: this.customer_DeliveryAddress_Id,
      items: this.items,
      // options: { optionGroups: [], size: [] },
      // optionGroups: [],
      // size: [],
      spiceLevel: null,
      takeAwayPrice: this.takeAwayPrice,
      taxId: '4',
      // taxclassid: '1',
      taxrate: '10.0000',
      taxvalue_type: 'P',
      orderType: localStorage.getItem('currentRoute'),
      isPreorder: this.ispreeorder,
      delivery_date: this.deliverydate,
      delivery_time: this.deliverytime,
      dinein_Customer_count: this.customercount,
      taxAmount: this.taxAmount,
      deliveryCharge: this.deliveryCharge,
    };
    console.log(sendData);
    this.global.showLoader('Please wait we are placing your order');
    this.authService.saveCustomerOrder(sendData).subscribe({
      next: (data: any) => {
        console.log(data);
        if (data) {
          if (type == 'Card') {
            this.global.hideLoader();
            this.makePaymentWithStripe(
              data.data[0].merchOrderId,
              data.data[0].orderType
            );
          } else if (type == 'Gpay') {
            this.global.hideLoader();
            this.makePaymentWithGpay(
              data.data[0].merchOrderId,
              data.data[0].orderType
            );
          } else if (type == 'ApplePay') {
            this.global.hideLoader();
            this.makePaymentWithApplePay(
              data.data[0].merchOrderId,
              data.data[0].orderType
            );
          } else if (type == 'Cash') {
            this.codStatusUpdate(
              data.data[0].merchOrderId,
              data.data[0].orderType
            );
          }
        }
      },
      error: (err) => {
        this.global.hideLoader();
        console.log(err);
      },
    });
  }

  async makePaymentWithStripe(id, type) {
    this.items = [];
    console.log('Pay with stripe button hits');

    (async () => {
      this.http
        .post<{
          paymentIntent?: string;
          client_secret?: string;
          data?: any;
        }>('https://api.orderpoint.net.au/api/createIntent', {
          amount: this.takeAwayPrice * 100,
          currency: 'AUD',
          payment_method_types: ['card'],
        })
        .toPromise(Promise)
        .then((res) => {
          //loader open
          console.log(res, 'testing payment');
          this.global.showLoader('Loading Data');
          console.log(res.data.paymentIntent.client_secret, 'dhruvvv');
          this.callForStripePayment(res.data.paymentIntent.client_secret).then(
            (response) => {
              this.sendingConfirmation(
                res.data.paymentIntent.id,
                response,
                id,
                type
              );
            }
          );
        })
        .catch((err) => {
          this.global.hideLoader();
          console.log(err);
        });
    })();
  }

  async callForStripePayment(client_secret: any) {
    await Stripe.createPaymentSheet({
      paymentIntentClientSecret: client_secret,
      merchantDisplayName: 'Order Point',
    });

    // present PaymentSheet and get result.
    //loader end
    this.global.hideLoader();
    const result = await Stripe.presentPaymentSheet();

    // if (result.paymentResult === PaymentSheetEventsEnum.Completed) {
    //   this.toastService.presentToast('Payment Success');
    //   localStorage.setItem('cartItems',JSON.stringify([]));
    //   this.authService.badgeDataSubject.next(0);
    //   this.router.navigateByUrl('/maindelivery/delivery');

    // }

    // if (result.paymentResult === PaymentSheetEventsEnum.Canceled) {
    //   console.log('Retry payment');
    //   this.toastService.presentToast('Retry payment');
    //   this.router.navigateByUrl('/cart/payment-option');
    // }

    // if (result.paymentResult === PaymentSheetEventsEnum.Failed) {
    //   console.log('Payment failed redirect to cart');
    //   this.toastService.presentToast('Payment Failed');
    //   this.router.navigateByUrl('/cart');
    // }

    return new Promise((resolve, reject) => {
      try {
        resolve(result?.paymentResult);
      } catch (error) {
        reject(error);
      }
    });
    // this.sendingConfirmation();
  }

  async makePaymentWithGpay(id, type) {
    console.log('Pay with Gpay button hits');

    (async () => {
      // Check to be able to use Google Pay on device
      const isAvailable = Stripe.isGooglePayAvailable().catch(() => undefined);
      if (isAvailable === undefined) {
        const alert = await this.alertCtrl.create({
          header: 'Gpay Not Available',
          subHeader: 'For yu device',
          message:
            'Please chose another payment method as Gpay is not available on this device',
          buttons: ['OK'],
        });
        return true;
      }

      // Connect to your backend endpoint, and get paymentIntent.
      await this.http
        .post<{
          paymentIntent: string;
          client_secret?: string;
          data?: any;
          merchantDisplayName?: string;
        }>('https://api.orderpoint.net.au/api/createIntent', {
          amount: this.takeAwayPrice * 100,
          currency: 'inr',
          payment_method_types: ['card'],
          merchantDisplayName: 'Order Point',
        })
        .toPromise(Promise)
        .then((res) => {
          //loader open
          // this.global.showLoader('Loading Data');
          this.callForGpayPayment(res.data.paymentIntent.client_secret).then(
            (response) => {
              this.sendingConfirmationForGpay(res.data.id, response, id, type);
            }
          );
        })
        .catch((err) => {
          // this.global.hideLoader();
          console.log(err);
        });
    })();
  }

  async callForGpayPayment(client_secret: any) {
    await Stripe.createGooglePay({
      paymentIntentClientSecret: client_secret,
      // merchantDisplayName: 'Stirling Arms Hotel App',
    });
    //loader close
    // this.global.hideLoader();
    // Present Google Pay
    const result = await Stripe.presentGooglePay();

    // if (result.paymentResult === GooglePayEventsEnum.Completed) {
    //   this.toastService.presentToast('Payment Success');
    //   this.router.navigateByUrl('/maindelivery/delivery');
    // }

    // if (result.paymentResult === GooglePayEventsEnum.Canceled) {
    //   this.toastService.presentToast('Retry payment');
    //   console.log('Retry payment');
    //   this.router.navigateByUrl('/cart/payment-option');
    // }

    // if (result.paymentResult === GooglePayEventsEnum.Failed) {
    //   console.log('Payment failed redirect to cart');
    //   this.toastService.presentToast('Payment Failed');
    //   this.router.navigateByUrl('/cart');
    // }

    return new Promise((resolve, reject) => {
      try {
        resolve(result?.paymentResult);
      } catch (error) {
        reject(error);
      }
    });
    // this.sendingConfirmation();
  }

  async makePaymentWithApplePay(id, type) {
    console.log('Pay with Apple pay button hits');

    (async () => {
      // Check to be able to use Apple Pay on device
      const isAvailable = Stripe.isApplePayAvailable().catch(() => undefined);
      if (isAvailable === undefined) {
        const alert = await this.alertCtrl.create({
          header: 'Apple pay Not Available',
          subHeader: 'For your device',
          message:
            'Please chose another payment methos as Apple pay is not aailable on this device',
          buttons: ['OK'],
        });
        return;
      }

      // Connect to your backend endpoint, and get paymentIntent.
      this.http
        .post<{
          paymentIntent: string;
          client_secret?: string;
          data?: any;
        }>('https://api.orderpoint.net.au/api/createIntent', {
          amount: this.takeAwayPrice * 100,
          currency: 'inr',
          payment_method_types: ['card'],
        })
        .toPromise(Promise)
        .then((res) => {
          //loader start
          this.global.showLoader('Loading Data');
          this.callForApplePayPayment(
            res.data.paymentIntent.client_secret
          ).then((response) => {
            this.sendingConfirmationForApplePay(
              res.data.id,
              response,
              id,
              type
            );
          });
        })
        .catch((err) => {
          this.global.hideLoader();
          console.log(err);
        });
    })();
  }

  async callForApplePayPayment(client_secret: any) {
    await Stripe.createApplePay({
      paymentIntentClientSecret: client_secret,
      paymentSummaryItems: [
        {
          label: 'Order',
          amount: this.takeAwayPrice * 100,
        },
      ],
      merchantIdentifier: 'merchant.net.orderpoint.customerapp',
      countryCode: 'IN',
      currency: 'INR',
    });
    //loader end
    this.global.hideLoader();
    // Present Google Pay
    const result = await Stripe.presentApplePay();

    // if (result.paymentResult === ApplePayEventsEnum.Completed) {
    //   this.toastService.presentToast('Payment Success');
    //   this.router.navigateByUrl('/maindelivery/delivery');
    // }

    // if (result.paymentResult === ApplePayEventsEnum.Canceled) {
    //   this.toastService.presentToast('Retry payment');
    //   console.log('Retry payment');
    //   this.router.navigateByUrl('/cart/payment-option');
    // }

    // if (result.paymentResult === ApplePayEventsEnum.Failed) {
    //   this.toastService.presentToast('Payment Failed');
    //   console.log('Payment failed redirect to cart');
    //   this.router.navigateByUrl('/cart');
    // }

    return new Promise((resolve, reject) => {
      try {
        resolve(result?.paymentResult);
      } catch (error) {
        reject(error);
      }
    });
    // this.sendingConfirmation();
  }

  //confirmation API code _ Legacy do not touch
  sendingConfirmation(
    responseId: any,
    paymentResultStatus: any,
    id: any,
    type: any
  ) {
    console.log(responseId, paymentResultStatus);
    console.log(id, type);
    let data = {
      paymentid: responseId,
      paymentResult: paymentResultStatus,
      id: id,
      orderType: type,
      coupon_id: this.couponId,
      redeemPoints: this.reedempoints,
      totalCouponAmt: this.totalCouponAmt,
    };
    this.authService.getCardUpdate(data).subscribe({
      next: (data: any) => {
        console.log(data);
        this.global.hideLoader();
        if (paymentResultStatus === PaymentSheetEventsEnum.Completed) {
          this.toastService.presentToast('Payment Successfull');
          localStorage.setItem('cartItems', JSON.stringify([]));
          this.authService.badgeDataSubject.next(0);
          this.router.navigateByUrl('/maindelivery/delivery');
        }

        if (paymentResultStatus === PaymentSheetEventsEnum.Canceled) {
          console.log('Retry payment');
          this.toastService.presentToast('Retry payment');
          this.router.navigateByUrl('/cart/payment-option');
        }

        if (paymentResultStatus === PaymentSheetEventsEnum.Failed) {
          console.log('Payment failed redirect to cart');
          this.toastService.presentToast('Payment Failed');
          this.router.navigateByUrl('/cart');
        }
        // this.toastService.presentToast('Order Placed Successfully');
        // localStorage.setItem('cartItems',JSON.stringify([]));
        // this.authService.badgeDataSubject.next(0);
        // this.router.navigateByUrl('/maindelivery/delivery');
      },
      error: (err) => {
        // this.toastService.presentToast(err);
      },
    });
    // return this.http.post<any>(
    //   'https://barter-tech.antino.ca/api/CardStatusupdate',
    //   {
    //     paymentid: responseId,
    //     paymentResult: paymentResultStatus,
    //     id:id,
    //     orderType:type
    //   }
    // );
  }
  sendingConfirmationForGpay(
    responseId: any,
    paymentResultStatus: any,
    id: any,
    type: any
  ) {
    console.log(responseId, paymentResultStatus);
    console.log(id, type);
    let data = {
      paymentid: responseId,
      paymentResult: paymentResultStatus,
      id: id,
      orderType: type,
    };
    this.authService.getGpayUpdate(data).subscribe({
      next: (data: any) => {
        console.log(data);
        this.global.hideLoader();
        if (paymentResultStatus === PaymentSheetEventsEnum.Completed) {
          this.toastService.presentToast('Payment Success');
          localStorage.setItem('cartItems', JSON.stringify([]));
          this.authService.badgeDataSubject.next(0);
          this.router.navigateByUrl('/maindelivery/delivery');
        }

        if (paymentResultStatus === PaymentSheetEventsEnum.Canceled) {
          console.log('Retry payment');
          this.toastService.presentToast('Retry payment');
          this.router.navigateByUrl('/cart/payment-option');
        }

        if (paymentResultStatus === PaymentSheetEventsEnum.Failed) {
          console.log('Payment failed redirect to cart');
          this.toastService.presentToast('Payment Failed');
          this.router.navigateByUrl('/cart');
        }
        // this.toastService.presentToast('Order Placed Successfully');
        // localStorage.setItem('cartItems',JSON.stringify([]));
        // this.authService.badgeDataSubject.next(0);
        // this.router.navigateByUrl('/maindelivery/delivery');
      },
      error: (err) => {
        this.toastService.presentToast(err);
      },
    });
  }

  sendingConfirmationForApplePay(
    responseId: any,
    paymentResultStatus: any,
    id: any,
    type: any
  ) {
    console.log(responseId, paymentResultStatus);
    console.log(id, type);
    let data = {
      paymentid: responseId,
      paymentResult: paymentResultStatus,
      id: id,
      orderType: type,
    };
    this.authService.getApplePayUpdate(data).subscribe({
      next: (data: any) => {
        console.log(data);
        this.global.hideLoader();
        if (paymentResultStatus === PaymentSheetEventsEnum.Completed) {
          this.toastService.presentToast('Payment Success');
          localStorage.setItem('cartItems', JSON.stringify([]));
          this.authService.badgeDataSubject.next(0);
          this.router.navigateByUrl('/maindelivery/delivery');
        }

        if (paymentResultStatus === PaymentSheetEventsEnum.Canceled) {
          console.log('Retry payment');
          this.toastService.presentToast('Retry payment');
          this.router.navigateByUrl('/cart/payment-option');
        }

        if (paymentResultStatus === PaymentSheetEventsEnum.Failed) {
          console.log('Payment failed redirect to cart');
          this.toastService.presentToast('Payment Failed');
          this.router.navigateByUrl('/cart');
        }
        // this.toastService.presentToast('Order Placed Successfully');
        // localStorage.setItem('cartItems',JSON.stringify([]));
        // this.authService.badgeDataSubject.next(0);
        // this.router.navigateByUrl('/maindelivery/delivery');
      },
      error: (err) => {
        this.toastService.presentToast(err);
      },
    });
  }

  codStatusUpdate(id, type) {
    let data = {
      orderType: type,
      id: id,
    };
    this.authService.getCodUpdate(data).subscribe({
      next: (data: any) => {
        console.log(data);
        this.global.hideLoader();
        this.toastService.presentToast('Order Placed Successfully');
        localStorage.setItem('cartItems', JSON.stringify([]));
        this.authService.badgeDataSubject.next(0);
        this.router.navigateByUrl('/maindelivery/delivery');
      },
      error: (err) => {
        this.toastService.presentToast(err);
      },
    });
  }
}
