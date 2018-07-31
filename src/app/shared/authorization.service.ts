import {Injectable} from '@angular/core';
import {AuthenticationDetails, CognitoUser, CognitoUserPool, CognitoUserAttribute} from 'amazon-cognito-identity-js';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Router, NavigationEnd} from '@angular/router';

const poolData = {
  UserPoolId: 'us-west-2_3ESTFwePr',
  ClientId: '64ug90dmk6i893jah33fjhmss3'
};

const userPool = new CognitoUserPool(poolData);

@Injectable()
export class AuthorizationService {
  cognitoUser: any;
  redirectUrl: string;
  userPassword: any = '';

  constructor(private _http: HttpClient, public jwtHelper: JwtHelperService, private router: Router) {
  }

  register(email, password, mobileNumber, username) {
    const dataEmail = {
      Name: 'email',
      Value: email // your email here
    };
    const dataPhoneNumber = {
      Name: 'phone_number',
      Value: mobileNumber// your phone number here with +country code and no delimiters in front
    };
    const attributeList = [];
    const attributeEmail = new CognitoUserAttribute(dataEmail);
    const attributePhoneNumber = new CognitoUserAttribute(dataPhoneNumber);

    attributeList.push(attributeEmail);
    attributeList.push(attributePhoneNumber);
    return Observable.create(observer => {
      userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) {
          console.log('signUp error', err);
          observer.error(err);
        } else {
          this.cognitoUser = result.user;
          console.log('signUp success', result);
          observer.next(result);
          observer.complete();
        }
      });
    });

  }

  confirmAuthCode(code) {
    const user = {
      Username: this.cognitoUser.username,
      Pool: userPool
    };
    return Observable.create(observer => {
      const cognitoUser = new CognitoUser(user);
      cognitoUser.confirmRegistration(code, true, function (err, result) {
        if (err) {
          console.log(err);
          observer.error(err);
        }
        console.log('confirmAuthCode() success', result);
        observer.next(result);
        observer.complete();
      });
    });
  }

  signIn(email, password) {

    const authenticationData = {
      Username: email,
      Password: password,
    };
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    const userData = {
      Username: email,
      Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);

    return Observable.create(observer => {

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
          console.log(result);
          observer.next(result);
          observer.complete();
        },
        onFailure: function (err) {
          console.log(err);
          observer.error(err);
        },
      });
    });
  }

  isLoggedIn() {
    return userPool.getCurrentUser() != null;
  }

  getAuthenticatedUser() {
    // gets the current user from the local storage
    return userPool.getCurrentUser();
  }

  logOut() {
    /*  this.getAuthenticatedUser().signOut();
     this.cognitoUser = null; */
    // this.sessionService.logOut();
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  forgotPassword(userEmail) {
    const user = {
      Username: userEmail,
      Pool: userPool
    };
    return Observable.create(observer => {
      const cognitoUser = new CognitoUser(user);
      cognitoUser.forgotPassword({
        onSuccess: function (data) {

          // successfully initiated reset password request
          console.log('CodeDeliveryData from forgotPassword: ' + data);
        },
        onFailure: function (err) {
          console.log(err);
          observer.error(err);
        },
        // Optional automatic callback
        inputVerificationCode: function (data) {
          console.log('Code sent to: ' + data);
          const verificationCode = prompt('Please input verification code ', '');
          const newPassword = prompt('Enter new password ', '');
          cognitoUser.confirmPassword(verificationCode, newPassword, {
            onSuccess() {
              const data = true;
              observer.next(data);
              observer.complete();

              console.log('Password confirmed!');
            },
            onFailure(err) {
              console.log(err);
              console.log('Password not confirmed!');
            }
          });
        }
      });

    });


  }

  logIn(url, credentials): any {
    return this._http.post(url, credentials).map(res => {
      return res;
    });
  }

  contactUs(url, credentials): any {
    return this._http.post(url, credentials).map(res => {
      return res;
    });
  }

  setUserData(details) {
    localStorage.setItem('details', JSON.stringify(details));
  }

  getUserData() {
    return localStorage.getItem('details');
  }

  setUsername(username) {
    localStorage.setItem('username', username);
  }

  getUsername() {
    return localStorage.getItem('username');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  setToken(token) {
    localStorage.setItem('token', token);
  }

  removeToken() {
    localStorage.removeItem('token');
  }

  setRole(role) {
    localStorage.setItem('role', role);
  }

  getRole() {
    return localStorage.getItem('role');
  }

  public isAuthenticated(): boolean {

    const token = localStorage.getItem('token');

    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(token);
  }

  setPassword(password) {
    this.userPassword = password;
  }

  getPassword() {
    return this.userPassword;
  }
}
