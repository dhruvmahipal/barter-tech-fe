import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
  SwiperOptions,
  Thumbs,
} from 'swiper';
import { IonicSlides, IonSlides } from '@ionic/angular';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController } from '@ionic/angular';
import { element } from 'protractor';
import { IonModal } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast.service';

// install Swiper modules
SwiperCore.use([
  Autoplay,
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  IonicSlides,
]);

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.page.html',
  styleUrls: ['./delivery.page.scss'],
})
export class DeliveryPage implements OnInit, OnDestroy {
  @ViewChild('slides', { static: true }) slider: IonSlides;
  @ViewChild(IonModal) modal: IonModal;
  productCategories: ProductCategory[];
  products: Product[] = [];
  currentCategoryId!: number;
  menuItems: any[] = [];
  currentItem: any;
  selected: any;
  isModalOpen: boolean = false;
  imageUrl: any;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  product_quantity = 0;
  selectedProducts: any = [];
  currentRoute: any;
  quantity: number = 1;
  routercurrent: any;
  list = [];
  list2 = [];
  newSize: any;
  groupName: any;
  groupName1: any;
  groupName2: any;
  category: any;
  item: [];
  newValue: any;
  newValue1: any;
  newValue2: any;
  maxselect: any;
  maxselect1: any;
  maxselect2: any;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  tempItem: any = {
    selectedItems: [],
    IsSizeApplicable: '0',
    IsoptionApplicable: '0',
    product_quantity: 0,
    options: { size: [] },
  };
  tempArray: any = [];
  selectedSize: any;
  isCartValid = true;
  bannerImages: any;
  staticImage: any;
  categoryName: any;
  displayValue: any;
  displayOptionValue: any;

  // public slideOps = {
  //   loop: true,
  //   effect: 'slide',
  //   freeMode: true,
  //   freeModeSticky: false,
  //   slidesPerView: 3,
  //   spaceBetween: 1,
  //   autoplay: true,
  //   speed: 400,
  //   pager: true,
  //   initialSlide: 0,
  //   nested: true,
  // };

  config: SwiperOptions = {
    // loop: true,
    // effect: 'slide',const
    // freeMode: true,
    // slidesPerView: 3,
    // spaceBetween: 1,
    // autoplay: {
    //   delay: 2500,
    //   disableOnInteraction: false,
    // },
    // speed: 400,
    // initialSlide: 0,
    // nested: true,
    // centeredSlides: true,

    slidesPerView: 3,
    autoplay: {
      delay: 2500,
    },
    loop: true,
    speed: 400,
  };
  segment = 0;
  dummyRoute: any;
  handlerMessage: string;
  singleProduct: any;

  constructor(
    public router: Router,
    private productService: ProductService,
    private route: ActivatedRoute,
    private global: GlobalService,
    private authService: AuthService,
    private alertController: AlertController,
    private toastService: ToastService
  ) {
    this.currentRoute = this.route.snapshot['_routerState'].url.split('/')[2];
    this.route.params.subscribe((res) => {
      localStorage.setItem('currentRoute', this.currentRoute);
    });
    let staticRoute = localStorage.getItem('currentRoute');
    this.routercurrent = staticRoute;
    if (staticRoute && staticRoute != this.currentRoute) {
      localStorage.setItem('cartItems', JSON.stringify([]));
      this.authService.badgeDataSubject.next(0);
      localStorage.setItem('currentRoute', this.currentRoute);
    }
  }
  ngOnDestroy(): void {
    // document.getElementById('popup').remove();
  }

