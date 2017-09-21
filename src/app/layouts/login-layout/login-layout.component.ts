import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-login-layout',
  templateUrl: './login-layout.component.html',
  styleUrls: ['./login-layout.component.scss']
})
export class LoginLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
      // $('body').addClass('bg-dark');
  }

}
