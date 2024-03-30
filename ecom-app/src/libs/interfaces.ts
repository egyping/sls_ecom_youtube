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
type TimesStamp = number

export type OrderStatus = 'pending' | 'shipped' | 'delivered' | 'packed'


export interface OrderRecord {
  id: string;
  pk: string;
  sk: `order#${TimesStamp}`;

  userId: string
  userEmail: string
  dateCreated: TimesStamp
  dateUpdated?: TimesStamp
  status: OrderStatus
  items: {
    id: ProductId
    count: number
    size: number
  }[]
}