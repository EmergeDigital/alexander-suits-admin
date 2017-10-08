import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { DataService } from "../../services/data.service";

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  product: any = {};

  // myControl: FormControl = new FormControl();

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
  constructor(public data: DataService) {
    // this.options = this.options.sort();
  }


    ngOnInit(): void {
      this.filterStrings('');
    }

  //   filter(val: string): string[] {
  //     return this.options.filter(option =>
  //       option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  //  }

   fileSelectMsg: string = '';
   uploadImg: any = {};
   uploading: boolean = false;
   fileUploading: string = '';
   imagesUploaded: string[] = [];
   canAddChips: boolean = false;

   selectEvent(file: File): void {
     this.fileSelectMsg = file.name;
     this.uploadImg = file;
     this.imagesUploaded = [];
   }

   next() {
     this.uploading = true;
     this.fileUploading = "Uploading now, please wait.";
     this.data.uploadImage(this.uploadImg).then(response=>{
       console.log(response);
       let arr = [];
       arr.push(response);
       this.imagesUploaded = arr;
       this.uploading = false;
       this.fileUploading = "";
       this.fileSelectMsg = "";
     }).catch(ex => {
       console.log(ex);
     });
   }


   cancelEvent(): void {
     this.fileSelectMsg = '';
     this.uploadImg =  {};
     this.imagesUploaded = null;
   }

   prices: any[] = [
     {id: "1", name: "Category 1 - R7600"},
     {id: "2", name: "Category 2 - R8500"},
     {id: "3", name: "Category 3 - R11000"}
   ];

   prices2: any[] = [
     {id: "1", name: "Category 1 - R600"},
     {id: "2", name: "Category 2 - R850"},
     {id: "3", name: "Category 3 - R1100"}
   ];

   disabled: boolean = false;
  chipAddition: boolean = true;
  chipRemoval: boolean = true;

  strings: string[] = [
    'Shirt',
    'Suit',
    'Pants',
    'Accessory',
    'Other'
  ];


  filteredStrings: string[];

  stringsModel: string[] = [];


  filterStrings(value: string): void {
    this.filteredStrings = this.strings.filter((item: any) => {
      if (value) {
        return item.toLowerCase().indexOf(value.toLowerCase()) > -1;
      } else {
        return false;
      }
    }).filter((filteredItem: any) => {
      return this.stringsModel ? this.stringsModel.indexOf(filteredItem) < 0 : true;
    });
  }

}
