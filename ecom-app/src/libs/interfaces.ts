type ProductId = string;
export type ProductGroup = 'clothing' | 'climbing' | 'cycling';
type Category = string;
type Subcategory = string;

export interface ProductsRecord {
  id: ProductId;
  pk: ProductGroup;
  sk: `${Category}#${Subcategory}#${ProductId}`;

  title: string;
  description: string;
  colour: string;
  sizesAvailable?: {
    sizeCode: number;
    displayValue: string;
  }[];
}