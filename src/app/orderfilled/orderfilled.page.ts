import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RatePage } from '../rate/rate.page';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { GlobalService } from '../services/global.service';
import { ToastService } from '../services/toast.service';
@Component({
  selector: 'app-orderfilled',
  templateUrl: './orderfilled.page.html',
  styleUrls: ['./orderfilled.page.scss'],
})
export class OrderfilledPage implements OnInit {
  id: string = '';
  orderNo: string = '';
  finalMoney: any;
  finalPrice: any;
  userOrderDetails: any;
  additionalPrice: any;
  // menu: any[] = [
  //   {
  //     menuitem_name: 'Hara bhara Kabab(6 Pieces)',
  //     Quantity: '1.0000',
  //     default_Price: '15.9500',
  //   },
  //   {
  //     menuitem_name: 'Hara bhara Kabab(6 Pieces)',
  //     Quantity: '2.0000',
  //     default_Price: '15.9500',
  //   },
  //   {
  //     menuitem_name: 'Hara bhara Kabab(6 Pieces)',
  //     Quantity: '3.0000',
  //     default_Price: '15.9500',
  //   },
  //   {
  //     menuitem_name: 'Hara bhara Kabab(6 Pieces)',
  //     Quantity: '4.0000',
  //     default_Price: '15.9500',
  //   },
  // ];
  constructor(
    private modalController: ModalController,
    private readonly _activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private global: GlobalService,
    private toastService: ToastService
  ) {
    this._activatedRoute.params.subscribe((res) => {
      // console.log(res);
      // console.log(this.router.url);
    });
  }

  ngOnInit() {
    this._activatedRoute.paramMap.subscribe((params) => {
      this.id = params.get('id');
      this.orderNo = params.get('orderNo');
      console.log(this.id);
      console.log(this.orderNo);
      this.getOrderedData();
    });
  }
  // var id = document.getElementById('modal');
  // id.style.display = 'flex';
  async presentAlert() {
    const modal = await this.modalController.create({
      component: RatePage,
      cssClass: 'dialog-modal',
    });
    return await modal.present();
  }

  getOrderedData() {
    this.global.showLoader('Loading Data');
    this.authService.getOrderDetails(this.id).subscribe({
      next: (data: any) => {
        if (data.status) {
          this.userOrderDetails = data.data.order_details;
          this.itemTotal(
            this.userOrderDetails.menu.OrderData,
            this.userOrderDetails?.orders.taxAmount,
            this.userOrderDetails?.orders.deliveryCharge
          );
          this.global.hideLoader();
          console.log(this.userOrderDetails);
          console.log(this.userOrderDetails.menu.length);
        } else {
          this.global.hideLoader();
        }
      },
      error: (err) => {
        this.global.hideLoader();
        this.toastService.presentToast(err);
      },
    });
  }

  itemTotal(menu, taxAmount, delivery) {
    this.finalPrice = 0;
    menu.map((x) => {
      console.log('itemss', x);
      let calculatedPrice = x.Quantity * x.default_Price;
      this.additionalPrice = 0;
      x.menuOptions.map((y) => {
        this.additionalPrice = this.additionalPrice + Number(y.AdditionalCost);
      });
      this.finalPrice =
        this.finalPrice +
        calculatedPrice +
        this.additionalPrice +
        Number(taxAmount);
    });
    console.log(this.finalPrice);
    this.finalMoney = this.finalPrice + Number(delivery);
    console.log(this.finalMoney);
  }

  emailInvoice() {
    this.global.showLoader('Sending Invoice');
    let obj = {
      order_id: this.id,
      grand_total: this.finalMoney,
      total_item: this.userOrderDetails.menu.length,
      item_total: this.finalPrice,
    };
    console.log(obj);
    this.authService.sendEmailInvoice(obj).subscribe({
      next: (data: any) => {
        if (data.status) {
          this.global.hideLoader();
          this.toastService.presentToast('Invoice has been sent successfully');
        } else {
          this.global.hideLoader();
        }
      },
      error: (err) => {
        this.global.hideLoader();
        console.log(err);
      },
    });
  }
}
