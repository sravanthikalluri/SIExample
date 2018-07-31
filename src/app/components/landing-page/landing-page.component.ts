import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as $ from 'jquery';
declare var $: any;
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Token } from './token.interface';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { environment } from '../../../environments/environment';
import * as jwt_decode from 'jwt-decode';
import { AuthorizationService } from '../../shared/authorization.service';
import 'rxjs/add/operator/map';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import {Store} from '@ngrx/store';
import {AppState} from '../../app.state';
@Component({
    selector: 'si-landing-page',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.css'],
    providers: [NgbCarouselConfig]
})

export class LandingPageComponent implements OnInit {
    isLoginClicked: boolean = true;
    modalRef: NgbModalRef;
    confirmCode: boolean = false;
    codeWasConfirmed: boolean = false;
    error: string = "";
    authCode: any;
    showMessage:boolean = false;
    message: string;
    loginForm: FormGroup;
    registerForm: FormGroup;
    contactUsForm: FormGroup;
    tokenInfo: Token;
    emailVerificationMessage: boolean = false;
    showForgotPassword: boolean = false;
    showLoginButton: boolean = false;
    public loader: Boolean = false;



    constructor(private router: Router, private modalService: NgbModal,
                private _fb: FormBuilder,
                private _authService: AuthorizationService,
                private config: NgbCarouselConfig,
                private  store: Store<AppState>) {
        this.loginForm = this._fb.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required]]
        })
        this.registerForm = this._fb.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required]],
            email: ['', [Validators.required]],
            mobileNumber: ['', [Validators.required]],
        })
        this.contactUsForm = this._fb.group({
            username: ['', [Validators.required]],
            email: ['', [Validators.required]],
            phone: ['', [Validators.required]],
            message: ['', []],
        })

        config.interval = 1000;
        config.wrap = false;
        config.keyboard = false;

    }

    open(content) {
        this.modalRef = this.modalService.open(content, { size: 'lg' });
    }


    ngOnInit() {

        this.message = "";

    }

    clickToScroll() {
        $(".scroll").click(function (event) {
            event.preventDefault();
            $('html,body').animate({ scrollTop: $(this.hash).offset().top }, 1000);
        });
        $("a").on('click', function (event) {
            if (this.hash !== "") {
                event.preventDefault();
                var hash = this.hash;
                setTimeout({
                    scrollTop: $(hash).offset().top
                }, 1000);
            }
        });
  }

  clickToRunDown() {
    $(document).ready(function () {
     // $("#scrollDown").click(function () {
        $('html, body').animate({
          scrollTop: $("#voice-of-customer-metrics").offset().top
        }, 2000);
     // });
    });
  }

  clickToRunContact() {

    $(document).ready(function () {
     // $("#Contact").click(function () {
        $('html, body').animate({
          scrollTop: $("#contact-location").offset().top
        }, 2000);
      //});
    });
  }

  clickToRunDownone() {
    $(document).ready(function () {
   //   $("#AgentPx").click(function () {
        $('html, body').animate({
          scrollTop: $("#contact-location").offset().top
        }, 2000);
      //});
    });
  }

  clickToRunDowntwo() {
    $(document).ready(function () {
     // $("#CustomerSx").click(function () {
        $('html, body').animate({
          scrollTop: $("#contact-location").offset().top
        }, 2000);
      //});
    });
  }

  clickToRunDownthree() {
    $(document).ready(function () {
    //  $("#CallTx").click(function () {
        $('html, body').animate({
          scrollTop: $("#contact-location").offset().top
        }, 2000);
     // });
    });
  }

  clickToRunTop() {
  $(window).scroll(function() {
    var height = $(window).scrollTop();
    if (height > 100) {
      $('#toTop').fadeIn();
    } else {
      $('#toTop').fadeOut();
    }
  });
  $(document).ready(function() {
    $("#toTop").click(function (event) {
      event.preventDefault();
      $("html, body").animate({ scrollTop: 0 }, "slow");
      return false;
    });

    });
    }
    /*   loginUser() {
          const username = this.loginForm.controls['username'].value;
          const password = this.loginForm.controls['password'].value;

          this.auth.signIn(username, password).subscribe((data) => {
              this.modalRef.close();
              this.router.navigate(['/dashboard']);
              window.location.reload();
          }, (err) => {
              this.emailVerificationMessage = true;
          });
      }

      validateAuthCode(form: NgForm) {
          const code = form.value.code;
          this._authService.confirmAuthCode(code).subscribe(
              (data) => {
                  this.codeWasConfirmed = true;
                  this.confirmCode = false;
              },
              (err) => {
                  console.log(err);
                  this.error = "Confirm Authorization Error has occurred";
              });
      }

      registerUser() {
          const email = this.registerForm.controls['email'].value;
          const mobileNumber = this.registerForm.controls['mobileNumber'].value;
          const username = this.registerForm.controls['username'].value;
          const password = this.registerForm.controls['password'].value;
          this._authService.register(email, password, mobileNumber, username).subscribe(
              (data) => {
                  this.confirmCode = true;
              },
              (err) => {
                  console.log(err);
                  this.error = "Registration Error has occurred";
              }
          );

      }

      forgotPassword(userEmail) {
          this._authService.forgotPassword(userEmail).subscribe(
              (data) => {
                 this.showLoginButton = true;
              },
              (err) => {

              });
      }  */
    setRole() { // setting user role
        let role = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
        const token = this._authService.getToken();
        const tokenDecoded = jwt_decode(token);
        this._authService.setRole(tokenDecoded[role]);
    }
    loginUser() {
        this.loader = true;
        let credentials = { // grabbing the value from the input fields
            username: this.loginForm.controls['username'].value,
            password: this.loginForm.controls['password'].value
        }
        this._authService.logIn(environment.user_Api, credentials).subscribe(data => { // checking credentials to login, setting token and role for the user
            this.tokenInfo = data;
            let details = this.tokenInfo;
            this.store.dispatch({ type: 'setUserName', details });
            this._authService.setToken(this.tokenInfo.auth_token);
            this._authService.setUsername(credentials.username);
            this._authService.setUserData(jwt_decode(this.tokenInfo.auth_token));
            this._authService.setPassword(this.loginForm.controls['password'].value);
            this.setRole();
            this.loader = false;
            this.modalRef.close();
            if (this._authService.redirectUrl) {
                this.router.navigateByUrl(this._authService.redirectUrl);
               
            } else {
               this.router.navigate(['/dashboard']);
              
            }
        },
            error => {
                this.loader = false;
                if (error.status === 401) {
                    this.message = 'Invalid username or password' // setting message for invalid credetials.
                }
            })
    }

    contactUs() {
        let credentials = { // grabbing the value from the input fields
            username: this.contactUsForm.controls['username'].value,
            email: this.contactUsForm.controls['email'].value,
            phone: this.contactUsForm.controls['phone'].value,
            message: this.contactUsForm.controls['message'].value
        }
        this._authService.contactUs(`${environment.transcription_Api}/api/user/ContactUs`, credentials).subscribe(data => {
             if(data){
                 this.showMessage = true;
                 console.log(data)
             }
             setTimeout(() => {
                this.showMessage = false;
             }, 5000);
        },error => {

            })
        console.log(credentials);
        this.contactUsForm.reset();
    }
}
