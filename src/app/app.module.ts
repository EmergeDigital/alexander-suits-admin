import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {AppRoutingModule} from "./app-routing.module";
import {HomeComponent} from './pages/home/home.component';
import {LoginComponent} from './pages/login/login.component';
import {LoginLayoutComponent} from "./layouts/login-layout/login-layout.component";
import {HomeLayoutComponent} from "./layouts/home-layout/home-layout.component";
import {ToastyModule} from 'ng2-toasty';

import {AuthHttp, AuthConfig} from 'angular2-jwt';
import {DataService} from "./services/data.service";
import {AuthService} from "./services/auth.service";
import {SessionService} from "./services/session.service";
import {AuthGuardService as AuthGuard} from "./services/auth-guard.service";
import {FunctionsService} from "./services/functions.service";

//Import all material.io components here
import {MaterialComponents} from './material.module';

import { SidenavComponent } from './partials/sidenav/sidenav.component';
import {Http, Headers, RequestOptions} from '@angular/http';


export function authHttpServiceFactory(http: Http, options: RequestOptions) {
    return new AuthHttp(new AuthConfig({
        tokenGetter: (() => localStorage.getItem('access_token'))
    }), http, options);
}

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        HomeLayoutComponent,
        LoginComponent,
        LoginLayoutComponent,
        SidenavComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ToastyModule,
        MaterialComponents
    ],
    providers: [DataService, SessionService, FunctionsService, AuthService, AuthGuard,
        {
            provide: AuthHttp,
            useFactory: authHttpServiceFactory,
            deps: [Http, RequestOptions]
        }],
    bootstrap: [AppComponent]
})
export class AppModule {
}
