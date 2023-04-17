import { Component, OnDestroy, OnInit } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Browser } from '@capacitor/browser';
import {
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { GlobalService } from '../services/global.service';
import { ToastService } from '../services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Location } from '@angular/common';
import { App } from '@capacitor/app';
import { ModalController } from '@ionic/angular';
import { ProfilephotooptionComponent } from '../components/profilephotooption/profilephotooption.component';
import {
  ImagePicker,
  ImagePickerOptions,
} from '@awesome-cordova-plugins/image-picker/ngx';
import { WebView } from '@awesome-cordova-plugins/ionic-webview/ngx';
import { Capacitor } from '@capacitor/core';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { read } from 'fs';
import { finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
const IMAGE_DIR = 'stored-images';
interface LocalFile {
  name: string;
  path: string;
  data: string;
}
@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  images: LocalFile[] = [];
  percentage = 0;
  qrCodeString = '';
  // scannedResults:any;
  // content_visibility='hidden';
  zipped: boolean = false;
  isBarCodeVisible: boolean = true;
  userData: any;
  isLoading: boolean;
  cartItemsLength: any = 0;
  finalVariable: any = 'assets/account.svg';
  temporaryVariable: any = 'assets/account.svg';
  urldata: any;
  whatson: any;
  aboutus: any;
  legal: any;
  getBalance: any;
  userAddress: any;
  photoVariable: any = 'assets/account.svg';

  constructor(
    private alertController: AlertController,
    private authService: AuthService,
    private navCtrl: NavController,
    private toastService: ToastService,
    private global: GlobalService,
    private router: Router,
    private _route: ActivatedRoute,
    private platform: Platform,
    private location: Location,
    private modalController: ModalController,
    private imagePicker: ImagePicker,
    private webview: WebView,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private http: HttpClient
  ) {
    this.platform.ready().then(() => {
      this.platform.backButton.subscribeWithPriority(99999, () => {
        var url = this.router['routerState'].snapshot.url;
        console.log(url);
        if (url == '/account') {
          if (window.confirm('Do you want to exit?')) {
            App.exitApp();
          }
        }
        // this.location.back();
      });
    });
    this._route.params.subscribe((res) => {
      // console.log(res);
      // console.log(this.router.url);
      this.getData();
      this.getAddress();
      this.authService.badgeDataSubject.subscribe((res) => {
        console.log(res, 'heelo');
        console.log(Object.keys(res), 'byee');
        if (res == 0) {
          let data = JSON.parse(localStorage.getItem('cartItems'));
          this.cartItemsLength = data ? data.length : 0;
          console.log(this.cartItemsLength);
        } else {
          this.cartItemsLength = res;
          console.log(this.cartItemsLength);
        }
      });
    });
  }

  // async checkPermission(){
  //   try{
  //     //check or request permission
  //     const status=await BarcodeScanner.checkPermission({force:true});
  //     if(status.granted){
  //       //the user granted permission
  //       return true;
  //     }
  //     return false;

  //   }
  //   catch(e){
  //     console.log(e);
  //   }
  // }

  // async startScan(){
  //   try{
  //     const permission=await this.checkPermission();
  //     if(!permission){
  //       return;
  //     }
  //     await BarcodeScanner.hideBackground();
  //     document.querySelector('body').classList.add('scanner-active');
  //     this.content_visibility='hidden';
  //     const result=await BarcodeScanner.startScan();
  //     console.log(result);
  //     BarcodeScanner.showBackground();
  //     document.querySelector('body').classList.remove('scanner-active');
  //     this.content_visibility='';
  //     if(result?.hasContent){
  //       this.scannedResults=result.content;
  //       console.log(this.scannedResults)
  //     }
  //   }catch(e){
  //     console.log(e);
  //     this.stopScan();
  //   }
  // }

  // stopScan(){
  //   BarcodeScanner.showBackground();
  //   BarcodeScanner.stopScan();
  //   document.querySelector('body').classList.remove('scanner-active');
  //   this.content_visibility='';
  // }

  //  ngOnDestroy(): void {
  //    this.stopScan();
  //  }

  ngOnInit(): void {
    // this.getData();
    // this.getAddress();
    this.loadFiles();
    this.getURL();
  }
  qrbtn() {
    this.zipped = !this.zipped;
    if (this.zipped) {
      this.isBarCodeVisible = false;
    } else {
      this.isBarCodeVisible = true;
    }
  }
  async openWhatson() {
    await Browser.open({
      // url: 'https://thestirlingarms.com.au/whats-on/stirling-specials',
      url: this.whatson,
      // url:'http://demo.orderpoint.net.au/l',
    });
  }
  async openAboutUs() {
    await Browser.open({
      // url: 'https://thestirlingarms.com.au/about-us/about-us',
      url: this.aboutus,
      // url:'http://demo.orderpoint.net.au/about',
    });
  }
  async openLegal() {
    await Browser.open({
      // url: 'https://thestirlingarms.com.au/stay/terms-conditions',
      url: this.legal,
      // url:'http://demo.orderpoint.net.au/w',
    });
  }

  logout() {
    this.images = [];
    this.percentage = this.percentage - 10;
    this.global.showLoader().then(() => {
      this.authService
        .logout()
        .then(() => {
          // this.navCtrl.navigateRoot('/login');
          this.router.navigate(['/login']);
          this.global.hideLoader();
          this.authService.couponSubject.next({});
          localStorage.clear();
        })
        .catch((e) => {
          this.global.hideLoader();
          this.toastService.presentToast(
            'Logout Failed!Check Your Internet Connection'
          );
        });
    });
  }

  getURL() {
    this.authService.getUrl().subscribe({
      next: (data: any) => {
        // console.log(data);
        this.urldata = data.data;
        console.log(this.urldata);
        this.whatson = this.urldata[0].whatson;
        this.aboutus = this.urldata[0].about;
        this.legal = this.urldata[0].ltc;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getData() {
    this.getBalanceData();
    this.global.showLoader('Loading Data');
    this.authService.getProfile().subscribe({
      next: (data: any) => {
        console.log(data);
        this.userData = data.data;
        this.percentage = this.calculateProfilePer(this.userData);
        // console.log(this.photoVariable, 'dhruv');
        if (this.photoVariable != 'assets/account.svg') {
          this.percentage = this.percentage + 10;
        }
        console.log(this.percentage);
        this.global.hideLoader();
        // this.photoVariable=data.data.imageUrl;
        // if(this.photoVariable===null){
        //   this.photoVariable=this.temporaryVariable
        // }
        // console.log(this.photoVariable);

        console.log(this.userData);
        localStorage.setItem('userNo', JSON.stringify(this.userData.mobileNo));
        this.qrCodeString =
          'M' +
          this.userData.mobileNo
            .split('')
            .splice(3, 13)
            .toString()
            .replaceAll(',', '');
      },
      error: (err) => {
        this.global.hideLoader();
        this.toastService.presentToast(err);
      },
    });
  }
  getBalanceData() {
    this.authService.getBalance().subscribe({
      next: (data: any) => {
        this.getBalance = data.data;
        console.log(this.getBalance);
      },
      error: (err) => {
        this.global.hideLoader();
        console.log(err);
      },
    });
  }
  editProfile(userData) {
    this.userData.mobileNo = this.userData.mobileNo
      .split('')
      .splice(3, 13)
      .toString()
      .replaceAll(',', '');
    console.log(this.userData.mobileNo);
    this.authService.accountSubject.next(this.userData);
    this.router.navigate(['/profile']);
  }
  openContactUs(userData) {
    this.userData.mobileNo = this.userData.mobileNo
      .split('')
      .splice(3, 13)
      .toString()
      .replaceAll(',', '');
    console.log(this.userData.mobileNo);
    this.authService.accountSubject.next(this.userData);
    this.router.navigate(['/contactus']);
  }
  openAccountPrivacy() {
    this.router.navigate(['/accountprivacy']);
  }
  // openImagePicker(){
  //   this.imagePicker.hasReadPermission().then(res=>{
  //     console.log('permission status = ',res);
  //     if(res ==false){
  //       this.imagePicker.requestReadPermission().then(res1=>{
  //         console.log('requested permission status =',res1);
  //       })
  //     }
  //     else{
  //       let options:ImagePickerOptions={
  //         maximumImagesCount:1,
  //         quality: 32,
  //         outputType: 1,
  //         width: 220,
  //       }
  //       this.imagePicker.getPictures(options).then(result=>{
  //         console.log('selected photos =',result[0])

  //         if(result!=null){
  //           // this.finalVariable=Capacitor.convertFileSrc(result);
  //           // console.log(this.finalVariable);
  //          this.finalVariable=this.webview.convertFileSrc('data:image/jpeg;base64,'+result[0]);
  //          console.log(this.finalVariable);
  //          let obj={
  //           imageurl:this.finalVariable
  //          }
  //          this.authService.setProfilePhoto(obj).subscribe({
  //           next:(data)=>{
  //            console.log(data);
  //           },
  //           error:(err)=>{
  //            console.log(err);
  //           }
  //          })
  //          localStorage.setItem('finalVariable',JSON.stringify(this.finalVariable));
  //         console.log(this.finalVariable);
  //         }
  //         else{
  //           console.log('result is empty');
  //         }
  //       })
  //     }
  //   })

  // }

  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
    });
    if (image) {
      this.saveImage(image);
    }
  }

  async saveImage(photo: Photo) {
    const base64Data = await this.readAsBase64(photo);
    // console.log(base64Data);
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      directory: Directory.Data,
      path: `${IMAGE_DIR}/${fileName}`,
      data: base64Data,
    });
    console.log('saved: ', savedFile);
    this.loadFiles();
  }
  async readAsBase64(photo: Photo) {
    if (this.platform.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path,
      });
      return file.data;
    } else {
      const response = await fetch(photo.webPath);
      const blob = await response.blob();
      return (await this.convertBlobToBase64(blob)) as string;
    }
  }
  convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

  async loadFiles() {
    this.images = [];
    const loading = await this.loadingCtrl.create({
      message: 'Loading data ...',
    });
    await loading.present();

    Filesystem.readdir({
      directory: Directory.Data,
      path: IMAGE_DIR,
    })
      .then(
        (result) => {
          console.log('HERE: ', result?.files[result.files.length - 1]);
          this.loadFileData(result.files[result.files.length - 1]);
        },
        async (err) => {
          console.log('err: ', err);
          await Filesystem.mkdir({
            directory: Directory.Data,
            path: IMAGE_DIR,
          });
        }
      )
      .then((_) => {
        loading.dismiss();
      });
  }

  async loadFileData(f) {
    // for (let f of fileNames){
    //console.log(f,'dhruv');
    const filePath = `${IMAGE_DIR}/${f.name}`;
    const readFile = await Filesystem.readFile({
      directory: Directory.Data,
      path: filePath,
    });
    //console.log('Read: ',readFile);
    this.images = [];
    this.images.push({
      name: f,
      path: filePath,
      data: `data:image/jpeg;base64,${readFile.data}`,
    });
    console.log(this.images);
    this.photoVariable = this.images[this.images.length - 1].data;
    if (this.userData?.percentage) {
      this.userData.percentage = this.userData?.percentage + 10;
    }
    if (this.percentage !== 100) {
      this.percentage = this.percentage + 10;
    }

    console.log(this.photoVariable);
    // }
    // this.startUpload(fileNames[fileNames.length-1]);
  }

  async startUpload(file: LocalFile) {
    const response = await fetch(file.data);
    const blob = await response.blob();
    const formData = new FormData();
    formData.append('imageurl', blob, file.name);
    // this.uploadData(formData);
  }
  async uploadData(formData: FormData) {
    const loading = await this.loadingCtrl.create({
      message: 'Uploading image...',
    });
    await loading.present();

    // Use your own API!
    const url = 'https://barter-tech.antino.ca/api/profilePic';

    this.http
      .post(url, formData)
      .pipe(
        finalize(() => {
          loading.dismiss();
        })
      )
      .subscribe((res) => {
        if (res['success']) {
          this.presentToast('File upload complete.');
        } else {
          this.presentToast('File upload failed.');
        }
      });
  }
  async presentToast(text) {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 3000,
    });
    toast.present();
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      message: 'Please Add Adress first before adding items to cart',
      buttons: ['OK'],
    });
    setTimeout(() => {
      this.router.navigate(['/addaddress']);
    }, 3000);

    await alert.present();
  }
  getAddress() {
    this.authService.getAddress().subscribe({
      next: (data: any) => {
        console.log(data);
        this.userAddress = data.status;
        if (data.status == false) {
          this.cartItemsLength = 0;

          this.presentAlert();
        }
        this.global.hideLoader();
      },
      error: (err) => {
        this.global.hideLoader();
        this.toastService.presentToast(err);
      },
    });
  }
  calculateProfilePer(object) {
    let profilePer = 50;
    let skipKey = [
      'lastName',
      'name',
      'anniversary_date',
      'gender',
      'imageUrl',
      'month',
    ];
    Object.keys(object).forEach((item) => {
      if (!skipKey.includes(item)) {
        profilePer = profilePer + 10;
      }
    });
    return profilePer;
  }
}
