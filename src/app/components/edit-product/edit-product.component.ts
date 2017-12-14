import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import { TdLoadingService } from '@covalent/core';
import { Ng2ImgToolsService } from 'ng2-img-tools';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { DataService } from "../../services/data.service";

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
  id: string;
  private sub: any;
  public product: any;
  public error: string;
  public isLoading: boolean;

  constructor(private route: ActivatedRoute, public data: DataService, private _loadingService: TdLoadingService, private toastyService:ToastyService, public router: Router,
    private toastyConfig: ToastyConfig, private ng2ImgToolsService: Ng2ImgToolsService) {
    // this.options = this.options.sort();
   this.isLoading = true;
   this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];

      this.data.getProduct(this.id).then(product=> {
        this.product = product;
        this.coloursModel = [this.product.primary_colour];
        this.colourAdded();
        this.coloursModel2 = this.product.secondary_colours;
        this.collectionsModel = this.product.collections;
        //TODO convert colours
        this.isLoading = false;
        console.log(product);
      });
      // Fetch order from API
   });
  }
  ngOnInit() {
    this.filterCats('');
    this.filterColours('');
    this.colours2 = this.colours;
  }

  //TODO: UPDATE WITH PRODUCT CHANGES
  
  next() {
    this._loadingService.register('overlayStarSyntax');
    let flag = this.checkData();
    if(flag) {
      if(this.uploadedThumb) {
        this.product.image_urls[0] = this.uploadedThumb;
        this.uploading = true;
        this.fileUploading = "Uploading now, please wait.";
        console.log(this.uploadedThumb);
          this.data.uploadImage(this.uploadImg).then(response => {
            this.product.image_urls[1] = response;
            this.updateProduct();
          // })
        }).catch(ex => {
          this.failed("Product creation failed", ex);
          console.log(ex);
          this.uploading = false;
        });
      } else {
        this.updateProduct();
      }
    } else {

    }
  }
  
  updateProduct() {
    let product = this.product;
    product.primary_colour = this.coloursModel[0];
    product.secondary_colours = this.coloursModel2;
    product.collections = this.collectionsModel;
    this.data.updateProduct(this.id, product).then(_product => {
      console.log(_product);
      if(!!_product) {
        this.success("Products created", "All products have been processed and created");
        this.cancelEvent();
      } else {
        this.failed("Product creation failed", "Unknown error, empty response");
      }
    })
  }
  
  checkData(): boolean {
    if(!(!!this.product.name)) {
      this.failed("Product creation failed", "Please enter a name.");
      return false;
    } else if(!(!!this.product.description)) {
      this.failed("Product creation failed", "Please enter a short description.");
      return false;
    } else if(this.collectionsModel.length <= 0) {
      this.failed("Product creation failed", "Please select product collections.");
      return false;
    } else if(!(!!this.product.price) || this.product.price === 0) {
      this.failed("Product creation failed", "Please enter a price, do you want this to be free?");
      return false;
    }
    return true;
  }

  fileSelectMsg: string = '';
  fileSelectMsg2: string = '';
  uploadImg: any = {};
  uploading: boolean = false;
  fileUploading: string = '';
  imagesUploaded: string[] = [];
  canAddChips: boolean = false;
  thumbnail: any = {};
  uploadedThumb: string = '';

  selectEvent(file: File): void {
    this._loadingService.register('overlayStarSyntax');
    this.fileSelectMsg = file.name;
    this.uploadImg = file;
    this.imagesUploaded = [];
    this.ng2ImgToolsService.resizeExactCrop([file], 180, 180).subscribe(result => {
        //all good, result is a file
        this.thumbnail = result;
        this.fileSelectMsg2 = result.name;
        console.info(result);
        this.data.uploadImage(this.thumbnail).then(_response => {
          this.uploadedThumb = _response;
          this._loadingService.resolve('overlayStarSyntax');
          console.info(_response);
        });
    }, error => {
        this.cancelEvent();
        this.failed("Thumbnail Creation Failed", "Please try select your image again");
        this._loadingService.resolve('overlayStarSyntax');
        //something went wrong 
        //use result.compressedFile or handle specific error cases individually
    });
  }

  failed(title, error) {
    var toastOptions:ToastOptions = {
     title: title,
     msg: error
    };

    this.toastyService.warning(toastOptions);
    this._loadingService.resolve('overlayStarSyntax');
  }

  success(title, message) {
    var toastOptions:ToastOptions = {
     title: title,
     msg: message
    };

    this.toastyService.success(toastOptions);
    this._loadingService.resolve('overlayStarSyntax');
  }


  cancelEvent(): void {
    this.fileSelectMsg = '';
    this.fileSelectMsg2 = '';
    this.thumbnail = {};
    this.uploadImg = {};
    this.imagesUploaded = null;
  }

  prices: any[] = [
    { id: "1", name: "Category 1 - R7,500.00" },
    { id: "2", name: "Category 2 - R8,500.00" },
    { id: "3", name: "Category 3 - R9,500.00" },
    { id: "4", name: "Category 4 - R10,800.00" },
    { id: "5", name: "Category 5 - R11,800.00" },
    { id: "6", name: "Category 6 - R12,800.00" },
    { id: "7", name: "Category 7 - R13,500.00" },
    { id: "8", name: "Category 8 - R14,500.00" },
    { id: "9", name: "Category 9 - R15,500.00" },
    { id: "10", name: "Category 10 - R17,500.00" },
    { id: "11", name: "Category 11 - R18,500.00" },
    { id: "12", name: "Category 12 - R20,800.00" },
    { id: "13", name: "Category 13 - R22,500.00" },
    { id: "14", name: "Category 14 - R24,000.00" },
    { id: "15", name: "Category 15 - R26,000.00" },
  ];
  
  prices2: any[] = [
    { id: "1", name: "Category 1 - R750.00" },
    { id: "2", name: "Category 2 - R995.00" },
    { id: "3", name: "Category 3 - R1,200.00" },
    { id: "4", name: "Category 4 - R1,500.00" },
    { id: "5", name: "Category 5 - R1,700.00" },
    { id: "6", name: "Category 6 - R1,900.00" },
    { id: "7", name: "Category 7 - R2,400.00" },
    { id: "8", name: "Category 8 - R2,800.00" },
    { id: "9", name: "Category 9 - R3,400.00" },
  ];

  disabled: boolean = false;
  chipAddition: boolean = true;
  chipRemoval: boolean = true;

  categories: string[] = [
    'Shirt',
    'Suit',
    'Jacket',
    'Trouser',
    'Waistcoat'
  ];


  filteredCats: string[];

  catsModel: string[] = [];


  filterCats(value: string): void {
    this.filteredCats = this.categories.filter((item: any) => {
      if (value) {
        return item.toLowerCase().indexOf(value.toLowerCase()) > -1;
      } else {
        return false;
      }
    }).filter((filteredItem: any) => {
      return this.catsModel ? this.catsModel.indexOf(filteredItem) < 0 : true;
    });
  }

  selectedPrint: string = "";
  selectedPrint_type: string = "";

  prints: string[] = [
    "Check",
    "Stripe",
    "Other",
    "Plain",
  ];

  _checks: string[] = [
    "Fine",
    "Medium",
    "Large",
  ];

  _stripes: string[] = [
    "Fine",
    "Medium",
    "Wide",
  ];

  _others: string[] = [
    "Spot",
    "Abstract",
    "Motif",
  ];

  selPrint(): boolean {
    // console.log(this.selectedPrint);
    switch(this.product.print) {
      case 'Check':
        return true;
      
      case 'Stripe':
        return true;

      case 'Other':
        return true;

      default:
        return false;
    }
  }

  colours = [
    "White",
    "Offwhite",
    "Beige",
    "Orange",
    "Burnt Orange",
    "Light Brown",
    "Brown",
    "Light Pink",
    "Pink",
    "Red",
    "Dark Red",
    "Burgundy",
    "Aubergine",
    "Light Purple/Malve",
    "Purple",
    "Fuchsia /with pink",
    "Light Blue",
    "Medium Blue",
    "Royal Blue",
    "Cobalt Blue",
    "Navy Blue",
    "Dark Navy Blue",
    "Very light grey",
    "Light Grey",
    "Medium Grey",
    "Charcoal Grey",
    "Black",
  ];


  filteredColours: string[];

  coloursModel: string[] = [];

  filterColours(value: string): void {
    this.filteredColours = this.colours.filter((item: any) => {
      if (value) {
        return item.toLowerCase().indexOf(value.toLowerCase()) > -1;
      } else {
        return false;
      }
    }).filter((filteredItem: any) => {
      return this.coloursModel ? this.coloursModel.indexOf(filteredItem) < 0 : true;
    });
  }

  colourAddition: boolean = true;

  colourAdded() {
    // console.log(this.coloursModel);
    if (this.coloursModel.length >= 1) {
      this.colourAddition = false;
    }
  }

  colourRemoved() {
    if (this.coloursModel.length < 1) {
      this.colourAddition = true;
    }
  }

  colours2 = [];

  filteredColours2: string[];

  coloursModel2: string[] = [];

  filterColours2(value: string): void {
    this.filteredColours2 = this.colours2.filter((item: any) => {
      if (value) {
        return item.toLowerCase().indexOf(value.toLowerCase()) > -1;
      } else {
        return false;
      }
    }).filter((filteredItem: any) => {
      return this.coloursModel2 ? this.coloursModel2.indexOf(filteredItem) < 0 : true;
    });
  }

  fabricType: string = '';
  fabricSubcategory: string = '';
  
    fabric_types: string[] = [
      "Cotton",
      "Cotton Blend",
      "Linen",
      "Linen Blend",
      "Wool",
      "Wool Blend",
      "Wool Blend (Artifical Fibre)",
      "Other",
    ];
  
    _cottons: string[] = [
      "Polyester",
      "Line",
      "Rayon",
      "Lycra",
      "Other",
    ];
  
    _linens: string[] = [
      "Cotton",
      "Polyester",
      "Rayon",
      "Other",
    ];
  
    _wools: string[] = [
      "Silk",
      "Mohair",
      "Merino",
      "Cotton",
      "Cashmere",
      "Linen",
      "Polyester",
      "Lycra",
      "Alpaca",
      "Vicunya",
      "Other",
    ];
  
    selType(): boolean {
      switch(this.product.fabric_type) {
        case 'Cotton Blend':
          return true;
        
        case 'Linen Blend':
          return true;
  
        case 'Wool Blend':
          return true;
  
        default:
          return false;
      }
    }

    weaves_shirt: string[] = [
      "Flat / Popeline",
      "Twill",
      "Herringbone",
      "Basket Weave",
      "Jacquard",
      "Pin Point / Oxford",
      "Fil a Fil",
      "Houndstooth",
    ];

    weaves_other: string[] = [
      "Flat / Popeline",
      "Gabardine (Twill)",
      "Twill (Tweed)",
      "Barleycorn (Tweed)",
      "Herringbone",
      "Houndstooth",
      "Basket Weave",
      "Corduroy",
      "Flannel",
      "Seersucker",
      "Birds Eye",
      "Seersucker",
      "Other",
    ];

    collections: string[] = [
      "Casual",
      "Business",
      "Ceremony",
    ];
    
    filteredCols: string[];
  
    collectionsModel: string[] = [];
  
    filterCols(value: string): void {
      this.filteredCols = this.collections.filter((item: any) => {
        if (value) {
          return item.toLowerCase().indexOf(value.toLowerCase()) > -1;
        } else {
          return false;
        }
      }).filter((filteredItem: any) => {
        return this.collectionsModel ? this.collectionsModel.indexOf(filteredItem) < 0 : true;
      });
    }
}
