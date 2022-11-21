import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Browser } from '@capacitor/browser';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { GlobalService } from '../services/global.service';
import { ToastService } from '../services/toast.service';
@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AccountPage implements OnInit {
  value = 62;
  accent = "#808080";
  qrCodeString = 'This is a secret qr code message';
  // scannedResults:any;
  // content_visibility='hidden';
  zipped: boolean = true;
  isBarCodeVisible: boolean = false;

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private toastService: ToastService,
    private global: GlobalService
  ) {}

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
  ngOnInit(): void {}
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
      url: 'https://thestirlingarms.com.au/whats-on/stirling-specials',
    });
  }
  async openAboutUs() {
    await Browser.open({
      url: 'https://thestirlingarms.com.au/about-us/about-us',
    });
  }
  async openLegal() {
    await Browser.open({
      url: 'https://thestirlingarms.com.au/stay/terms-conditions',
    });
  }

  logout() {
    this.global.showLoader();
    this.authService
      .logout()
      .then(() => {
        this.navCtrl.navigateRoot('/login');
        this.global.hideLoader();
      })
      .catch((e) => {
        this.global.hideLoader();
        this.toastService.presentToast(
          'Logout Failed!Check Your Internet Connection'
        );
      });
  }
}
