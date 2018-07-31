import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthorizationService} from '../../../shared/authorization.service';
import {ProfileService} from '../shared/profile.service';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css']
})
export class ProfileInfoComponent {
  title = 'Profile Details';
  imagePath: any;
  companyName = '';

  public profileInfo: FormGroup;
  public validation_messages = {
    'uname': [
      {type: 'required', message: 'Username is required'},
      {type: 'minlength', message: 'Username must be at least 6 characters long'},
      {type: 'maxlength', message: 'Username cannot be more than 40 characters long'},
    ],
    'fname': [
      {type: 'required', message: 'Firstname is required'},
      {type: 'minlength', message: 'Firstname must be at least 6 characters long'},
      {type: 'maxlength', message: 'Firstname cannot be more than 40 characters long'},
    ],
    'lname': [
      {type: 'required', message: 'Lastname is required'},
      {type: 'minlength', message: 'Lastname must be at least 6 characters long'},
      {type: 'maxlength', message: 'Lastname cannot be more than 40 characters long'},
    ],
    'email': [
      {type: 'required', message: 'Email is required'},
      {type: 'pattern', message: 'Enter a valid email'}
    ]
  };
  public details: any;
  public password: string;

  constructor(private fb: FormBuilder,
              private _authService: AuthorizationService,
              private _ProfileService: ProfileService) {
    this.profileInfo = fb.group({
      uname: ['', Validators.compose([Validators.maxLength(40), Validators.minLength(6), Validators.required])],
      fname: ['', Validators.compose([Validators.maxLength(40), Validators.minLength(6), Validators.required])],
      lname: ['', Validators.compose([Validators.maxLength(40), Validators.minLength(1), Validators.required])],
      email: ['', Validators.compose([Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'), Validators.required])]
    });
    this.details = JSON.parse(this._authService.getUserData());
    this.profileInfo.get('uname').setValue(this.details['sub']);
    this.profileInfo.get('fname').setValue(this.details['FirstName']);
    this.profileInfo.get('lname').setValue(this.details['LastName']);
    this.profileInfo.get('email').setValue(this._authService.getUsername());
    if (this.details['ProfilePhotoPath'] === undefined) {
      this.imagePath = '../assets/images/sample.PNG';
    } else {
      this.imagePath = this.details['ProfilePhotoPath'];
    }
    this._ProfileService.companyName.subscribe((companyName) => {
      this.companyName = companyName;
    });
  }

  uploadProfileImage(event: any) {
    const formData = new FormData();
    formData.append(event.target.files[0].name, event.target.files[0]);
    // 300000
    this.uploadPhoto(formData, false);
  }

  uploadPhoto(formData: any, flag) {
    this._ProfileService.updateProfilePicture(this._ProfileService.getUserId(), formData, flag).subscribe(res => {
      console.log(res);
      this.imagePath = res['uploadedurl'];
      this.details['ProfilePhotoPath'] = res['uploadedurl'];
      this._ProfileService.setProfilePath(res['uploadedurl']);
      this._authService.setUserData(this.details);
    });
  }

  public updateInfo() {
    const postData = {
      'Username': this.profileInfo.value['uname'],
      'Password': this._authService.getPassword(),
      'FirstName': this.profileInfo.value['fname'],
      'LastName': this.profileInfo.value['lname'],
      'Email': this.profileInfo.value['email'],
      'Customer': {
        'Id': this.details.CustomerId,
        'Name': this.companyName
      },
      'Role': {
        'Name': this._authService.getRole()
      }
    };

    this._ProfileService.updateProfileInfo(postData).subscribe(res => {
      console.log(res);
    });
  }
}
