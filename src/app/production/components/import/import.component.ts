import { Component, OnInit } from '@angular/core';
import { WeChat } from '../../models/wechat.model';
import { RestClientService } from '../../../shared/services/rest-client.service';
import { forkJoin, Observable, observable } from 'rxjs';
import * as fs from 'fs';
import { HttpParams } from '@angular/common/http';
import { ApiFactoryResponse } from '../../../shared/models/api-factory-response.model';


//Cateory
const enum ProductCateory  {
  BabyMilk = "31206", //"奶粉米粉", // 奶瓶
  MamsKids = "30091", //"母婴用品", // 心
  Beauty   = "30093", // 玫瑰 化妆品
  Health   = "30092", // "保健品", // 太阳
  Medicine = "31209", // "康复必备", // 🧩🧩
  Foods    = "31207", // "休闲零食", // 南瓜
  Life     = "30094", // "生活用品", // 裙子
  School   = "31208", // "文具办公", // 企鹅
  Other    = "31228"  //"其他"
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

type FileUploadResponse = { code: number, data: {url: string}, msg: string};

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {
  public isImporting: boolean;
  public isFinished: boolean;
  public products: Product[];
  public wechatItems: WeChat[];
  public wechatImagesPath: string;
  public imageFiles: File[];
  public importedCount: number = 0;
  public failedCounter: number = 0;
  public importedProductList: string[] = [];

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
    this.imageFiles = Array.from(event.target.files);
    if(this.imageFiles)
      console.log(this.imageFiles.length);
  }

  public importProducts(products: Product[]) {
    this.isImporting = true;
    let body: FormData;
    products.forEach((product, index) => {
      setTimeout(() => {
        if(product.pics && product.pics.length>0){
          forkJoin(...this.uploadImageBatch(product.pics)).subscribe((resArr:FileUploadResponse[])=>{
            let pics = new Array<string>();
            resArr.forEach((res, index) =>{
              if(res.code === 0)
                pics.push(res.data.url)            
              else
                console.error(`图片：${product.pics[index]} 添加失败！`, product, res)
  
            });
            let params = this.createHttpParams(product).delete("pics").set("pics", pics.toString());
            this.addProduct(params);
          });
        }
        else{
          let params = this.createHttpParams(product);
          this.addProduct(params);
        }
      }, 5000);      
      
    });
  }

  private addProduct(params: HttpParams) {
    this._restClient.post("/user/apiExtShopGoods/save", null, {params: params}).subscribe((res: ApiFactoryResponse)=>{
      
      if(res.code !==0) {
        console.error(`产品：${params.get('name')} 添加失败！`, params, res);
        this.failedCounter++;
      }
      else{
        this.importedCount++;      
        console.log(this.importedCount, res);
        let product = res.data as Product; 
        this.importedProductList.push(`编号：${product.id}  名称：${product.name}`);
      }     
      

      if(this.importedCount + this.failedCounter  === this.products.length){
        this.isImporting = false;
        this.isFinished = true;
      }
        
    });
  }

  private createHttpParams(product: Product): HttpParams{
    let params = new HttpParams();
    Object.keys(product).forEach(key => params = params.set(key, product[key]))
    return params;
  }

  private uploadImageBatch(imageNames: string[]): Observable<FileUploadResponse>[]{
    //reverse all images
    return imageNames.reverse().map(name => {
      return this.uploadImage(name);
    });
  }

  private uploadImage(imageName: string): Observable<FileUploadResponse>{
    let file = this.imageFiles.find(file => file.name === imageName);
    
    let body = new FormData();
    body.set("upfile", file);
    return this._restClient.post("/fileUpload", body) as Observable<FileUploadResponse>;
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
        newproduct.originalPrice = newproduct.minPrice = item.originalPrice;         
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

  ///
  public deleteAll(){
    // this._restClient.post("/user/apiExtShopGoods/list", null).subscribe((res:ApiFactoryResponse)=> {
    //   let products: Product[] = res.data.result;
    //   products.forEach(product=>{
    //     this._restClient.post("/user/apiExtShopGoods/del", null, {params: new HttpParams().set('id', product.id)}).subscribe();
    //   });

    // })
  }

}