  ngOnInit() {
    localStorage.setItem('currentRoute', this.currentRoute);
    this.route.params.subscribe((res) => {
      this.currentRoute = this.route.snapshot['_routerState'].url.split('/')[2];
      console.log(this.currentRoute, 'lkjhgfxz');
      let staticRoute = localStorage.getItem('currentRoute');
      this.routercurrent = localStorage.getItem('currentRoute');
      if (staticRoute && staticRoute != this.currentRoute) {
        localStorage.setItem('cartItems', JSON.stringify([]));
        this.authService.badgeDataSubject.next(0);
        localStorage.setItem('currentRoute', this.currentRoute);
      }
      this.global.showLoader('Loading Data');
      this.listProductCategories();
      if (JSON.parse(localStorage.getItem('cartItems'))) {
        this.selectedProducts = JSON.parse(localStorage.getItem('cartItems'));
      }
      // this.notShow();
      // let pop = document.getElementsByClassName('pppp')
      // console.log(pop)
      // if(pop.length > 1){
      // }
    });
    // this.authService.routeSubject.pipe(first()).subscribe(res=>{
    //   console.log(res);
    // })
    // setTimeout(this.getTime(), 60000);
  }

  //   ngDoCheck() {
  //     this.authService.routeSubject.pipe(first()).subscribe(res=>{
  //       console.log(res);
  //     })
  // }

  getTime() {
    // let getLocalStorageOrderTime = localStorage.getItem('latestOrder');
    console.log('1 minute over');
    return 'ok';
    // return JSON.parse(getLocalStorageOrderTime);
  }

  listProductCategories() {
    this.getBannerImages();
    this.productService.getProductCategories().subscribe(
      (data) => {
        // console.log('dhruvvvvvv', data);
        this.productCategories = data?.data[0]?.menueGroup;
        this.currentCategoryId = data?.data[0]?.menueGroup[0]?.menuGroupId;
        this.selected = data?.data[0]?.menueGroup[0]?.groupName;
        this.getDataBymenuGroupId(this.currentCategoryId, this.selected);
        this.global.hideLoader();
        // console.log(this.productCategories,"API DATA");
      },
      (err) => {
        this.global.hideLoader();
      }
    );
  }

  // i = 1;
  // plus() {
  //   this.i++;
  //   this.quantity = this.i;
  // }
  // minus() {
  //   if (this.i != 1) {
  //     this.i--;
  //     this.quantity = this.i;
  //   }
  // }

  // eslint-disable-next-line @typescript-eslint/member-ordering

  subQty(product, index) {
    // console.log(product, 'products in subqty');
    let removeItems = [];
    let remainingItems = [];
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
    localStorage.setItem('cartItems', JSON.stringify(latestCartItems));
    let productLength = 0;
    latestCartItems.forEach((element) => {
      productLength += element.product_quantity;
    });
    this.authService.badgeDataSubject.next(productLength);
    console.log(latestCartItems, '-----latestCartItems');
  }

  addQty(product, index) {
    const tempTotalMenuItem = localStorage.getItem('cartItems');
    const totalMenuItem = JSON.parse(tempTotalMenuItem);
    // eslint-disable-next-line @typescript-eslint/no-shadow
    totalMenuItem.map((element) => {
      if (element.menuItemId === product.menuItemId) {
        element.product_quantity = element.product_quantity + 1;
      }
    });
    localStorage.removeItem('cartItems');
    localStorage.setItem('cartItems', JSON.stringify(totalMenuItem));
    return (product.product_quantity = product.product_quantity + 1);
  }

  add(product) {
    product.product_quantity = product.product_quantity + 1;

    this.selectedProducts.push(product);
    console.log('selected prods', this.selectedProducts);
    this.authService.badgeDataSubject.next(this.selectedProducts.length);
    localStorage.setItem('cartItems', JSON.stringify(this.selectedProducts));
  }

