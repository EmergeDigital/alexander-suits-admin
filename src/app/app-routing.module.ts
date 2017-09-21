import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService as AuthGuard} from "./services/auth-guard.service";

// Import Page Components
import { LoginComponent } from "./pages/login/login.component";
import { HomeComponent } from "./pages/home/home.component";
import { ProductsComponent } from "./components/products/products.component";
import { OrdersComponent } from './components/orders/orders.component';
import { UsersComponent } from './components/users/users.component';
import {LoginLayoutComponent} from "./layouts/login-layout/login-layout.component";
import {HomeLayoutComponent} from "./layouts/home-layout/home-layout.component";

const routes: Routes = [

    // Default path
    // {
    //     // Default path
    //     path: '',
    //     redirectTo: 'home',
    //     pathMatch: 'full'
    // },
    // {
    //     path: 'home',
    //     component: HomeComponent
    // },
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {
        path: '',                       // {1}
        component: HomeLayoutComponent,
        canActivate: [AuthGuard],       // {2}
        children: [
            {
                path: 'home',
                component: HomeComponent   // {3}
            },
            {
                path: 'products',
                component: ProductsComponent   // {3}
            },
            {
                path: 'orders',
                component: OrdersComponent   // {3}
            },
            {
                path: 'clients',
                component: UsersComponent   // {3}
            },
        ]
    },
    {
        path: '',
        component: LoginLayoutComponent, // {4}
        children: [
            {
                path: 'login',
                component: LoginComponent   // {5}
            }
        ]
    }

    // {path: 'login', component: LoginComponent},
    // {path: 'home', component: HomeComponent},
    // {path: 'search', component: SearchComponent},
    // {path: 'abalobifn', component: AbalobifnComponent,
    //     children: [
    //         {path: '', redirectTo: 'jobs', pathMatch: 'full'},
    //         {path: 'jobs', component: JobstableComponent},
    //         {path: 'view/:id', component: ViewjobComponent}
    //     ]
    // },
    // {
    //     path: 'search/fisher/:id', component: FisherDetailComponent,
    //     children: [
    //         {path: '', redirectTo: 'trips', pathMatch: 'full'},
    //         {path: 'trips', component: FisherTripsComponent},
    //         {path: 'bio', component: FisherBioComponent}
    //     ]
    // },
    // {
    //     path: 'statistics', component: StatisticsComponent,
    //     children: [
    //         {path: '', redirectTo: 'list', pathMatch: 'full'},
    //         {path: 'communities/list', component: CommunitiesListComponent},
    //         {path: 'communities/:id/fishers', component: CommunitiesFishersComponent}
    //     ]
    // },
    // {
    //     path: 'tools', component: ToolsComponent,
    //     children: [
    //         {path: '', redirectTo: 'odk', pathMatch: 'full'},
    //         {path: 'messaging', component: MessagingComponent},
    //         {path: 'odk', component: OdkComponent},
    //         {path: 'links', component: LinksComponent}
    //         // {path: 'datatools', component: DataToolsComponent}
    //     ]
    // },
    // {
    //     path: 'registrations', component: RegistrationsComponent,
    //     children: [
    //         {path: '', redirectTo: 'list', pathMatch: 'full'},
    //         {path: 'list', component: RegistrationsListComponent},
    //     ]
    // },
    // {
    //     path: 'analytics', component: RegistrationsComponent,
    //     children: [
    //         {path: '', redirectTo: 'endpointusage', pathMatch: 'full'},
    //         {path: 'endpointusage', component: EndpointUsageComponent},
    //     ]
    // }
];



@NgModule({
    imports: [
        CommonModule,
        RouterModule.forRoot(routes)
    ],
    declarations: [],
    exports: [RouterModule]
})


export class AppRoutingModule {
}
