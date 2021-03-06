import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthToken } from './auth-token';
import { AuthResource } from './auth.resource';
import { UserResource } from './user.resource';
import { Credentials } from './credentials';
import { ChangePasswordParams } from './change-password-params';
import { HttpErrorResponse } from '@angular/common/http';

const guest: IUserProfile = {
  email: '',
  emailValid: false,
  role: 'guest'
};

@Injectable()
export class Auth {
  public currentUser: IUserProfile = guest;

  constructor(public router: Router,
              private authToken: AuthToken,
              private authResource: AuthResource,
              private accountResource: UserResource) {
    if (this.isLoggedIn) {
      this.updateProfile();
    }

    this.authToken.tokenChange.subscribe(
      (token: string) => {
        if (!token) {
          this.onSignOut();
        }
      }
    );
  }

  public get isLoggedIn(): boolean {
    return Boolean(this.authToken.token);
  }

  public hasRole(role: string): boolean {
    return this.currentUser.role === role;
  }

  public signIn(params: Credentials): Observable<any> {
    let req = this.authResource.signin(params);
    req.subscribe(
      response => {
        this.onSignIn(response);
      },
      (error: HttpErrorResponse) => {
        console.error(error.message);
      }
    );
    return req;
  }

  public signOut(): void {
    this.authToken.reset();
  }

  public signUp(params: Credentials): Observable<any> {
    let req = this.authResource.signup(params);
    req.subscribe(
      response => {
        this.onSignIn(response);
      },
      (error: HttpErrorResponse) => {
        console.error(error.message);
      }
    );
    return req;
  }

  public changePassword(params: ChangePasswordParams): Observable<any> {
    let req = this.accountResource.changePassword(params);
    req.subscribe(
      () => {
        this.router.navigate(['/']);
      },
      (error: HttpErrorResponse) => {
        console.error(error.message);
      }
    );
    return req;
  }

  public setPassword(params: {token: string; password: string}) {
    let req = this.accountResource.setPassword(params);
    req.subscribe(
      () => {
        this.router.navigate(['/signin']);
      },
      (error: HttpErrorResponse) => {
        console.error(error.message);
      }
    );
    return req;
  }

  private onSignIn(response): void {
    let res = response;
    this.authToken.token = res['token'];
    this.authToken.refreshToken = res['refreshToken'];
    this.currentUser = res['user'];
    this.router.navigate(['/']);
  }

  private onSignOut(): void {
    this.currentUser = guest;
    this.router.navigate(['/signin']);
  }

  private updateProfile(): void {
    let req = this.accountResource.profile();
    req.subscribe(
      response => {
        this.currentUser = response;
      },
      (error: HttpErrorResponse) => {
        console.error(error.message);
      }
    );
  }
}
