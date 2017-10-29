import { Component, OnInit } from '@angular/core';

import { DataService } from "../../services/data.service";
import { Router } from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import { TdLoadingService } from '@covalent/core';
import { ViewContainerRef } from '@angular/core';
import { TdDialogService } from '@covalent/core';
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // simpleDrop: any = null;
  loading: boolean = true;

  constructor(public auth: AuthService,  public router: Router, public data: DataService, private _loadingService: TdLoadingService, private toastyService:ToastyService,
    private toastyConfig: ToastyConfig, private _dialogService: TdDialogService,private _viewContainerRef: ViewContainerRef) {
      this.loading = true;
      this.data.getAllOrders().then(orders=>{
        console.log(orders);
        let pendingOrders = this.getWidgets(orders.filter(x => x.status === 'payment_processed'), 'payment_processed');
        let processingOrders = this.getWidgets(orders.filter(x => x.status === 'processing'), 'processing');
        let shippedOrders = this.getWidgets(orders.filter(x => x.status === 'shipped'), 'shipped');

        this.containers = [
          new Container(0, 'Pending Orders', 'payment_processed', "panel-warning", pendingOrders),
          new Container(1, 'Processing Orders', 'processing', "panel-info", processingOrders),
          new Container(2, 'Shipped Orders', 'shipped', "panel-success", shippedOrders)
        ];
        Observable.interval(1000 * 2).subscribe(x => {
          this.checkStatuses();
        });
        this.loading = false;
      });

 
   }

  ngOnInit() {
  }
  logout() {
    this.auth.logout();
  }

  getWidgets(orders, status) {
    let _orders = [];
    for(let o of orders) {
      let _widget = new Widget(o.order_string, o.user_data.name, status, o.id)
      _orders.push(_widget);
    }
    return _orders;
  }

  containers: Array<Container> = [];

  widgets: Array<Widget> = [];

  addTo($event: any, status) {
    console.log($event, status);
    if($event.status !== status) {
      this._loadingService.register('overlayStarSyntax');
      console.log('status changed');
      $event.status = status;
      //Call data.updateStatus
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
              this.updateStatus(status, $event.name, newValue);
            } else {
              this.updateStatus(status, $event.name, null);
              // DO SOMETHING ELSE
            }
          });
      } else {
        this.updateStatus(status, $event.name, null);
      }
    }
    
  }

  checkStatuses() {
    for(let container of this.containers) {
     //  console.log(container);
       for(let widget of container.widgets) {
         let status = container.status;

         if(widget.status !== status) {
           console.log(widget);
           widget.status = status;
           if(status === 'shipped') {
            this._dialogService.openPrompt({
              message: 'Please enter the shipping number for order ' + widget.name,
              disableClose: true,
              viewContainerRef: this._viewContainerRef, //OPTIONAL
              title: 'Shipping Number', //OPTIONAL, hides if not provided
              value: '', //OPTIONAL
              cancelButton: 'Cancel', //OPTIONAL, defaults to 'CANCEL'
              acceptButton: 'Submit', //OPTIONAL, defaults to 'ACCEPT'
            }).afterClosed().subscribe((newValue: string) => {
              if (newValue) {
                // DO SOMETHING
                this.updateStatus(status, widget.name, newValue);
              } else {
                this.updateStatus(status, widget.name, null);
                // DO SOMETHING ELSE
              }
            });
        } else {
          this.updateStatus(status, widget.name, null);
        }
           //update product status
         }
       }
    }
  }

  updateStatus(status, order_string, tracking_number) {
    this.data.updateStatus(status, order_string, tracking_number).then(order => {
      // this._loadingService.resolve('overlayStarSyntax');
      this.success("Order updated", "Order status has been changed successfully");
      console.log(order);
    }).catch(ex => {        
      // this._loadingService.resolve('overlayStarSyntax');
      console.log("An error occurred", ex);
      this.failed("An error occurred", ex);
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

}

class Container {
  constructor(public id: number, public name: string, public status: string, public panel: string, public widgets: Array<Widget>) {}
}

class Widget {
  constructor(public name: string, public person: string, public status: string, public id: string) {}
}
