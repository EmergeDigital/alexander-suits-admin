import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {AppRoutingModule} from "./app-routing.module";
import {HomeComponent} from './pages/home/home.component';
import {LoginComponent} from './pages/login/login.component';

import {DataService} from "./services/data.service";

//Import all material.io components here
import {MdButtonModule, MdCheckboxModule} from '@angular/material';
import {MdMenuModule} from '@angular/material';
import {MdToolbarModule} from '@angular/material';
import {MdSidenavModule} from '@angular/material';
import {MdIconModule} from '@angular/material';

@NgModule({
  imports: [MdButtonModule, MdCheckboxModule, MdSidenavModule, MdToolbarModule, MdIconModule],
  exports: [MdButtonModule, MdCheckboxModule, MdSidenavModule, MdToolbarModule, MdIconModule],
})
export class MaterialComponents { }

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialComponents
    ],
    providers: [DataService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
