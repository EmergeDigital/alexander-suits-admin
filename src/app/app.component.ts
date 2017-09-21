import { Component } from '@angular/core';
import {AuthService} from './services/auth.service';
import {environment} from '../environments/environment';
import {DataService} from './services/data.service';
import { Router } from '@angular/router';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import {User} from "./models/user";

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  app_name = 'Alexander Suits';
  isAuthenticated: boolean;
  user: any;
  current_user: User;
  hasRun: boolean;
  loadingToast: any;


  constructor(public auth: AuthService, public data: DataService, private toastyService:ToastyService, private toastyConfig: ToastyConfig, public router: Router) {

        // auth._authenticating.subscribe(authenticating => {
        //   if(authenticating) {
        //     console.log("Authing");

        //   } else {
        //     console.log("lolno");
        //     this.isAuthenticated = false;
        //   }
        // })
        // auth.parseAuth().then(authenticated => {
        //   console.log("LELWUT");
        //   this.isAuthenticated = authenticated;
        //   if(authenticated) {
        //     auth._user.subscribe(user => {
        //         this.user = user;
        //         this.checkAuth();
        //     });
        //     // auth.getCurrentUser(null).then(u => {
        //     //   this.user = u;
        //     //   this.checkAuth();
        //     // });
        //   } else {
        //     console.log("LOL NOT AUTHORIZED");
        //     this.router.navigate(['login']);
        //   }
        // }).catch(ex => {
        //     console.log(ex);
        //     var toastOptions:ToastOptions = {
        //       title: "Log In Error",
        //       msg: "There was an error while logging in, please try again"
        //     };
        //
        //     this.toastyService.error(toastOptions);
        // });
        // console.log("IM HERE");

        // if (environment.useAuth) {
        //     if (!auth.isAuthenticated()) {
        //         // If the user is not authenticated go to the login screen.
        //         auth.logout();
        //
        //         auth.handleAuthentication();
        //         // auth.handleAuthenticationWithHash();
        //         auth.login();
        //     }
        // }

        this.title = 'app works!';
        this.app_name = 'Alexander Suits';
        this.toastyConfig.theme = 'material';
        this.hasRun = false;


        // this.isAuthenticated = auth.isAuthenticated();
        //
        // if(this.isAuthenticated) {
        //   auth.getCurrentUser(null).then(u => {
        //     this.user = u;
        //     this.checkAuth();
        //   });
        // }
        //
        // auth._authenticated.subscribe(isAuthenticated => {
        //   this.isAuthenticated = isAuthenticated;
        //   if(this.isAuthenticated) {
        //     auth.getCurrentUser(null).then(u => {
        //       this.user = u;
        //       this.checkAuth();
        //     });
        //   }
        // });
    }

    ngOnInit() {
        $(document).ready(() => {
            if (!this.auth.isAuthenticated()) {
                // If the user is not authenticated go to the login screen.
                this.auth.logout();
                this.auth.handleAuthentication();
                // auth.handleAuthenticationWithHash();
                // this.auth.login();
            } else {
              this.isAuthenticated = true;
            }
            // this.auth._authenticated.subscribe(isAuthenticated => {
            //   this.isAuthenticated = isAuthenticated;
            //   if(this.isAuthenticated) {
            //     this.auth.getCurrentUser(null).then(u => {
            //       this.user = u;
            //       this.checkAuth();
            //     });
            //   }
            // });
        });
    }

    logout(): void {
       this.auth.logout();
       window.location.reload();
    }

    login(): void {
        this.auth.login();
    }

    checkAuth() {
    // console.log(this.user);
      if(!!this.user && !this.hasRun){
        this.hasRun = true;
        // console.log("LOLWUT");
        this.data.getUser(this.user.id).then((user)=>{
          if(user.status !== "does_not_exist") {
            //Do stuff
            // console.log(user);
            //Restore session etc?

            var toastOptions:ToastOptions = {
              title: "Logged In",
              msg: "Session is being restored",
              timeout: 60000,
              showClose: false,
              onAdd: (toast: ToastData) => {
                this.loadingToast = toast.id;
              }
            };

            this.toastyService.wait(toastOptions);

           setTimeout( () => this.finishLoading() , 3000 );
          } else {
            // console.log(this.user);
            console.log("CREATING ACCOUNT");
            this.data.createUser(this.user.id, this.user.email).then(response=>{
              // console.log(response);
              //Restore session etc?

              var toastOptions:ToastOptions = {
                title: "Account Created",
                msg: "Session is being restored",
                timeout: 60000,
                showClose: false,
                onAdd: (toast: ToastData) => {
                  this.loadingToast = toast.id;
                }
              };

              this.toastyService.wait(toastOptions);
              //For now, do not rebuild session

              setTimeout( () => this.finishLoading() , 3000 );
            });
          }
        }, (err) => {
          console.log("Error getting user: " + err);
        });
      }
      return;
    }

    finishLoading() {
       this.toastyService.clear(this.loadingToast);
       this.loadingToast = null;

       var toastOptions:ToastOptions = {
         title: "Session Restored",
         msg: "Navigating you now"
       };

       this.toastyService.success(toastOptions);
       //For now, do not rebuild session
      //  this.router.navigate(['/']);
    }
}
