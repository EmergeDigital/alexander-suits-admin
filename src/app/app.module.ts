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
import {MaterialComponents} from './material.module';

import { SidenavComponent } from './partials/sidenav/sidenav.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        SidenavComponent
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