  openpop(product, item?) {
    product.optionGroups[0]?.optionItems.map((x) => {
      x.selected = false;
    });
    product.optionGroups[1]?.optionItems.map((y) => {
      y.selected = false;
    });
    product.optionGroups[2]?.optionItems.map((z) => {
      z.selected = false;
    });
    // document.getElementById("newpop").onreset();
    console.log(
      'this.menuItems',
      product,
      '-----this.menuItems',
      this.tempItem
    );
    if (product.optionGroups.length > 0 || product.size.length > 1) {
      this.tempItem = {};
      this.singleProduct = product;
      const pop = document.getElementById('popup');
      pop.style.display = 'block';
      this.newValue = product.optionGroups[0]?.optionItems;
      this.groupName = product.optionGroups[0]?.optionGroupName;
      this.newSize = product.size[0]?.size_deliveryPrice;
      this.groupName1 = product.optionGroups[1]?.optionGroupName;
      this.groupName2 = product.optionGroups[2]?.optionGroupName;
      this.maxselect = product.optionGroups[0]?.max_item_selection_allow;
      this.maxselect1 = product.optionGroups[1]?.max_item_selection_allow;
      this.maxselect2 = product.optionGroups[2]?.max_item_selection_allow;
      console.log(this.groupName1);
      this.newValue1 = product.optionGroups[1]?.optionItems;
      this.newValue2 = product.optionGroups[2]?.optionItems;
      if (this.newValue) {
        this.newValue.map((x) => {
          if (this.currentRoute == 'delivery') {
            x.displayValue = x.deliveryPrice;
          } else if (this.currentRoute == 'takeaway') {
            x.displayValue = x.takeawayPrice;
          } else if (this.currentRoute == 'dinein') {
            x.displayValue = x.dineinPrice;
          }
        });
      }
      if (this.newValue1) {
        this.newValue1.map((x) => {
          if (this.currentRoute == 'delivery') {
            x.displayOptionValue = x.deliveryPrice;
          } else if (this.currentRoute == 'takeaway') {
            x.displayOptionValue = x.takeawayPrice;
          } else if (this.currentRoute == 'dinein') {
            x.displayOptionValue = x.dineinPrice;
          }
        });
      }
      if (this.newValue2) {
        this.newValue2.map((x) => {
          if (this.currentRoute == 'delivery') {
            x.displayOptionValue = x.deliveryPrice;
          } else if (this.currentRoute == 'takeaway') {
            x.displayOptionValue = x.takeawayPrice;
          } else if (this.currentRoute == 'dinein') {
            x.displayOptionValue = x.dineinPrice;
          }
        });
      }
      if (product.size.length >= 1) {
        console.log(product);
        product.size.map((x: any) => {
          if (this.currentRoute == 'delivery') {
            x.displaySizeValue = x?.size_deliveryPrice;
          } else if (this.currentRoute == 'takeaway') {
            x.displaySizeValue = x?.size_takeawayPrice;
          } else if (this.currentRoute == 'dinein') {
            x.displaySizeValue = x?.size_dineInPrice;
          }
        });
      }

      console.log(this.newValue, 'lol');
      console.log(this.newValue1, 'hibro');
      console.log(this.newValue2, '--dhruv');
      this.tempItem = item;
      this.tempArray = JSON.parse(localStorage.getItem('cartItems'))
        ? JSON.parse(localStorage.getItem('cartItems'))
        : [];
      console.log(this.tempArray);
    } else {
      this.tempItem = {};
      this.singleProduct = product;

      this.tempItem = item;
      this.tempArray = JSON.parse(localStorage.getItem('cartItems'))
        ? JSON.parse(localStorage.getItem('cartItems'))
        : [];
      this.addToCart();
      //     let tempTotalMenuItem = localStorage.getItem('cartItems');
      //   let totalMenuItem = JSON.parse(tempTotalMenuItem);

      //   // eslint-disable-next-line @typescript-eslint/no-shadow
      //   if(totalMenuItem && totalMenuItem.length>0){
      //   totalMenuItem.map((element,index)=> {
      //     if (element.menuItemId === item.menuItemId) {
      //       element.product_quantity = element.product_quantity + 1;
      //       this.authService.badgeDataSubject.next(element.product_quantity);
      //     }
      //     else {
      //       item.product_quantity = item.product_quantity + 1;
      //       totalMenuItem.push(item);
      //       let currentCartItems = JSON.parse(localStorage.getItem('cartItems'));
      //     let productLength = 0;
      //     currentCartItems.forEach(element => {
      //       productLength += element.product_quantity;
      //     });
      //     this.authService.badgeDataSubject.next(productLength+1);
      //     }
      //   });
      // }
      // else{
      //   totalMenuItem=[];
      //   item.product_quantity = item.product_quantity + 1;
      //   totalMenuItem.push(item);
      //   this.authService.badgeDataSubject.next(totalMenuItem.length);
      // }

      //   localStorage.setItem('cartItems',JSON.stringify(totalMenuItem));
      //   return product.product_quantity = product.product_quantity + 1;
    }
  }

