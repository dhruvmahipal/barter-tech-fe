import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { GlobalService } from 'src/app/services/global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { IonSearchbar } from '@ionic/angular';
@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  @ViewChild('searchInput') sInput: IonSearchbar;
  cartItemsLength: any = 0;
  searchItems: any[] = [];
  itemsFound: number;
  product_quantity = 0;
  model: any = {
    icon: 'search-outline',
    title: 'No Food Matching Record Found',
  };
  query: any;
  isLoading: boolean = false;
  routercurrent: any;
  isCartValid = true;
  newSize: any;
  menuItems: any[] = [];
  groupName: any;
  groupName1: any;
  groupName2: any;
  category: any;
  currentRoute: any;
  item: [];
  newValue: any;
  newValue1: any;
  newValue2: any;
  maxselect: any;
  maxselect1: any;
  maxselect2: any;
  tempItem: any = {
    selectedItems: [],
    IsSizeApplicable: '0',
    IsoptionApplicable: '0',
    product_quantity: 0,
    options: { size: [] },
  };
  tempArray: any = [];
  displayValue: any;
  displayOptionValue: any;
  selectedSize: any;
  singleProduct: any;

  selectedProducts: any[] = [];
  constructor(
    private authService: AuthService,
    private global: GlobalService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private router: Router
  ) {
    this.route.params.subscribe((res) => {
      this.ngOnInit();
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.sInput.setFocus();
    }, 500);
    this.routercurrent = localStorage.getItem('currentRoute');
    console.log(this.routercurrent);
    if (this.routercurrent === null) {
      this.routercurrent = 'delivery';
    }
    localStorage.setItem('currentRoute', this.routercurrent);
    this.currentRoute = localStorage.getItem('currentRoute');
    this.route.params.subscribe((res) => {
      if (JSON.parse(localStorage.getItem('cartItems'))) {
        this.selectedProducts = JSON.parse(localStorage.getItem('cartItems'));
      }
    });
    this.authService.badgeDataSubject.subscribe((res) => {
      console.log(res, 'heelo');
      console.log(Object.keys(res), 'byee');
      if (res == 0) {
        let data = JSON.parse(localStorage.getItem('cartItems'));
        this.cartItemsLength = data ? data.length : 0;
      } else {
        this.cartItemsLength = res;
      }
    });
  }

  async onSearchChange(event) {
    console.log(event.detail.value);
    this.query = event.detail.value;

    // let obj = {
    //   merchant_id: '4',
    //   keyword: this.query,
    // };
    if (this.query.length >= 3) {
      this.global.showLoader('Loading Data');
      this.authService.searchData(this.query).subscribe({
        next: (data: any) => {
          if (data.data == '') {
            this.searchItems = [];
          } else {
            this.searchItems = data.data;
          }

          console.log(data);
          this.searchItems.map((x) => {
            x.buttonTitle = 'ADD';
            if (
              this.routercurrent == 'delivery' &&
              x.isAvailableDelivery == 0
            ) {
              x.buttonTitle = 'Not Avail';
            } else if (
              this.routercurrent == 'takeaway' &&
              x.isAvailableTakeAway == 0
            ) {
              x.buttonTitle = 'Not Avail';
            } else if (
              this.routercurrent == 'dinein' &&
              x.isAvailableDinein == 0
            ) {
              x.buttonTitle = 'Not Avail';
            }

            x.product_quantity = 0;
            this.selectedProducts = JSON.parse(
              localStorage.getItem('cartItems')
            );
            if (this.selectedProducts && this.selectedProducts.length > 0) {
              this.selectedProducts.map((y: any) => {
                if (x.menuItemId == y.menuItemId) {
                  x.product_quantity = y.product_quantity;
                }
              });
            } else {
              this.selectedProducts = [];
            }
          });
          this.global.hideLoader();
          this.itemsFound = this.searchItems.length;
          console.log(this.searchItems);
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      this.searchItems = [];
    }
  }

  // subQty(product, index) {
  //   let tempTotalMenuItem = localStorage.getItem('cartItems');
  //   let totalMenuItem = JSON.parse(tempTotalMenuItem);
  //   totalMenuItem.map((element) => {
  //     if (element.menuItemId === product.menuItemId) {
  //       element.product_quantity = element.product_quantity - 1;
  //     }
  //     if (element.product_quantity == 0) {
  //       totalMenuItem = totalMenuItem.filter(
  //         (ele) => ele.menuItemId != product.menuItemId
  //       );
  //     }
  //   });
  //   localStorage.removeItem('cartItems');
  //   localStorage.setItem('cartItems', JSON.stringify(totalMenuItem));
  //   let productLength = 0;
  //   totalMenuItem.forEach((element) => {
  //     productLength += element.product_quantity;
  //   });
  //   console.log(productLength);
  //   this.authService.badgeDataSubject.next(productLength);
  //   return (product.product_quantity = product.product_quantity - 1);
  //   // product.product_quantity = product.product_quantity - 1;
  //   // if (product.product_quantity == 0) {
  //   //   this.selectedProducts = this.selectedProducts.filter(
  //   //     (ele) => ele.menuItemId != product.menuItemId
  //   //   );
  //   // }
  //   // localStorage.setItem('cartItems', JSON.stringify(this.selectedProducts));
  //   // this.authService.badgeDataSubject.next(this.selectedProducts.length);
  // }
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
    totalMenuItem.map((element) => {
      if (element.menuItemId === product.menuItemId) {
        element.product_quantity = element.product_quantity + 1;
      }
    });
    localStorage.removeItem('cartItems');
    localStorage.setItem('cartItems', JSON.stringify(totalMenuItem));
    let productLength = 0;
    totalMenuItem.forEach((element) => {
      productLength += element.product_quantity;
    });
    console.log(productLength);
    this.authService.badgeDataSubject.next(productLength);
    return (product.product_quantity = product.product_quantity + 1);
    // console.log(this.selectedProducts);
    // product.product_quantity = product.product_quantity + 1;
    // localStorage.setItem('cartItems', JSON.stringify(this.selectedProducts));
  }

  add(product) {
    product.product_quantity = product.product_quantity + 1;
    this.selectedProducts = JSON.parse(localStorage.getItem('cartItems'))
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [];
    this.selectedProducts.push(product);
    let productLength = 0;
    this.selectedProducts.forEach((element) => {
      productLength += element.product_quantity;
    });
    console.log(productLength);
    this.authService.badgeDataSubject.next(productLength);
    localStorage.setItem('cartItems', JSON.stringify(this.selectedProducts));
  }
  notShow() {
    this.isCartValid = true;
    const notShow = document.getElementById('popup1');
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
      'this.searchItems',
      product,
      '-----this.searchItems',
      this.tempItem
    );
    if (product.optionGroups.length > 0 || product.size.length > 1) {
      this.tempItem = {};
      this.singleProduct = product;
      const pop = document.getElementById('popup1');
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
  addToCart() {
    this.isCartValid = true;
    this.tempItem.product_quantity = 1;
    this.singleProduct.product_quantity =
      this.singleProduct?.product_quantity + 1;
    console.log('add to cart', this.tempItem);
    this.singleProduct.options = this.singleProduct.product;
    this.category = this.singleProduct.product;
    this.authService.badgeDataSubject.next(this.searchItems.length);
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
    const notShow = document.getElementById('popup1');
    notShow.style.display = 'none';
    const currentCartItems = JSON.parse(localStorage.getItem('cartItems'));
    let productLength = 0;
    currentCartItems.forEach((element) => {
      productLength += element.product_quantity;
    });
    this.authService.badgeDataSubject.next(productLength);
    this.searchItems.map((x) => {
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

    console.log(this.searchItems, '-----');

    this.selectedProducts = [];
    this.selectedSize = null;
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
  accountButton() {
    this.query = '';
    this.sInput.value = null;
    this.searchItems = [];
    this.router.navigate(['/account']);
  }
  cartButton() {
    this.query = '';
    this.sInput.value = null;
    this.searchItems = [];
    this.router.navigate(['/cart']);
  }
  homeButton() {
    this.query = '';
    this.sInput.value = null;
    this.searchItems = [];
    let route = !this.currentRoute ? 'delivery' : this.currentRoute;
    this.router.navigate(['/maindelivery/' + route]);
  }
}
