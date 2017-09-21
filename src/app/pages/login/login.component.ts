import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {DataService} from '../../services/data.service';
import { Router } from '@angular/router';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  authenticating: boolean;

  constructor(public auth: AuthService, public data: DataService, private toastyService:ToastyService, private toastyConfig: ToastyConfig, public router: Router) {


    if(auth.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit() {
    this.auth._authenticating.subscribe(authenticating => {

        this.authenticating = authenticating;
    })
    this.auth._authenticated.subscribe(authenticated => {
      console.log("AUTHED" + authenticated);
      if(authenticated) {
        this.authenticating = false;
        this.router.navigate(['/home']);
      } else {
        this.authenticating = false;
      }
    });
  }

  login() {
    this.auth.logout();
    this.auth.login();
  }

}