  onItemSelect(event, name, target) {
    console.log({
      event,
    });

    // console.log(name, {
    //   one: this.maxselect,
    //   two: this.maxselect1,
    //   three: this.maxselect2,
    // });
    if (name == 'first' && typeof this.maxselect == 'number') {
      if (!target.srcElement.checked) {
        this.maxselect++;
        console.log({ name, one: this.maxselect });
      } else if (this.maxselect == 0) {
        this.toastService.presentToast('You cant select more items');

        target.srcElement.checked = false;
        event.selected = false;
      }
    } else if (name == 'second' && typeof this.maxselect1 == 'number') {
      if (!target.srcElement.checked) {
        this.maxselect1++;
      } else if (this.maxselect1 == 0) {
        this.toastService.presentToast('You cant select more items');
        target.srcElement.checked = false;
        event.selected = false;
      }
    } else if (name == 'third' && typeof this.maxselect2 == 'number') {
      if (!target.srcElement.checked) {
        console.log('inc ');
        this.maxselect2++;

        console.log(this.maxselect2);
      } else if (this.maxselect2 == 0) {
        this.toastService.presentToast('You cant select more items');
        target.srcElement.checked = false;
        event.selected = false;
      }
    }
    console.log(this.tempItem.IsSizeApplicable, '------------');

    if (name == 'first' && this.maxselect > 0 && target.srcElement.checked) {
      this.maxselect--;
      console.log({ name, one: this.maxselect });
    } else if (
      name == 'second' &&
      this.maxselect1 > 0 &&
      target.srcElement.checked
    ) {
      this.maxselect1--;
    } else if (
      name == 'third' &&
      this.maxselect2 > 0 &&
      target.srcElement.checked
    ) {
      this.maxselect2--;
    }
    if (event?.selected === true) {
      this.selectedProducts.push(event);
    } else {
      const newArray = this.selectedProducts.filter(
        (el) => el?.selected !== event?.selected
      );
      this.selectedProducts = newArray;
    }
    console.log(this.selectedProducts);
    console.log(this.tempItem.isOptionMandatory, '-----man');

    if (
      this.tempItem.isOptionMandatory &&
      this.tempItem.IsSizeApplicable === '1' &&
      this.tempItem.IsoptionApplicable === '1'
    ) {
      let a = this.newValue?.find((el) => el.selected === true);
      let b = this.newValue1?.find((el) => el.selected === true);
      let c = this.newValue2?.find((el) => el.selected == true);
      console.log({ a, b, c }, '----');
      if (a && b && c && this.selectedSize) {
        console.log('going');
        this.isCartValid = false;
      } else if (a && b && this.selectedSize) {
        if (!!this.newValue2?.length) {
          this.isCartValid = true;
        } else {
          this.isCartValid = false;
        }
      } else if (
        a &&
        this.selectedSize &&
        this.newValue1?.length === undefined
      ) {
        this.isCartValid = false;
      } else if (
        b &&
        this.selectedSize &&
        this.newValue?.length === undefined
      ) {
        this.isCartValid = false;
      } else if (
        a &&
        this.selectedSize &&
        this.newValue1?.length === undefined &&
        this.newValue2?.length === undefined
      ) {
        this.isCartValid = false;
      } else if (
        b &&
        this.selectedSize &&
        this.newValue?.length === undefined &&
        this.newValue2?.length === undefined
      ) {
        this.isCartValid = false;
      } else if (
        c &&
        this.selectedSize &&
        this.newValue?.length === undefined &&
        this.newValue1?.length === undefined
      ) {
        this.isCartValid = false;
      } else {
        this.isCartValid = true;
      }
    } else if (this.tempItem.IsSizeApplicable === '0') {
      console.log(this.tempItem.IsSizeApplicable, '------------');
      let a = this.newValue?.find((el) => el.selected === true);
      console.log({ a });
      let b = this.newValue1?.find((el) => el.selected === true);
      let c = this.newValue2?.find((el) => el.selected === true);
      if (a && b && c && this.newValue && this.newValue1 && this.newValue2) {
        this.isCartValid = false;
      } else if (
        this.newValue &&
        a &&
        this.newValue1?.length === undefined &&
        this.newValue2?.length == undefined
      ) {
        this.isCartValid = false;
      } else if (
        this.newValue1 &&
        b &&
        this.newValue?.length === undefined &&
        this.newValue2?.length === undefined
      ) {
        this.isCartValid = false;
      } else if (
        this.newValue2 &&
        c &&
        this.newValue?.length === undefined &&
        this.newValue1?.length === undefined
      ) {
        this.isCartValid = false;
      } else if (a && b && this.newValue && this.newValue1 && !this.newValue2) {
        this.isCartValid = false;
      } else if (b && c && this.newValue1 && this.newValue2 && !this.newValue) {
        this.isCartValid = false;
      } else if (c && a && this.newValue && this.newValue2 && !this.newValue1) {
        this.isCartValid = false;
      } else {
        this.isCartValid = true;
      }
    } else if (this.tempItem.IsoptionApplicable === '0') {
      if (this.selectedSize) {
        this.isCartValid = false;
      } else {
        this.isCartValid = true;
      }
    }
  }

