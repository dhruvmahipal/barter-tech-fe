import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  categoryUrl: string = 'https://api.orderpoint.net.au/api/MenuItems';

  constructor(private httpClient: HttpClient) {}

  getProductCategories(): Observable<any> {
    let param = new HttpParams();
    param = param.append('merchant_id', '45');
    return this.httpClient.get<any>(this.categoryUrl, { params: param });
  }

  // getProductList(theCategoryId: number): Observable<any> {
  //   console.log("Getting products from resp category");
  //   // return this.httpClient.get<any>(this.categoryUrl, { paramMap: theCategoryId })
  // }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

interface GetProductCategoriesResponse {
  menueGroup: { productCategory: ProductCategory[] };
}
