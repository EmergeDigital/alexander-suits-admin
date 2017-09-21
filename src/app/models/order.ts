export class Order {

  user_id: string;
  order_number: number;
  order_string: string;
  transaction_data: any;
  transaction_id: string;
  user_data: any;
  address_data: any;
  delivery_data: any;
  contact_number: string;
  contact_email: string;
  products: any[];
  comments: any[];
  total: number;
  status: string;
  completed: string;
  createdAt: Date;

  constructor(init: any) {
      for (const key in init) {
          if (init.hasOwnProperty(key)) {
              this[key] = init[key];
          }
      }
  }
}
