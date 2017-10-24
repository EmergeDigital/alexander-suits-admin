import { Component, OnInit } from '@angular/core';

import { DataService } from "../../services/data.service";
import { Router } from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // simpleDrop: any = null;
  loading: boolean = true;

  constructor(public auth: AuthService,  public router: Router, public data: DataService) {
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
      let _widget = new Widget(o.order_string, o.user_data.name, status)
      _orders.push(_widget);
    }
    return _orders;
  }

    containers: Array<Container> = [];

    widgets: Array<Widget> = [];

    addTo($event: any, status) {
      console.log($event, status);
      if($event.status !== status) {
        console.log('status changed');
        $event.status = status;
        //Call data.changeStatus
      }
      
    }

}

class Container {
  constructor(public id: number, public name: string, public status: string, public panel: string, public widgets: Array<Widget>) {}
}

class Widget {
  constructor(public name: string, public person: string, public status: string) {}
}
