import { Injectable, EventEmitter } from '@angular/core';
import {Cart} from "../models/cart";
import {Order} from "../models/order";

@Injectable()
export class SessionService {

  constructor() { }

  setLocalCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  getLocalCart() {
    return JSON.parse(localStorage.getItem('cart'));
  }

  storeOrder(order) {
    localStorage.setItem('current_order', JSON.stringify(order));
  }

  fetchOrder() {
    return JSON.parse(localStorage.getItem('current_order'));
  }

  storeTransaction(transaction) {
    localStorage.setItem('current_transaction', JSON.stringify(transaction));
  }

  fetchTransaction() {
    return JSON.parse(localStorage.getItem('current_transaction'));
  }

}
