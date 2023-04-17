import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { GlobalService } from '../services/global.service';
import { PreorderPage } from '../preorder/preorder.page';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-maindelivery',
  templateUrl: './maindelivery.page.html',
  styleUrls: ['./maindelivery.page.scss'],
})
export class MaindeliveryPage implements OnInit {
  currentRoute: any;
  cartItemsLength: any = 0;
  public slideOps = {
    // pager : true,
    // initialSlide: 0,
    // speed : 400,
    // spaceBetween: 100,
    // nested: true,
    // effect: 'flip',
    // slidesPerView: 3,
    // autoplay:true,
    // loop:true

    loop: true,
    effect: 'slide',
    freeMode: true,
    freeModeSticky: false,
    slidesPerView: 3,
    spaceBetween: 1,
    autoplay: true,
    speed: 400,
    pager: true,
    initialSlide: 0,
    nested: true,
  };

  isSelected = true;

  public segment = 'salad';
  public arr = new Array(4);

  constructor(
    private authservice: AuthService,
    private alertController: AlertController,
    private modalController: ModalController,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private global: GlobalService
  ) {}

  ngOnInit() {
    this._activatedRoute.params.subscribe((res) => {
      console.log(res);
      this.authservice.badgeDataSubject.subscribe((res) => {
        console.log(res, 'heelo');
        //  console.log(Object.keys(res),"byee");
        if (res == 0) {
          let data = JSON.parse(localStorage.getItem('cartItems'));
          console.log(data);
          if (data?.length > 0) {
            let itemCount = 0;
            data.forEach((element) => {
              itemCount = itemCount + element.product_quantity;
              console.log(itemCount);
              return itemCount;
            });
            this.cartItemsLength = itemCount;
          } else {
            this.cartItemsLength = 0;
            console.log(this.cartItemsLength);
          }
        } else {
          this.cartItemsLength = res;
          console.log(this.cartItemsLength);
        }
      });
      // this.currentRoute = this.route.snapshot['_routerState'].url.split('/')[2];
      // console.log(this.currentRoute, 'lkjhgfxz');
      // let staticRoute = localStorage.getItem('currentRoute');
      // if (staticRoute && staticRoute != this.currentRoute) {
      //   localStorage.setItem('cartItems', JSON.stringify([]));
      //   this.authService.badgeDataSubject.next(0);
      // }
      // this.listProductCategories();
      // if (JSON.parse(localStorage.getItem('cartItems'))) {
      //   this.selectedProducts = JSON.parse(localStorage.getItem('cartItems'));
      // }
    });
    //this.cartItemsLength= !!localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem("cartItems")).length : 0

    // console.log(this.cartItemsLength,"length");
  }
  //   ionViewWillEnter(){
  //     // this.myDefaultMethodToFetchData();
  //     this._activatedRoute.params.subscribe((res) => {
  //       console.log(res);
  //       // this.currentRoute = this._activatedRoute.snapshot['_routerState'].url.split('/')[2];

  //     });
  // }

  // refreshPage() {
  // this.ionViewWillEnter();
  // }

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }
  changeRoute(tab) {
    this._router.navigate(['/maindelivery/' + tab]);
  }

  updateMyDate($event) {
    // const day: number = $event.detail.value.day.value;
    // const month: number = $event.detail.value.month.value;
    // const year: number = $event.detail.value.year.value;
    console.log($event); // --> wil contains $event.day, $event.month and $event.year
    //   console.log(day);
    //   console.log(month);
    //   console.log(year);
  }

  async presentAlert() {
    const modal = await this.modalController.create({
      component: PreorderPage,
      cssClass: 'dialog-preorder',
    });
    modal.onDidDismiss().then((data) => {
      console.log(data, '--------------');
      if (data.data != undefined) {
        this._router.navigate(['/maindelivery/' + data?.data]);
      }
    });
    //  let currentRoute = this._activatedRoute.snapshot['_routerState'].url.split('/')[2];
    //  console.log(currentRoute,"------------");
    return await modal.present();
  }

  // commonmethod(currentdataRoute){
  // this.authservice.routeSubject.next(currentdataRoute);
  // }

  changeTk() {
    this.global.showLoader('Loading Data');
    const changePop = document.getElementById('popup');
    changePop.style.display = 'none';
    window.location.reload();
    this.global.hideLoader();
    window.location.href = '/maindelivery/takeaway';
  }

  changeDn() {
    this.global.showLoader('Loading Data');
    const changePop = document.getElementById('popup');
    changePop.style.display = 'none';
    window.location.reload();
    this.global.hideLoader();
    window.location.href = '/maindelivery/dinein';
  }

  changeDl() {
    this.global.showLoader('Loading Data');
    const changePop = document.getElementById('popup');
    changePop.style.display = 'none';
    window.location.reload();
    this.global.hideLoader();
    window.location.href = '/maindelivery/delivery';
  }
}
