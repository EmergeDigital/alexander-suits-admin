export class User {

  fullname: string;
  user_id: string;
  email: string;
  contact_mobile: string;
  address: string;
  address2: string;
  city: string;
  province: string;
  postal_code: string;
  country: string;
  carts: string[];
  orders: string[];
  measurements: any;
  status: string;

  constructor(init: any) {
      for (const key in init) {
          if (init.hasOwnProperty(key)) {
              this[key] = init[key];
          }
      }
  }
}
