import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  product: any = {};

  myControl: FormControl = new FormControl();

  options = [
    'Suit',
    'Shirt',
    'Pants',
    'Coat',
    'Accessory',
    'Blouse',
    'Custom Suit',
    'Waistcoat',
    'Safari Shirt',
    'Caban Jacket'
   ];
  constructor() {
    this.options = this.options.sort();
  }

  filteredOptions: Observable<string[]>;
  isLoaded: boolean = false;

   ngOnInit() {
      this.filteredOptions = this.myControl.valueChanges
         .startWith(null)
         .map(val => val ? this.filter(val) : this.options.slice());
   }

    filter(val: string): string[] {
      return this.options.filter(option =>
        option.toLowerCase().indexOf(val.toLowerCase()) === 0);
   }

}
