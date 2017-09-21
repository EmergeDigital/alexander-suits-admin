export class Cart {

  user_id: string;
  products: any[];
  total: number;
  status: string;

  constructor(init: any) {
      for (const key in init) {
          if (init.hasOwnProperty(key)) {
              this[key] = init[key];
          }
      }
  }
}
