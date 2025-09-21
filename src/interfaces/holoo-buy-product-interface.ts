export interface IBuyProductInfo {
  product_variant_erpcode: string;
  quantity: number;
  price: number;
  discount_percent?: number;
  productName: string;
  productCode: string;
}
