import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { GlobalService } from 'src/app/services/global.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-accountprivacy',
  templateUrl: './accountprivacy.page.html',
  styleUrls: ['./accountprivacy.page.scss'],
})
export class AccountprivacyPage implements OnInit {
  constructor(
    private alertCtrl: AlertController,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private global: GlobalService
  ) {}

  ngOnInit() {}
  async presentAlert() {
    const alert = await this.alertCtrl.create({
      message: 'Are you sure you want to permanently delete this account?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
        {
          text: 'Yes',
          role: 'confirm',
          handler: () => {
            this.global.showLoader('Deleting Account');
            let obj = {
              email: JSON.parse(localStorage.getItem('userDetails')).email,
            };
            this.authService.accountDelete(obj).subscribe({
              next: (data: any) => {
                console.log(data);
                this.global.hideLoader();
                this.toastService.presentToast('Account Deleted Successfully');
                localStorage.clear();
                this.router.navigate(['/login']);
                this.authService.couponSubject.next({});
                this.authService.pointSubject.next({});
              },
              error: (err) => {
                this.global.hideLoader();
                this.toastService.presentToast(err);
              },
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
