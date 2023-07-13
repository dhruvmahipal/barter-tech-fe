import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';
import { BehaviorSubject } from 'rxjs';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { AlertController } from '@ionic/angular';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token: string = '';
  url: string = environment.serverUrl;
  url2: string = 'https://api.orderpoint.net.au/api';
  // url3: string =
  //   'https://op-au-uat-cusapp-api.azurewebsites.net/api/sendresponse';
  url4: string = 'https://merchantapi.orderpoint.net.au/api/v1';
  addressSubject = new BehaviorSubject({});
  accountSubject = new BehaviorSubject({});
  couponSubject = new BehaviorSubject({});
  pointSubject = new BehaviorSubject({});
  mobileNumberSubject = new BehaviorSubject({});
  totalDataSubject = new BehaviorSubject({});
  badgeDataSubject = new BehaviorSubject(0);
  routeSubject = new BehaviorSubject({});

  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: StorageService,
    private _alertController: AlertController
  ) {}

  registerUser(data): Observable<any> {
    return this.http.post<any>(this.url2 + '/register', data);
  }
  login(data) {
    return this.http.post<any>(this.url2 + '/login', data);
  }
  forgetPass(email: string) {
    let body = { email };
    return this.http.post<any>(this.url2 + '/forgotPassword', body);
  }
  getToken() {
    return localStorage.getItem('token');
    // return this.storage.get('token');
  }
  contactUs(data) {
    return this.http.post<any>(this.url2 + '/contactUs', data);
  }
  loggedIn() {
    return !!localStorage.getItem('token');
    // return !!this.getToken();
  }
  forgetPassVerify(data) {
    return this.http.post<any>(this.url2 + '/resetPassword', data);
  }
  editProfile(data) {
    return this.http.post<any>(this.url2 + '/editprofile', data);
  }
  addAddress(data) {
    return this.http.post<any>(this.url2 + '/addaddress', data);
  }
  editAddress(data) {
    return this.http.post<any>(this.url2 + '/editAddress', data);
  }
  reservation(data) {
    return this.http.post<any>(this.url2 + '/TableReservation', data);
  }
  getAddress() {
    return this.http.get(this.url2 + '/getaddress');
  }
  mobileLoginVerify(data) {
    return this.http.post<any>(this.url2 + '/verifyOtp', data);
  }
  requestOtp(data) {
    return this.http.post<any>(this.url2 + '/requestOtp', data);
  }
  getBalance() {
    let params = new HttpParams().append('merchant_id', '45');
    return this.http.get(this.url2 + '/balance-details', { params });
  }
  async logout() {
    try {
      // await this.storage.clear();
      await localStorage.clear();
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
  getProfile() {
    return this.http.get(this.url2 + '/profile');
  }
  getVouchers() {
    const params = new HttpParams().append('merchant_id', '45');
    return this.http.get(this.url2 + '/getvouchers', { params });
  }
  getMyOrders() {
    return this.http.get(this.url2 + '/myOrders');
  }
  getOrderDetails(id) {
    const params = new HttpParams().append('id', id);
    return this.http.get(this.url2 + '/getOrderDetails', { params });
  }
  insertReview(data) {
    return this.http.post(this.url2 + '/insertReview', data);
  }
  // testData() {
  //   return this.http.get(this.url3);
  // }
  searchData(keyword) {
    let params = new HttpParams().append('merchant_id', '45');
    params = params.append('keyword', keyword);
    return this.http.get(this.url2 + '/searchItems', { params });
  }
  saveCustomerOrder(data) {
    return this.http.post(this.url2 + '/saveCustomerOrder', data);
  }
  deleteAddress(data) {
    return this.http.post(this.url2 + '/Deleteaddress', data);
  }
  getZipCode() {
    let params = new HttpParams().append('merchant_id', '45');
    params = params.append('country_id', '1');
    return this.http.get(this.url2 + '/zipCode', { params });
  }
  getworkingHours() {
    const params = new HttpParams().append('merchant_id', '45');
    return this.http.get(this.url2 + '/workingHours', { params });
  }
  getDeliveryCharges(data) {
    let params = new HttpParams().append('suburb_name', data.suburb_name);
    params = params.append('merchant_id', '45');
    return this.http.get(this.url2 + '/DeliveryCharges', { params });
  }
  getCodUpdate(data) {
    return this.http.post(this.url2 + '/CODstatusUpdate', data);
  }
  getCardUpdate(data) {
    return this.http.post(this.url2 + '/CardStatusupdate', data);
  }
  getGpayUpdate(data) {
    return this.http.post(this.url2 + '/GpayStatusupdate', data);
  }
  getApplePayUpdate(data) {
    return this.http.post(this.url2 + '/ApplepayStatusupdate', data);
  }
  setProfilePhoto(data) {
    return this.http.post(this.url2 + '/profilePic', data);
  }
  searchSuburb(data) {
    let params = new HttpParams().append('keyword', data.keyword);
    return this.http.get(this.url2 + '/search_suburb', { params });
  }
  getUrl() {
    const params = new HttpParams().append('Merchant_Id', '45');
    return this.http.get(this.url2 + '/URLS', { params });
  }
  getCarouselImages(data) {
    let params = new HttpParams().append('merchant_id', '45');
    params = params.append('order_type', data.order_type);
    return this.http.get(this.url2 + '/CarouselImages', { params });
  }
  sendEmailInvoice(data) {
    return this.http.post(this.url2 + '/sendInvoice', data);
  }
  appleLogin(data) {
    return this.http.post(this.url2 + '/LoginwithApple', data);
  }
  accountDelete(obj) {
    return this.http.post(this.url2 + '/DeleteAccoutStatus', obj);
  }

  getFCMTOKEN() {
    PushNotifications.requestPermissions().then((result) => {
      console.log('starting', result);
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    PushNotifications.addListener('registration', (token: Token) => {
      this.token = token.value;
      console.log(this.token + 'token value');
      localStorage.setItem('fcm_token', JSON.stringify(this.token));
      //alert('Push registration success, token: ' + token.value);
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      // alert('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotificationSchema) => {
        await (
          await this._alertController.create({
            header: notification.title,
            message: notification.body,
            buttons: ['Close'],
          })
        ).present();
      }
    );

    // PushNotifications.addListener(
    //   'pushNotificationReceived',
    //   (notification: PushNotificationSchema) => {
    //     alert('Push received: ' + JSON.stringify(notification));
    //   }
    // );
    // PushNotifications.addListener(
    //   'pushNotificationReceived',
    //   async (notification: PushNotificationSchema) => {
    //     let not: ScheduleOptions = {
    //       notifications: [
    //         {
    //           id: Date.now(),
    //           body: notification.body,
    //           title: notification.title,
    //           ongoing: false,
    //         },
    //       ],
    //     };
    //     const result = await LocalNotifications.schedule(not);
    //     console.log(result);
    //   }
    // );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        // alert('Push action performed: ' + JSON.stringify(notification));
      }
    );
  }
}