  addToCart() {
    this.isCartValid = true;
    this.tempItem.product_quantity = 1;
    this.singleProduct.product_quantity =
      this.singleProduct?.product_quantity + 1;
    console.log('add to cart', this.tempItem);
    this.singleProduct.options = this.singleProduct.product;
    this.category = this.singleProduct.product;
    this.authService.badgeDataSubject.next(this.menuItems.length);
    // this.tempItem.selectedItems = this.selectedProducts;
    console.log({ addToCartBefore: this.tempItem?.options?.size });
    let oldTempItem = JSON.parse(JSON.stringify(this.tempItem));
    // this.tempItem.options.size = [];
    // this.tempItem.options.size.push(this.selectedSize);
    oldTempItem.options.size = [];
    oldTempItem.options.size.push(this.selectedSize);
    console.log({ addToCartAfter: this.tempItem?.options?.size });
    this.tempArray.push(oldTempItem);

    localStorage.setItem('cartItems', JSON.stringify(this.tempArray));
    const notShow = document.getElementById('popup');
    notShow.style.display = 'none';
    const currentCartItems = JSON.parse(localStorage.getItem('cartItems'));
    let productLength = 0;
    currentCartItems.forEach((element) => {
      productLength += element.product_quantity;
    });
    this.authService.badgeDataSubject.next(productLength);
    this.menuItems.map((x) => {
      x.product_quantity = 0;
      this.tempArray = JSON.parse(localStorage.getItem('cartItems'));
      if (this.tempArray && this.tempArray.length > 0) {
        this.tempArray.map((y: any) => {
          if (x.menuItemId == y.menuItemId) {
            x.product_quantity = x.product_quantity + y.product_quantity;
          }
        });
      } else {
        this.tempArray = [];
      }
    });
    // localStorage.setItem('cartItems',JSON.stringify(this.menuItems));
    console.log(this.menuItems, '-----');

    this.selectedProducts = [];
    this.selectedSize = null;
  }

