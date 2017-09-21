import { Injectable } from '@angular/core';

@Injectable()
export class FunctionsService {

  constructor() { }

  updateTotal(products1, products2) {
    let total_price = 0;
    for(let p of products1) {
      total_price += p.price*p.count;
    }

    for(let _p of products2) {
      total_price += _p.price*_p.count;
    }

    return total_price;
  }

  countTotal(products){
    let total_price = 0;
    for(let _p of products) {
      total_price += _p.price*_p.count;
    }

    return total_price;
  }

  mergeProducts (products1, products2) {

    let new_products = products1.concat(products2);
    let final_products = [];
    let sortedArr = this.sortByKey(new_products, 'id');
    var current = sortedArr[0];
    for (var i = 1; i < sortedArr.length; i++) {
      if (sortedArr[i].id != current.id) {
          final_products.push(current);
          current = sortedArr[i];
      } else {
          current.count += sortedArr[i].count;
      }
    }
    final_products.push(current);

    return final_products;
  }

  sortByKey(array, key) {
      return array.sort(function (a, b) {
          let x = a[key];
          let y = b[key];
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
  }

}
