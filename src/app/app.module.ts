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
import {ReactiveFormsModule} from '@angular/forms';

import { MakeEnglish } from './pipes/makeEnglish.pipe'; // import our pipe here

import {AuthHttp, AuthConfig} from 'angular2-jwt';
import {DataService} from "./services/data.service";
import {AuthService} from "./services/auth.service";
import {SessionService} from "./services/session.service";
import {AuthGuardService as AuthGuard} from "./services/auth-guard.service";
import {FunctionsService} from "./services/functions.service";


import { CovalentLayoutModule, CovalentStepsModule /*, any other modules */ } from '@covalent/core';
// (optional) Additional Covalent Modules imports
import { CovalentHighlightModule } from '@covalent/highlight';
import { CovalentMarkdownModule } from '@covalent/markdown';
import { CovalentDynamicFormsModule } from '@covalent/dynamic-forms';
import {CovalentHttpModule} from '@covalent/http';
import {CovalentSearchModule} from '@covalent/core';
import {CovalentDataTableModule} from '@covalent/core';
import {CovalentPagingModule} from '@covalent/core';
import { CovalentFileModule } from '@covalent/core';
import { CovalentChipsModule } from '@covalent/core';
import { CovalentLoadingModule } from '@covalent/core';
import { CovalentDialogsModule } from '@covalent/core';
//Import all material.io components here
import {MaterialComponents} from './mods/material.module';
import {DndModule} from 'ng2-dnd';
import { Ng2ImgToolsModule } from 'ng2-img-tools'; // <-- import the module

import { SidenavComponent } from './partials/sidenav/sidenav.component';
import {Http, Headers, RequestOptions} from '@angular/http';
import { ProductsComponent } from './components/products/products.component';
import { OrdersComponent } from './components/orders/orders.component';
import { UsersComponent } from './components/users/users.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { OrderComponent } from './components/order/order.component';


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
        SidenavComponent,
        ProductsComponent,
        OrdersComponent,
        UsersComponent,
        AddProductComponent,
        TransactionsComponent,
        MakeEnglish,
        OrderComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        Ng2ImgToolsModule,
        ToastyModule.forRoot(),
        MaterialComponents,
        DndModule.forRoot(),
        CovalentSearchModule, CovalentDataTableModule,CovalentPagingModule,
        CovalentLayoutModule, CovalentStepsModule, CovalentHighlightModule, CovalentMarkdownModule, CovalentDynamicFormsModule,
        CovalentFileModule, CovalentChipsModule, CovalentLoadingModule,CovalentDialogsModule,

        CovalentHttpModule.forRoot(),
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
