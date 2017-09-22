import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  simpleDrop: any = null;

  constructor(public auth: AuthService,  public router: Router) {

   }

  ngOnInit() {
  }
  logout() {
    this.auth.logout();
  }

    containers: Array<Container> = [
        new Container(0, 'Pending Orders', "panel-warning", [new Widget('ORD-001041', 'James Bond'), new Widget('ORD-001042', 'Farrison Hord')]),
        new Container(1, 'Processing Orders', "panel-info", [new Widget('ORD-001046', 'Martha Steward'), new Widget('ORD-001045', 'Jimmy Carter')]),
        new Container(2, 'Completed Orders', "panel-success", [new Widget('ORD-001043', 'Jim Carrey'), new Widget('ORD-001044', 'Oxford Jones')])
    ];

    widgets: Array<Widget> = [];
    addTo($event: any) {
        if ($event) {
            this.widgets.push($event.dragData);
        }
    }

}

class Container {
  constructor(public id: number, public name: string, public panel: string, public widgets: Array<Widget>) {}
}

class Widget {
  constructor(public name: string, public person: string) {}
}
