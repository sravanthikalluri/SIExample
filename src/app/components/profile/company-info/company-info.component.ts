import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppState} from '../../../app.state';
import {Store} from '@ngrx/store';
import {AuthorizationService} from '../../../shared/authorization.service';
import {ProfileService} from '../shared/profile.service';

@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['../../profile/profile-information/profile-info.component.css', './company-info.component.css']
})
export class CompanyInfoComponent {
  imagePath: any;
  public canEdit = false;
  public passwordForm: FormGroup;
  companyName: any;
  public currentPassword: any;
  public isPasswordVerified = false;
  public newPassword: any = '';
  public confirmPassword: any = '';
  public details: any;
  public showMessage = false;

  public passwordRules = [
    'One uppercase character',
    'One lowercase character',
    'One special case character',
    'One number',
    'Minimum 8 Characters and Maximun 16 Characters'
  ];

  public validation_messages = {
    'cpassword': [
      {type: 'required', message: 'Username is required'},
    ],
    'npassword': [
      {type: 'required', message: 'New Password is required'},
      {type: 'pattern', message: 'Enter a valid Password'},
    ],
    'cnfmpassword': [
      {type: 'required', message: 'Re-enter Password'},
    ],
  };

  public onEdit() {
    this.canEdit = true;
  }

  public onSave() {
    this.canEdit = false;
    this._ProfileService.companyName.next(this.companyName);
    this._authService.setUserData(this.details);
  }

  constructor(private fb: FormBuilder,
              private store: Store<AppState>,
              private _authService: AuthorizationService,
              private _ProfileService: ProfileService) {
    this.isPasswordVerified = false;

    this.passwordForm = fb.group({
      cpassword: ['', Validators.compose([Validators.required, Validators.maxLength(16), Validators.minLength(8)])],
      npassword: ['', Validators.compose([Validators.required, Validators.maxLength(16), Validators.minLength(8),
        Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')])],
      cnfmpassword: ['', Validators.compose([Validators.required, Validators.maxLength(16), Validators.minLength(8)])]
    });
    this.details = JSON.parse(this._authService.getUserData());
    if (this.details['CompanyName'] === undefined) {
      this.companyName = 'Company Name';
    } else {
      this.companyName = this.details['CompanyName'];
    }
    if (this._ProfileService.getCompanyLogo() === undefined) {
      this.imagePath = '../assets/images/sample.PNG';
    } else {
      this.imagePath = this._ProfileService.getCompanyLogo();
    }
    this.currentPassword = this._authService.getPassword();

  }

  verifyPassword(event) {
    console.log(event.target.value);
    if (event.target.value === this.currentPassword) {
      this.isPasswordVerified = true;
    }
  }

  newPasswordChange(event) {
    this.newPassword = event.target.value;
  }

  confirmPasswordChange(event) {
    this.confirmPassword = event.target.value;
  }

  updatePassword() {
    if (this.passwordForm.value['npassword'] === this.passwordForm.value['cnfmpassword']) {
      const postData = {
        'Username': this.details.sub,
        'Password': this.passwordForm.value['cnfmpassword'],
        'FirstName': this.details.FirstName,
        'LastName': this.details.LastName,
        'Email': this.details['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
        'Customer': {
          'Id': this.details.CustomerId,
          'Name': this.companyName
        },
        'Role': {
          'Name': this._authService.getRole()
        }
      };

      this._ProfileService.updateProfileInfo(postData).subscribe(res => {
        this.showMessage = true;
        setTimeout(() => {
          this.showMessage = false;
        }, 5000);
        this.currentPassword = this.passwordForm.value['cnfmpassword'];
        this._authService.setPassword(this.currentPassword);
        this.passwordForm.reset();
      });
    }
  }

  uploadCompanyLogo(event: any) {
    const formData = new FormData();
    formData.append(event.target.files[0].name, event.target.files[0]);
    this.uploadPhoto(formData, true);
  }

  uploadPhoto(formData: any, flag) {
    this._ProfileService.updateProfilePicture(this._ProfileService.getCustomerId(), formData, flag).subscribe(res => {
      this.imagePath = res['uploadedurl'];
      this.details['CompanyLogo'] = res['uploadedurl'];
      this._ProfileService.setCompanyLogo(res['uploadedurl']);
      this._authService.setUserData(this.details);
    });
  }
}
