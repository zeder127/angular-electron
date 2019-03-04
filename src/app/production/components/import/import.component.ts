import { Component, OnInit } from '@angular/core';
import { WeChat } from '../../models/wechat.model';
import { RestClientService } from '../../../shared/services/rest-client.service';
import { forkJoin, Observable } from 'rxjs';
import * as fs from 'fs';


//Cateory
const enum ProductCateory  {
  BabyMilk = "1000", // 奶瓶
  MamsKids = "2000", // 心
  Beauty   = "3000", // 玫瑰
  Health   = "4000", // 太阳
  Medicine = "5000", // 🧩🧩
  Foods    = "6000", // 南瓜
  Life     = "7000", // 裙子
  School   = "8000", // 企鹅
  Other    = "0"
}

const prefixMappings = [ 
 { prefix: "[玫瑰][玫瑰]",  categoryId: ProductCateory.Beauty }, 
 { prefix: "💃🏻💃",  categoryId: ProductCateory.Life },
 { prefix: "[太阳][太阳]",  categoryId: ProductCateory.Health },
 { prefix: "🍼🍼", categoryId: ProductCateory.BabyMilk },
 { prefix: "💖💖",  categoryId: ProductCateory.MamsKids },
 { prefix: "[跳跳][跳跳]",  categoryId: ProductCateory.School },
 { prefix: "🎃🎃",  categoryId: ProductCateory.Foods },
 { prefix: "🧩🧩", categoryId: ProductCateory.Medicine }
];


@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {
  public isImporting: boolean;
  public products: Product[];
  public wechatItems: WeChat[];
  public wechatImagesPath: string;

  constructor(private _restClient: RestClientService) { }
  
  private file: Blob;
  private fileContent: string;

  ngOnInit() {
  }

  public wechatFileChanged(event) {

    this.file = event.target.files[0];

    if(this.file){
      let fileReader = new FileReader();
      fileReader.readAsText(this.file);
      fileReader.onload = () => {
        this.wechatItems = JSON.parse(fileReader.result as string);      
        this.products = this.productTransform(this.wechatItems);
      }
    }
  }

  public imageFileChanged(event) {
    let imageFile: File = event.target.files[0];
    if(imageFile)
      this.wechatImagesPath = imageFile.path;
  }

  public importProducts(products: Product[]) {
    this.isImporting = true;
    let body: FormData;
    products.forEach((product, index) => {
      if(product.pics && product.pics.length>0){
        forkJoin(...product.pics)
      }
      body = new FormData();
      this._restClient.post("/user/apiExtShopGoods/save", body);
    });
  }

  private uploadImageBatch(imageNames: string[]): Observable<{url: string}>[]{
   return imageNames.map(name => {
      return this.uploadImage(name);
    });
  }

  private uploadImage(imageName: string): Observable<{url: string}>{
    let file;
    //
    let body = new FormData();
    body.set("upfile", file);
    return this._restClient.post("/fileUpload", body) as Observable<{url: string}>;
  }

  private productTransform(items: WeChat[]): Product[] {
    
    let products: Product[] = [];
    let newproduct: Product
    let templateProduct: Product = {
      categoryId: "",
      content: "",
      minPrice: "1",
      name: "",
      originalPrice: "1",
      status: "0", //0 上架 1 下架
      stores: "99999"
    };

    items.forEach((item, index) =>{
      
      if(item.type==='1'){
        if(index>0)
          products.push(newproduct);
        newproduct = {...templateProduct};
        newproduct.content = item.message;
        newproduct.name = item.name;
        newproduct.pics = new Array<string>();
        newproduct.categoryId = this.mapCategoryId(item.message);
      } else {
        newproduct.pics.push(item.mesLocalID + '.jpg');
      }
    });

    // insert the last product
    products.push(newproduct);

    return products;
  }

  private mapCategoryId(message: string): string {

    for (const mapping of prefixMappings) {
       if(message.startsWith(mapping.prefix)){
          return mapping.categoryId;
       }        
    }

    return ProductCateory.Other; // as fallback
  }

}