  notShow() {
    this.isCartValid = true;
    const notShow = document.getElementById('popup');
    notShow.style.display = 'none';
    if (this.newValue && this.newValue.length > 0) {
      this.newValue.map((x) => {
        x.selected = false;
      });
    }
    if (this.newValue1 && this.newValue1.length > 0) {
      this.newValue1.map((x) => {
        x.selected = false;
      });
    }
    if (this.newValue2 && this.newValue2.length > 0) {
      this.newValue2.map((x) => {
        x.selected = false;
      });
    }
    this.selectedSize = null;
    this.selectedProducts = [];
  }

  getDataBymenuGroupId(id: any, name: any) {
    this.categoryName = name;
    // console.log(name,'please give name');
    console.log('1111111');
    this.menuItems = this.productCategories.find(
      (x) => Number(x.menuGroupId) == Number(id)
    ).menuItems;
    this.menuItems.map((x) => {
      x.buttonTitle = 'ADD';
      if (this.routercurrent == 'delivery' && x.isAvailableDelivery == 0) {
        x.buttonTitle = 'Not Avail';
      } else if (
        this.routercurrent == 'takeaway' &&
        x.isAvailableTakeAway == 0
      ) {
        x.buttonTitle = 'Not Avail';
      } else if (this.routercurrent == 'dinein' && x.isAvailableDinein == 0) {
        x.buttonTitle = 'Not Avail';
      }
      x.product_quantity = 0;
      this.tempArray = JSON.parse(localStorage.getItem('cartItems'));
      if (this.tempArray && this.tempArray.length > 0) {
        this.tempArray.map((y: any) => {
          if (x.menuItemId == y.menuItemId) {
            x.product_quantity = x.product_quantity + y.product_quantity;
          }
        });
      } else {
        this.tempArray = [];
      }
    });
    this.currentItem = id;
    this.selected = name;
    console.log('newValue', this.menuItems);
  }

  isResetVisible() {
    if (this.productCategories?.length > 0) {
      if (
        Number(this.productCategories[0]?.menuGroupId) ==
        Number(this.currentItem)
      ) {
        return false;
      }
      return true;
    }
  }

  resetFunctionality() {
    this.menuItems = this.productCategories[0].menuItems;
    this.currentItem = this.productCategories[0].menuGroupId;
    this.selected = this.productCategories[0].groupName;
    this.productCategories = this.productCategories;
    this.categoryName = this.productCategories[0].groupName;
  }

  segmentChanged(e) {
    //<ion-segment (ionChange)="segmentChanged($event)">
    setTimeout(() => {
      const s = e.target.getBoundingClientRect();
      const sw = s.right - s.left;
      for (const button of e.target.childNodes) {
        if (button?.className?.indexOf('segment-button-checked') > -1) {
          const bc = button.offsetLeft + button.offsetWidth / 2;
          const diff = bc - sw / 2;
          e.target.scrollTo({
            left: diff,
            behavior: 'smooth',
          });
          break;
        }
      }
    }, 200);
  }

  GetFilename(url) {
    if (url) {
      var m = url.toString().match(/.*\/(.+?)\./);
      if (m && m.length > 1) {
        return m[1];
      }
    }
    return '';
  }
  getBannerImages() {
    let data = {
      order_type: this.routercurrent,
    };
    this.authService.getCarouselImages(data).subscribe({
      next: (data: any) => {
        console.log(data.data);
        this.bannerImages = data.data[0]?.images;
        console.log(this.bannerImages);
        this.staticImage =
          data?.data[0]?.menueGroup[0]?.menuItems[0]?.menuItemimageUrl;
        console.log(this.staticImage);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  setOpen(value: any, imageUrl: any) {
    this.isModalOpen = value;
    this.imageUrl = imageUrl;
  }
  cancel() {
    this.modal.dismiss(null, 'cancel');
    this.isModalOpen = false;
    this.router.navigate(['/maindelivery/' + this.currentRoute]);
  }
}
