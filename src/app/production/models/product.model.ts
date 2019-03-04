interface Product {
    categoryId: string;
    content: string;
    minPrice: string;
    name: string;
    originalPrice: string;
    status: "0" | "1"; //0 上架 1 下架
    stores: string;
    pics?: string[];
}