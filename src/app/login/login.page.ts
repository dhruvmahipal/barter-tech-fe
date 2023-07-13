import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Device } from '@capacitor/device';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';
import { ToastService } from '../services/toast.service';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import {
  FacebookLogin,
  FacebookLoginResponse,
} from '@capacitor-community/facebook-login';

import { Plugins, registerWebPlugin } from '@capacitor/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { HttpClient } from '@angular/common/http';
import {
  SignInWithApple,
  SignInWithAppleOptions,
  SignInWithAppleResponse,
} from '@capacitor-community/apple-sign-in';
import { AlertController } from '@ionic/angular';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  token: any;
  user = null;
  userData: any;
  device_model: any;
  device_platform: any;
  device_uuid: any;
  device_version: any;
  device_manufacturer: any;
  device_serial: any;
  registration_id: any;
  validateForm: FormGroup;
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  showAppleSignIn: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private storage: StorageService,
    private http: HttpClient,
    private _route: ActivatedRoute,
    private alertController: AlertController,
    private global: GlobalService
  ) {
    // this._route.params.subscribe((res) => {
    //   // console.log(res);
    //   // console.log(this.router.url);
    //   this.authService.getFCMTOKEN();
    // });
    this.validateForm = this.fb.group({
      email: [
        null,
        [Validators.required, Validators.pattern(this.emailPattern)],
      ],
      password: [null, [Validators.required, Validators.minLength(6)]],
    });

    // this.authService.testData().subscribe({
    //   next: (data) => {
    //     console.log(data);
    //   },
    //   error: (err) => {
    //     console.log(err);
    //   },
    // });
  }
  // ionViewDidEnter() {
  //   GoogleAuth.init();
  // }

  async loginwithgoogle() {
    const googleUser = await GoogleAuth.signIn();
    const obj = {
      login_type: 'social',
      email: googleUser.email,
      social_id: googleUser.id,
      name: googleUser.givenName,
      // "registration_token": JSON.parse(localStorage.getItem('fcm_token')),
    };
    console.log('my user: ', googleUser);
    this.authService.login(obj).subscribe({
      next: (data) => {
        console.log(data);
        if (data.status) {
          localStorage.setItem(
            'token',
            data.data.userToken.original.access_token
          );
          // this.storage.store(
          //   'token',
          //   data.data.userToken.original.access_token
          // );
          localStorage.setItem(
            'userDetails',
            JSON.stringify(data.data.UserData)
          );
          // this.storage.store('userDetails', data.data.UserData);
          this.toastService.presentToast(data.message);
          this.router.navigate(['/account']);
        } else {
          this.toastService.presentToast(
            'Email is already registered, Please login '
          );
        }
      },
      error: (err) => {
        this.toastService.presentToast('Something Went wrong!Try Again Later');
        console.log(err.error.statusText);
      },
    });
  }

  ngOnInit() {
    this.isLoggedIn();
    this.getDeviceInfo();
    this.authService.getFCMTOKEN();
  }
  getDeviceInfo() {
    Device.getInfo().then((val: any) => {
      this.showAppleSignIn = val.platform === 'ios';
      this.device_model = val.model;
      this.device_platform = val.platform;
      this.device_uuid = val.uuid;
      if (this.device_uuid == undefined) {
        this.device_uuid = 'ND';
      }
      this.device_version = val.appVersion;
      if (this.device_version == undefined) {
        this.device_version = 'ND';
      }
      this.device_manufacturer = val.manufacturer;
    });
  }
  async isLoggedIn() {
    try {
      const token = await this.authService.getToken();
      if (!!token) {
        this.router.navigate(['/account']);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async loginwithfacebook() {
    const FACEBOOK_PERMISSIONS = [
      'email',
      'user_birthday',
      'user_photos',
      'user_gender',
    ];
    const result: FacebookLoginResponse = await FacebookLogin.login({
      permissions: FACEBOOK_PERMISSIONS,
    });
    console.log('result=', result);
    if (result.accessToken && result.accessToken.userId) {
      this.token = result.accessToken;
      this.loadUserData();
      console.log(`Facebook access token is ${result.accessToken.token}`);
      console.log(`Facebook access token is ${result.accessToken.userId}`);
    } else if (result.accessToken && !result.accessToken.userId) {
      this.getCurrentToken();
    } else {
      this.toastService.presentToast('Login Failed');
    }
  }
  loginwithapple() {
    // const firebaseConfig = {
    //   apiKey: "AIzaSyCHZgwYrB8VAgwGe4C7DkRT0P8yGDXUIPk",
    //   authDomain: "barter-tech.firebaseapp.com",
    //   projectId: "barter-tech",
    //   storageBucket: "barter-tech.appspot.com",
    //   messagingSenderId: "737194284758",
    //   appId: "1:737194284758:web:41f0e720a9da6cd7ef5b77",
    //   measurementId: "G-CDJZC6XDGS"
    // };
    this.router.navigate(['/signinapple']);
    // this.signInWithAppleNative();
  }
  signInWithAppleNative() {
    let options: SignInWithAppleOptions = {
      clientId: 'com.bartertech.app ',
      redirectURI: 'https://barter-tech.firebaseapp.com/__/auth/handler',
      scopes: 'email',
      state: '12345',
    };
    SignInWithApple.authorize(options)
      .then((result: SignInWithAppleResponse) => {
        console.log('RESULT: ', result);
        if (result.response && result.response.identityToken) {
          this.userData = result.response;
          const obj = {
            login_type: 'social',
            email: this.userData.email,
            social_id: this.userData.identityToken,
            name: this.userData.givenName,
          };
          console.log(obj);
          this.authService.login(obj).subscribe({
            next: (data) => {
              console.log(data);
              if (data.status) {
                localStorage.setItem(
                  'token',
                  data.data.userToken.original.access_token
                );
                localStorage.setItem(
                  'userDetails',
                  JSON.stringify(data.data.UserData)
                );
                // this.storage.store('userDetails', data.data.UserData);
                this.toastService.presentToast(data.message);
                this.router.navigate(['/account']);
              } else {
                this.toastService.presentToast('something went wrong');
              }
            },
            error: (err) => {
              this.toastService.presentToast(err);
              console.log(err.statusText);
            },
          });
        } else {
          this.presentAlert();
        }
      })
      .catch((response) => {
        this.presentAlert();
      });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Login Failed',
      message: 'Please try again later',
      buttons: ['OK'],
    });
    await alert.present();
  }

  async getCurrentToken() {
    const result = await FacebookLogin.getCurrentAccessToken();

    if (result.accessToken) {
      this.token = result.accessToken;
      this.loadUserData();
    } else {
      this.toastService.presentToast('Not Logged In');
    }
  }

  async loadUserData() {
    const url = `https://graph.facebook.com/${this.token.userId}?fields=id,name,gender,link,picture&type=large&access_token=${this.token.token}`;
    this.http.get(url).subscribe((res) => {
      console.log('user: ', res);
      this.user = res;
    });
    const UserFacebookData = await FacebookLogin.getProfile<{
      email: string;
    }>({ fields: ['email'] });

    console.log(`Facebook user's email is ${UserFacebookData.email}`);

    const obj = {
      login_type: 'social',
      email: UserFacebookData.email,
      social_id: this.user.id,
      name: this.user.name,
      // "registration_token": JSON.parse(localStorage.getItem('fcm_token')),
    };
    console.log(obj);
    this.authService.login(obj).subscribe({
      next: (data) => {
        console.log(data);
        if (data.status) {
          localStorage.setItem(
            'token',
            data.data.userToken.original.access_token
          );
          // this.storage.store(
          //   'token',
          //   data.data.userToken.original.access_token
          // );
          localStorage.setItem(
            'userDetails',
            JSON.stringify(data.data.UserData)
          );
          // this.storage.store('userDetails', data.data.UserData);
          this.toastService.presentToast(data.message);
          this.router.navigate(['/account']);
        } else {
          this.toastService.presentToast('something went wrong');
        }
      },
      error: (err) => {
        this.toastService.presentToast(err);
        console.log(err.statusText);
      },
    });
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.invalid) {
      return;
    } else {
      this.signIn();
    }
  }
  signIn() {
    let data = {
      email: this.validateForm.controls['email'].value,
      password: this.validateForm.controls['password'].value,
      // device_model: this.device_model,
      // device_platform: this.device_platform,
      // device_uuid: this.device_uuid,
      // device_version: this.device_version,
      // device_manufacturer: this.device_manufacturer,
      // registration_token: JSON.parse(localStorage.getItem('fcm_token')),
    };
    console.log(data);
    this.authService.badgeDataSubject.next(0);
    this.global.showLoader('Signing in');
    this.authService.login(data).subscribe({
      next: (data) => {
        this.global.hideLoader();
        console.log(data);
        if (data.status) {
          localStorage.setItem(
            'token',
            data.data.userToken.original.access_token
          );
          // this.storage.store(
          //   'token',
          //   data.data.userToken.original.access_token
          // );
          localStorage.setItem(
            'userDetails',
            JSON.stringify(data.data.UserData)
          );
          // this.storage.store('userDetails', data.data.UserData);
          this.toastService.presentToast(data.message);
          this.router.navigate(['/account']);
          this.validateForm.reset();
        } else {
          this.toastService.presentToast(data.message);
        }
      },
      error: (err) => {
        this.global.hideLoader();
        // this.toastService.presentToast(err.message);
        const { email, password } = err.error;
        this.toastService.presentToast(email || password);
        console.log(err);
      },
    });
  }

  get officialEmail() {
    return this.validateForm.get('email');
  }

  get email_FormControl(): FormControl | null {
    return (this.validateForm?.get('email') as FormControl) ?? null;
  }
  get password_FormControl(): FormControl | null {
    return (this.validateForm?.get('password') as FormControl) ?? null;
  }
}
