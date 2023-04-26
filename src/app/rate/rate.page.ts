import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.page.html',
  styleUrls: ['./rate.page.scss'],
})
export class RatePage implements OnInit {
  foodStar: any;
  deliveryStar: any;
  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private global: GlobalService
  ) {}

  ngOnInit() {}

  onFoodRatingSelect(data: any) {
    this.foodStar = data;
    console.log(this.foodStar);
  }

  onDeliveryRatingSelect(data: any) {
    this.deliveryStar = data;
    console.log(this.deliveryStar);
  }

  async closeModal() {
    let data = {
      merchantId: 45,
      food_rating: this.foodStar,
      delivery_rating: this.deliveryStar,
    };
    this.global.showLoader(' Saving Data');
    this.authService.insertReview(data).subscribe({
      next: (data) => {
        this.global.hideLoader();
        this.router.navigate(['/account']);
        this.toastService.presentToast('Review Updated Successfilly');
      },
      error: (err) => {
        this.global.hideLoader();
        this.toastService.presentToast(err);
      },
    });
    const onClosedData: string = 'Wrapped Up!';
    await this.modalController.dismiss(onClosedData);
  }
  async crossButton() {
    const onClosedData: string = 'Wrapped Up!';
    await this.modalController.dismiss(onClosedData);
  }
}
