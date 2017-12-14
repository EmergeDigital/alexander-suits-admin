import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Order} from "../../models/order";
import {AuthService} from '../../services/auth.service';
import {DataService} from '../../services/data.service';
import {SessionService} from '../../services/session.service';
import { TdLoadingService, LoadingType, LoadingMode  } from '@covalent/core';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import { ViewContainerRef } from '@angular/core';
import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

    id: string;
    private sub: any;
    public order: Order;
    public error: string;
    public isLoading: boolean;
    measurements: any;

    constructor(private route: ActivatedRoute, public auth: AuthService, public data: DataService, public router: Router, public session: SessionService, 
      private _loadingService: TdLoadingService, private toastyService:ToastyService, private toastyConfig: ToastyConfig, private _dialogService: TdDialogService,
      private _viewContainerRef: ViewContainerRef) {


        this._loadingService.create({
          name: 'configFullscreenDemo',
          mode: LoadingMode.Indeterminate,
          type: LoadingType.Linear,
          color: 'primary',
        });
        this.isLoading = true;
        this.sub = this.route.params.subscribe(params => {
           this.id = params['id'];
     
           this.data.getOrderById(this.id).then(order=> {
             this.order = order;
             // if(!!order.user_data.other_data) {
             //   this.measurements = order.user_data.other_data.measurements;
             // } else {
               this.measurements = {
                 height: '123',
                 chest: "133",
                 halfback: "12",
                 biceps: '124',
                 stomach: "2312",
                 seat: "312",
                 thigh: '354',
                 halfwaist: '213',
                 backlength: '111',
                 waist: '123',
                 outside_seamline: '444',
                 inside_seamline: '3123',
                 body_type: {img: "assets/measurements/1-slender.png", id: 0, title: "Slender", desc: "blah blah youre skinny etc"},
                 uploadedImg: 'http://res.cloudinary.com/dhb9izfva/image/upload/v1509016644/man_ncy2v4.jpg'
               };
             // }
             console.log(order);
             let products = order.products;
             let pendingProducts = this.getWidgets(products.filter(x => x.status === 'unassigned' || x.status === undefined || x.status === null), 'unassigned');
             let mProducts = this.getWidgets(products.filter(x => x.status === 'mauritius'), 'mauritius');
             let pProducts = this.getWidgets(products.filter(x => x.status === 'in_shop'), 'in_shop');
             let readyProducts = this.getWidgets(products.filter(x => x.status === 'ready'), 'ready');
     
             this.containers = [
               new Container(0, 'Unassigned', 'unassigned', "panel-warning", pendingProducts),
               new Container(1, 'Mauritius', 'mauritius', "panel-info", mProducts),
               new Container(1, 'In Shop', 'in_shop', "panel-info", pProducts),
               new Container(2, 'Ready for Shipping', 'ready', "panel-success", readyProducts)
             ];
             Observable.interval(1000 * 2).subscribe(x => {
               this.checkStatuses();
             });
             this.isLoading = false;
           });
           // Fetch order from API
        });
      }

  ngOnInit() {
 }

 checkStatuses() {
   for(let container of this.containers) {
    //  console.log(container);
      for(let widget of container.widgets) {
        if(widget.status !== container.status) {
          console.log(widget);
          widget.status = container.status;
          //update product status
        }
      }
   }
 }

 changeStatus(row) {
  console.log(row);
  let status = row.status;
  this._loadingService.register('overlayStarSyntax');
  if(status === 'shipped') {
     this._dialogService.openPrompt({
       message: 'Please enter the shipping number',
       disableClose: true,
       viewContainerRef: this._viewContainerRef, //OPTIONAL
       title: 'Shipping Number', //OPTIONAL, hides if not provided
       value: '', //OPTIONAL
       cancelButton: 'Cancel', //OPTIONAL, defaults to 'CANCEL'
       acceptButton: 'Submit', //OPTIONAL, defaults to 'ACCEPT'
     }).afterClosed().subscribe((newValue: string) => {
       if (newValue) {
         // DO SOMETHING
         this.updateStatus(status, row.order_string, newValue);
       } else {
         this.updateStatus(status, row.order_string, null);
         // DO SOMETHING ELSE
       }
     });
   } else {
     this.updateStatus(status, row.order_string, null);
   }
 }

 updateStatus(status, order_string, tracking_number) {
   this.data.updateStatus(status, order_string, tracking_number).then(order => {
     this._loadingService.resolve('overlayStarSyntax');
     this.success("Order updated", "Order status has been changed successfully");
     console.log(order);
   }).catch(ex => {        
     this._loadingService.resolve('overlayStarSyntax');
     console.log("An error occurred", ex);
     this.failed("An error occurred", ex);
   });
 }

 statuses = [
  {value: 'failed', viewValue: 'Failed'},
  {value: 'awaiting_eft', viewValue: 'Awaiting EFT'},
  {value: 'awaiting_payment', viewValue: 'Awaiting Payment'},
  {value: 'payment_pending', viewValue: 'Payment Pending'},
  {value: 'payment_processed', viewValue: 'Payment Processed'},
  // {value: 'processed', viewValue: 'Processed'},
  {value: 'processing', viewValue: 'Processing'},
  {value: 'shipped', viewValue: 'Shipped'},
  {value: 'complete', viewValue: 'Complete'}
];

//  addTo($event: any, status) {
//   console.log($event, status);
//   if($event.status !== status) {
//     $event.status = status;

//     this._loadingService.register('configFullscreenDemo');
//     setTimeout(()=> {
//       this._loadingService.resolve('configFullscreenDemo');
//     }, 1500);
//   }
//  }


  getWidgets(products, status) {
    let _products = [];
    for(let p of products) {
      let _widget = new Widget(p.product_SKU, p.category, p.name, p.price, p.image_urls, p.description, p.extras, status)
      _products.push(_widget);
    }
    return _products;
  }

  containers: Array<Container> = [];

  widgets: Array<Widget> = [];


//  unpaidStates: string[] = [
//    "awaiting_payment",
//    "payment_pending",
//    "pending",
//    "failed"
//  ];

//  unpaid(status) {
//    if(this.unpaidStates.includes(status) || status === null) {
//      return true;
//    }
//     return false;
//  }

  ngOnDestroy() {
    this.sub.unsubscribe();
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

  // makePayment() {
  //   this.session.storeOrder(this.order);
  //   this.session.storeTransaction(null);
  //   this.router.navigate(['/payment']);
  // }

}

class Container {
  constructor(public id: number, public name: string, public status: string, public panel: string, public widgets: Array<Widget>) {}
}

class Widget {
  constructor(public id: string, public category: string, public name: string, public price: number, public image_urls: string[], 
    public description: string, public extras: any, public status: string) {}
}
