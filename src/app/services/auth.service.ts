import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { environment } from '../../environments/environment';
// import * as auth0 from 'auth0-js';
import Auth0Lock from 'auth0-lock';
// import {DataService} from "./data.service";

@Injectable()
export class AuthService {

  // auth0 = new auth0.WebAuth({
  //   clientID: 'VO9x2cg0a8V3Msca5FmrrnR5yKyakbT4',
  //   domain: 'bloom.au.auth0.com',
  //   responseType: 'token id_token',
  //   audience: 'alexander-suits',
  //   redirectUri: 'alexander-suits',
  //   scope: 'openid email name'
  // });
  _authenticated: EventEmitter<boolean> = new EventEmitter();
  _authenticating: EventEmitter<boolean> = new EventEmitter();
  user: any;
  _user: EventEmitter<any> = new EventEmitter();

  lock = new Auth0Lock(
       'VO9x2cg0a8V3Msca5FmrrnR5yKyakbT4',
       'bloom.au.auth0.com',
        {
            theme: {
              logo: 'asd',
              primaryColor: '#830024'
            },
           oidcConformant: true,
           autoclose: true,
           auth: {
               redirectUrl: 'alexander-suits',
               responseType: 'token id_token',
               audience: 'alexander-suits',
               params: {
                   scope: 'openid email name roles'
               }
           }
         });


  constructor(public router: Router) {}

  // public login(): void {
  //   this.auth0.authorize();
  // }

  public login(): void {
        this.lock.show();
    }

  public parseAuth(): Promise<boolean> {
    return new Promise ((resolve, reject) => {
      if(this.isAuthenticated()) {
        let token = localStorage.getItem('access_token');
        // this.getCurrentUser(token).then((user)=>{
        //   this._user.emit(this.user);
        //   // console.log(this.user);
        // })

        this._authenticated.emit(true);
        resolve(true);
      } else {
        this._authenticating.subscribe(authenticating => {
          if(authenticating) {
            this._authenticated.subscribe(authenticated => {
              resolve(authenticated);
            });
          } else {
            reject(false);
          }
        });
        this.handleAuthentication();
      }
    });
  }

  public handleAuthentication(): void {
       this.lock.on('authenticated', (authResult) => {
           if (!!authResult && authResult.accessToken && authResult.idToken) {
               this._authenticating.emit(true);
              //  console.log(authResult.idToken);
               this.getCurrentUser(authResult).then(user=>{
                 console.log(user);
               });
           }
       });
       this.lock.on('authorization_error', (err) => {
          this._authenticating.emit(false);
          this._authenticated.emit(false);
           this.router.navigate(['']);
           console.log(err);
           alert(`Error: ${err.error}. Check the console for further details.`);
       });
   }

  // public handleAuthenticationWithHash(): void {
  //   this.auth0.parseHash((err, authResult) => {
  //     if(!!authResult) {
  //       if (authResult && authResult.accessToken && authResult.idToken) {
  //         console.log("HALLO");
  //         this._authenticating.emit(true);
  //         window.location.hash = '';
  //         this.setSession(authResult);
  //         this.router.navigate(['/home']);
  //         this.getCurrentUser(authResult.accessToken).then((user)=>{
  //           this._user.emit(this.user);
  //         })
  //         // this.auth0.client.userInfo(authResult.accessToken, (err, user) =>{
  //         //   //Do something with user information
  //         //   this.user = this.getUserID(user);
  //         //
  //         //   this._user.emit(this.user);
  //         //   // console.log(this.getUserID(user));
  //         //   // this.data.setUser(this.getUserID(user));
  //         // });
  //       } else {
  //         this._authenticating.emit(false);
  //         this.router.navigate(['/home']);
  //         console.log("There was an error");
  //       }
  //     } else {
  //       this._authenticating.emit(false);
  //       this.router.navigate(['/login']);
  //       // console.log(err);
  //     }
  //
  //     if(err) {
  //       this._authenticating.emit(false);
  //       this.router.navigate(['/home']);
  //       console.log(err);
  //
  //     }
  //
  //   });
  // }

  public getUserID(user) {
    let userParts = user.sub.split('|');
    return userParts[1];
  }

  public getCurrentUser(authResult) {
    return new Promise((resolve, reject) => {
        this.lock.getUserInfo(authResult.accessToken, (err, user) =>{
          //Do something with user information
          console.log(user["https://alexandersuits.com/roles"]);
          let id = this.getUserID(user);
          this.user = {
            id: id,
            email: user.email,
            roles: user["https://alexandersuits.com/roles"]
          };

          let flag = false;
          if(!!this.user.roles) {
            for (let role of this.user.roles){
              if(role === "admin") {
                flag = true;
              }
            }
          }

          if (flag) {
            this.setSession(authResult);
            this.router.navigate(['/home']);
            this._authenticated.emit(true);
            this._authenticating.emit(false);
            resolve(this.user);
          } else {
              this.router.navigate(['/login']);
              this._authenticated.emit(false);
              this._authenticating.emit(false);
              resolve(null);
          }
          // console.log(user['roles.as']);
        });

    });
  }

  //USER INFO REFERENCE
  /*
  {
      "email_verified": "false",
      "email": "test@example.com",
      "clientID": "AAAABBBBCCCCDDDDEEEEFFFFGGGGHHHH",
      "updated_at": "2017-02-07T20:50:33.563Z",
      "name": "tester9@example.com",
      "picture": "https://gravatar.com/avatar/example.png",
      "user_id": "auth0|123456789012345678901234",
      "nickname": "tester9",
      "identities": [
          {
              "user_id": "123456789012345678901234",
              "provider": "auth0",
              "connection": "Username-Password-Authentication",
              "isSocial": "false"
          }
      ],
      "created_at": "2017-01-20T20:06:05.008Z",
      "sub": "auth0|123456789012345678901234"
  }
*/

  private setSession(authResult): void {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    // console.log(localStorage.getItem('access_token'));
    // console.log(localStorage.getItem('id_token'));
    // console.log(localStorage.getItem('expires_at'));
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // Go back to the home route
    this._authenticated.emit(false);
    this._authenticating.emit(false);
    this.router.navigate(['/login']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    let returnVal = new Date().getTime() < expiresAt;
    return returnVal;
  }

}
